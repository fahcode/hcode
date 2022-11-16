# Webpack Hippy Hot Middleware

## Installation & Usage

See [example/](./example/) for an example of usage.

First, install the npm module.

```sh
npm install --save-dev webpack-hippy-hot-middleware
```

Next, enable hot reloading in your webpack config:

1.  Add the following plugins to the `plugins` array:

    ```js
    plugins: [
      // OccurrenceOrderPlugin is needed for webpack 1.x only
      new webpack.HotModuleReplacementPlugin(),
      // Use NoErrorsPlugin for webpack 1.x
      new HippyHMRPlugin({
        // HMR [hash].hot-update.json will fetch from this path
        hotManifestPublicPath: `http://localhost:${hippyListenPort}/dev/${projectNamePath}/`,
      }),
      new HippyReactRefreshWebpackPlugin({
        overlay: false,
        test: /\.(js|jsx|ts|tsx)/,
      }),
    ];
    ```

2.  Add `webpack-dev-middleware` the usual way

    ```js
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config');
    var compiler = webpack(webpackConfig);

    app.use(
      require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
      })
    );
    ```

3.  Add `webpack-hippy-hot-middleware` attached to the same compiler instance
    ```js
    app.use(require('webpack-hippy-hot-middleware')(compiler, httpServer));
    ```

And you're all set!
