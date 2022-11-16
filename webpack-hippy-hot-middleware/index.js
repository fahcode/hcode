global.__DEBUGGER_CONNECTED__ = false;

// const URL = require("url");
const webpack = require('webpack');
const { Server: WebSocketServer } = require('ws');
const chalk = require('chalk');

// key: stats
let ids = {};
let serverSocket = null;
// 热更新客户端
let hmrClients = {};
// chrome客户端
let chromClient = null;
// android客户端
let androidClient = null;
let debugHeartbeatTimer = null;

function webpackHippyHotMiddleware(compiler, httpServer, opts) {
  const id = opts.name || getId();

  // hmr and debugger config
  const options = {
    debugHeartbeatInterval: 20000,
    ...opts,
    hmrSocketCinfig: Object.assign(
      {
        // path: "/",
        port: 38989,
        host: 'localhost',
        noServer: true,
      },
      opts.hmrSocketCinfig || {}
    ),
    socketPathConfig: Object.assign(
      {
        hmrClientPath: `/hmr/${id}`,
        chromeClientPath: '/debugger-proxy?role=chrome',
        androidClientPath: '/debugger-proxy?role=android_client',
      },
      opts.socketPathConfig || {}
    ),

    id: id,
    server: httpServer,
  };

  // create webSocketServer and set meassage
  // only needed the first time
  if (!serverSocket) {
    createWebSocketServer(options);
  }
  // webpack hmr config
  setWebpackConfig(compiler, options);

  if (compiler.hooks) {
    // compiler.hooks.invalid.tap('webpack-hot-middleware', onInvalid);
    compiler.hooks.done.tap('webpack-hot-middleware', onDone);
  } else {
    // compiler.plugin('invalid', onInvalid);
    compiler.plugin('done', onDone);
  }
  function onDone(statsResult) {
    const currentHash = ids[id] ? ids[id].hash : '';
    // 判断hash是否相同
    currentHash !== statsResult.hash &&
      hmrClients[id] &&
      sendStats([hmrClients[id]], statsResult, true);

    ids[id] = statsResult;
  }

  const middleware = function (req, res, next) {
    return next();
  };

  middleware.close = function () {
    serverSocket.close();
    serverSocket = null;
    debugHeartbeatTimer && clearInterval(debugHeartbeatTimer);
  };

  return middleware;
}

function createWebSocketServer(options) {
  const {
    id,
    server: httpServer,
    hmrSocketCinfig,
    socketPathConfig,
    debugHeartbeatInterval,
  } = options;

  serverSocket = new WebSocketServer(
    hmrSocketCinfig.noServer
      ? {
          clientTracking: false,
          noServer: true,
        }
      : hmrSocketCinfig
  );
  // debug socket heartbeatInterval
  debugHeartbeatTimer = setInterval(() => {
    if (chromClient && androidClient) {
      if (!chromClient.isAlive) {
        chromClient.ping(() => {});
      }
      if (!androidClient.isAlive) {
        androidClient.ping(() => {});
      }
    }
  }, debugHeartbeatInterval);

  // http server upgrade事件
  httpServer.on('upgrade', (req, sock, head) => {
    serverSocket.handleUpgrade(req, sock, head, (connection) => {
      serverSocket.emit('connection', connection, req);
    });
  });
  serverSocket.on('connection', (client, req) => {
    const targetReq = client.upgradeReq || req;
    const { url } = targetReq;

    console.info('websocket connected, url = ', url);

    if (url.indexOf('/hmr') > -1) {
      // 通过客户端获取项目key
      const clientKey = url.replace('/hmr/', '');

      // 保存客户端
      hmrClients[clientKey] = client;

      // this.wsClients.set()
      client.on('close', () => {
        console.warn(`HMR ws client(${clientKey}) is closed.`);
        hmrClients[clientKey] = null;
      });
      console.log(chalk.green(`HMR ws client(${clientKey}) is connected.`));
      console.log(chalk.green(`enable HMR`));

      sendMessage([client], 'hot');
      console.log(chalk.green(`enable live reload`));

      if (ids[id]) {
        sendStats([hmrClients[id]], ids[id], true);
      }
    } else if (url.indexOf(socketPathConfig.chromeClientPath) > -1) {
      // url = /debugger-proxy?role=chrome，这里是来自Chrome的debug的链接
      chromClient = client;

      chromClient.onerror = (err) =>
        console.error('Error: chrome websocket error : ', err);

      chromClient.onclose = () => {
        console.info('chromClient closed');

        if (androidClient) {
          sendDebugMsg(androidClient, 'chrome_socket_closed');
        }

        chromClient = null;
        global.__DEBUGGER_CONNECTED__ = false;
      };

      global.__DEBUGGER_CONNECTED__ = true;

      // 收到chrome的msg就转发给终端
      chromClient.onmessage = ({ data }) => {
        const obj = JSON.parse(data);
        if (obj.method) {
          console.info('get chrome msg, method = ', obj.method, data);
        } else {
          console.info('get chrome msg : ', data);
        }

        if (androidClient) {
          sendDebugMsg(androidClient, data);
        } else {
          console.error(
            'Error: chrome msg received, but androidClient not attached'
          );
        }
      };
    } else if (url.indexOf(socketPathConfig.androidClientPath) > -1) {
      // url = /debugger-proxy?role=android_client，这里是来自于终端的socket链接
      androidClient = client;

      androidClient.onerror = (err) =>
        console.error('Error: androidClient websocket error : ', err);

      androidClient.onclose = () => {
        console.info('androidClient closed');

        androidClient = null;
        sendDebugMsg(
          chromClient,
          JSON.stringify({
            method: 'client-disconnected',
          })
        );
      };

      // 收到终端的msg就转发给chrome
      androidClient.onmessage = ({ data }) => {
        const obj = JSON.parse(data);
        if (obj.method) {
          console.info('get android msg, method = ', obj.method);
        } else {
          console.info('get android msg : ', data.slice(0, 200));
        }

        if (chromClient) {
          sendDebugMsg(chromClient, data);
        } else {
          console.error(
            'Error: androidClient msg received, but chrome not attached'
          );
        }
      };
    } else {
      console.error('Error: websocket error, no such server path');
      client.close(1011, 'Missing role param');
    }

    serverSocket.on('error', (err) => {
      console.error(err.message);
    });
  });
}

