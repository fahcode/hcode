## 说明

*很多项目都需要gulp webpack vue react等环境，如果每个项目都得复制配置而且还要修改，会非常的麻烦。所以做了一个脚手架。*

1.使用commander、inquirer、shelljs实现参数、问答、shell命令。
2.实现了自动配置gulp\webpack,知道设置输出目录，代理地址，统计代码，微信分享等功能
3.功能还在完善中

现有的模板
```
type: {
    g: {
      text: 'pc端gulp模版--默认带有sass、代码压缩、图片压缩、热更新',
      url: "git.dev.ztgame.com/leo/pc-gulp.git",
      build: 'gulp'
    },
    p: {
      text: '简单的pc端模版--默认带有初始化css、统计代码',
      url: "git.dev.ztgame.com/sites/pc.git",
      build: 'gulp'
    },
    m: {
      text: '简单的移动端webpack模版--默认带有remjs、sass、统计代码、热更新',
      url: "git.dev.ztgame.com/sites/webpack.git",
      build: 'webpack',
      ism: true, //是否移动端
    },
    x: {
      text: '响应式的gulp模版--默认带有remjs、sass、统计代码、热更新',
      url: "git.dev.ztgame.com/sites/x-gulp.git",
      build: 'gulp',
      ism: true,
    },
    v: {
      text: 'vue模版--默认带有remjs、sass、统计代码、热更新、路由、vuex',
      url: "git.dev.ztgame.com/sites/vue-webpack.git",
      build: 'webpack',
      ism: true
    },
    r: {
      text: 'react模版--默认带有remjs、sass、统计代码、热更新、路由、redux',
      url: "git.dev.ztgame.com/leo/react-webpack.git",
      build: 'webpack',
      ism: true
    }
  }
```
