import path from 'path'
import { realpathSync } from 'fs'
import { execFileSync } from 'child_process'
import { declare } from '@babel/helper-plugin-utils'
import { programVisitor } from './instrument'
import TestExclude from 'test-exclude'
import schema from '@istanbuljs/schema'

function getRealpath (n) {
  try {
    return realpathSync(n) || /* istanbul ignore next */ n
  } catch (e) {
    /* istanbul ignore next */
    return n
  }
}

const memoize = new Map()
/* istanbul ignore next */
const memosep = path.sep === '/' ? ':' : ';'

function loadNycConfig (cwd, opts) {
  let memokey = cwd
  const args = [
    path.resolve(__dirname, 'load-nyc-config-sync.js'),
    cwd
  ]

  if ('nycrcPath' in opts) {
    args.push(opts.nycrcPath)

    memokey += memosep + opts.nycrcPath
  }

  /* execFileSync is expensive, avoid it if possible! */
  if (memoize.has(memokey)) {
    return memoize.get(memokey)
  }

  const result = JSON.parse(execFileSync(process.execPath, args))
  const error = result['load-nyc-config-sync-error']
  if (error) {
    throw new Error(error)
  }

  const config = {
    ...schema.defaults.babelPluginIstanbul,
    cwd,
    ...result
  }
  memoize.set(memokey, config)
  return config
}

function findConfig (opts, fileName) {
  const _opts = Object.assign({}, opts)
  const cwd = getRealpath(_opts.cwd || process.env.NYC_CWD || /* istanbul ignore next */ process.cwd())
  const keys = Object.keys(_opts)
  const ignored = Object.keys(_opts).filter(s => s === 'nycrcPath' || s === 'cwd')

  if (_opts.include) {
    // 把带有行号的include
    _opts.include = _opts.include.map(path => {
      if (typeof path === 'object') {
        // 收集全部带有行号的include数据
        if (path.lines && getRealpath(path.file) === fileName) {
          _opts.lineNumber = path.lines
        }
        return path.file
      }
      return path
    })
  }

  if (keys.length > ignored.length) {
    // explicitly configuring options in babel
    // takes precedence.
    return {
      ...schema.defaults.babelPluginIstanbul,
      cwd,
      ..._opts
    }
  }

  if (ignored.length === 0 && process.env.NYC_CONFIG) {
    // defaults were already applied by nyc
    return JSON.parse(process.env.NYC_CONFIG)
  }

  return loadNycConfig(cwd, _opts)
}

function makeShouldSkip () {
  let exclude

  return function shouldSkip (file, nycConfig) {
    if (!exclude || (exclude.cwd !== nycConfig.cwd)) {
      exclude = new TestExclude({
        cwd: nycConfig.cwd,
        include: nycConfig.include,
        exclude: nycConfig.exclude,
        extension: nycConfig.extension,
        // Make sure this is true unless explicitly set to `false`. `undefined` is still `true`.
        excludeNodeModules: nycConfig.excludeNodeModules !== false
      })
    }

    return !exclude.shouldInstrument(file)
  }
}

export default declare(api => {
  api.assertVersion(7)

  const shouldSkip = makeShouldSkip()

  const t = api.types
  return {
    visitor: {
      Program: {
        enter (path) {
          this.__dv__ = null
          const realPath = getRealpath(this.file.opts.filename)
          this.nycConfig = findConfig(this.opts, realPath)
          if (realPath && shouldSkip(realPath, this.nycConfig)) {
            return
          }
          let { inputSourceMap } = this.opts
          if (this.opts.useInlineSourceMaps !== false) {
            if (!inputSourceMap && this.file.inputMap) {
              inputSourceMap = this.file.inputMap.sourcemap
            }
          }
          const visitorOptions = {}
          Object.entries(schema.defaults.instrumentVisitor).forEach(([name, defaultValue]) => {
            if (name in this.nycConfig) {
              visitorOptions[name] = this.nycConfig[name]
            } else {
              visitorOptions[name] = schema.defaults.instrumentVisitor[name]
            }
          })
          this.__dv__ = programVisitor(t, realPath, {
            ...visitorOptions,
            inputSourceMap,
            cover: this.opts.cover || {},
            lineNumber: this.nycConfig.lineNumber
          })
          this.__dv__.enter(path)
        },
        exit (path) {
          if (!this.__dv__) {
            return
          }
          const result = this.__dv__.exit(path)

          if (this.opts.onCover) {
            this.opts.onCover(getRealpath(this.file.opts.filename), result.fileCoverage)
          }
        }
      }
    }
  }
})