/**
 * set webpack hmr config
 * @param {*} compiler
 * @param {*} options
 */
function setWebpackConfig(compiler, options) {
  // add client/hot/dev-server和client/index.js
  let additionalEntries = [];

  // 注入热更新逻辑
  const hotEntry = require.resolve('./client/hot/dev-server');
  additionalEntries.push(hotEntry);
  additionalEntries.push(
    `${require.resolve('./client/index.js')}?hostname=${
      options.hmrSocketCinfig.host
    }&pathname=${options.socketPathConfig.hmrClientPath}&port=${
      options.hmrSocketCinfig.port
    }&protocol=ws&reconnect=10&logging=info`
  );

  compiler.options.entry = prependEntry(
    compiler.options.entry || './src',
    additionalEntries
  );
  compiler.hooks.entryOption.call(
    compiler.options.context,
    compiler.options.entry
  );

  // TODO remove after drop webpack v4 support
  compiler.options.plugins = compiler.options.plugins || [];
  // 添加热更新替换模块插件
  const HMRPluginExists = compiler.options.plugins.find(
    (p) => p.constructor === webpack.HotModuleReplacementPlugin
  );

  if (HMRPluginExists) {
    console.warn(
      '"hot: true" automatically applies HMR plugin, you don\'t have to add it manually to your webpack configuration.'
    );
  } else {
    // Apply the HMR plugin
    const plugin = new webpack.HotModuleReplacementPlugin();

    plugin.apply(compiler);
  }

  // 全局变量注入client/clients/WebSocketClient
  new webpack.ProvidePlugin({
    __webpack_dev_server_client__: require.resolve(
      './client/clients/WebSocketClient'
    ),
  }).apply(compiler);
}

function getId() {
  // 使用36位时间戳id
  let time = Date.now();
  let id = time.toString(36);
  while (ids[id]) {
    time += 1;
    id = time.toString(36);
  }
  return id;
}

/**
 * prepend entry
 * @param {*} originalEntry
 * @param {*} newAdditionalEntries
 * @returns
 */
function prependEntry(originalEntry, newAdditionalEntries) {
  if (typeof originalEntry === 'function') {
    return () =>
      Promise.resolve(originalEntry()).then((entry) =>
        prependEntry(entry, newAdditionalEntries)
      );
  }

  if (typeof originalEntry === 'object' && !Array.isArray(originalEntry)) {
    /** @type {Object<string,string>} */
    const clone = {};

    Object.keys(originalEntry).forEach((key) => {
      // entry[key] should be a string here
      const entryDescription = originalEntry[key];

      clone[key] = prependEntry(entryDescription, newAdditionalEntries);
    });

    return clone;
  }

  // in this case, entry is a string or an array.
  // make sure that we do not add duplicates.
  /** @type {Entry} */
  const entriesClone = newAdditionalEntries.slice(0);

  [].concat(originalEntry).forEach((newEntry) => {
    if (!entriesClone.includes(newEntry)) {
      entriesClone.push(newEntry);
    }
  });

  return entriesClone;
}

// Send stats to a socket or multiple sockets
function sendStats(clients, stats) {
  sendMessage(clients, 'hash', stats.hash);

  const errors = stats.errors || [];
  const warnings = stats.warnings || [];

  if (errors.length > 0 || warnings.length > 0) {
    const hasErrors = errors.length > 0;

    if (warnings.length > 0) {
      let params;

      if (hasErrors) {
        params = { preventReloading: true };
      }

      sendMessage(clients, 'warnings', warnings, params);
    }

    if (stats.errors.length > 0) {
      sendMessage(clients, 'errors', errors);
    }
  } else {
    sendMessage(clients, 'ok');
  }
}

/**
 * send hmr message to native
 * @param {*} clients
 * @param {*} type
 * @param {*} data
 * @param {*} params
 */
// eslint-disable-next-line class-methods-use-this
function sendMessage(clients, type, data, params) {
  for (const client of clients) {
    // `sockjs` uses `1` to indicate client is ready to accept data
    // `ws` uses `WebSocket.OPEN`, but it is mean `1` too
    if (client && client.readyState === 1) {
      client.send(JSON.stringify({ type, data, params }));
    }
  }
}

/**
 * forward debug message
 * @param {*} client chrome devtool or native
 * @param {*} message
 * @returns
 */
function sendDebugMsg(client, message) {
  if (!client) {
    return;
  }

  try {
    client.send(message);
  } catch (err) {
    console.warn(`sendDebugMsg ${client} error:`, err);
  }
}

module.exports = webpackHippyHotMiddleware;
