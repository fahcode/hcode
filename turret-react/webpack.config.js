const path = require('path');
const webpack = require("webpack");


//将组件中的样式乖乖提取出来
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelPluginImport = require('babel-plugin-import');


var ENV = process.env.NODE_ENV;
var DEV = ENV != 'production';

/***********
注意在使用webpack2使用ExtractTextPlugin，loader不能使用use的数组
***********/
//webpck插件
var plugins = [
    //提公用js到common.js文件中
    new webpack.optimize.CommonsChunkPlugin('common'),
    //html插件
    new HtmlWebpackPlugin({
        title: "【仙侠世界2】 大转盘 送福利",
        template: "./src/index.html",
        filename: "index.html",
        inject: false,
        hash: true
        //console: "//cdnsapi.ztgame.com/site/js/console/main.js"
    }),
    //将样式统一发布到style.css中
    new ExtractTextPlugin({
        filename: "style.css",
        allChunks: true,
        disable: false
    }),
    // 使用 ProvidePlugin 加载使用率高的依赖库
    new webpack.ProvidePlugin({
        $: 'jQuery',
        jQuery:"jQuery",
        "window.jQuery":"jQuery"
    }),
    ///处理提示非开发环境的错误
    new webpack.DefinePlugin({
      "process.env": { 
         NODE_ENV: JSON.stringify("production") 
       }
    })
];

///路径配置
const outpath = DEV? (__dirname + '/_dist/'): "//192.168.12.132/common/xx2/act/zp/";

module.exports = {
  //devtool: 'inline-source-map',
  entry: {
    main: "./src/entry.js"
  },
  output: {
    path: outpath,
    filename: 'js/[name].js',
    //给require.ensure用
    //chunkFilename: "Components/[name].[chunkhash:5].js"
    chunkFilename: "Components/[name].js"
    //publicPath: '../../tool/avalon/',
  },
  module: {
    rules: [
      { 
        test: /\.js[x]?$/, 
        //loader: "babel-loader?presets[]=es2015&presets[]=react",
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', "es2015", "stage-2"]
              //plugins: ["transform-runtime"]
            }
          }
        ],
        include: /src/
      },
      { 
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          loader: 'css-loader!sass-loader?sourceMap=true'
        })
        //use: ['style-loader', 'css-loader', 'sass-loader?outputStyle=expanded']
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        //file-loader?name=images/[name].[hash:5].[ext]   
        loader: 'url-loader?limit=16384&name=images/[name].[ext]?v=[hash:5]'
      },
      {
        test: /\.(mp4|ogg|svg)$/,
        loader: 'file-loader?name=video/[name].[ext]'
      }
    ]
  },
  plugins: plugins,
  devServer: {
      port: parseInt(Math.random()*(9999-1000+1)+ 1000),
      /////在这里使用inline才会自动刷新
      ///--hot --inline 
      //inline: true,
      proxy: {
          '/act/*': {
             target: 'http://xx2.web.ztgame.com',
             changeOrigin: true,
             secure: false
          }
       }
  }
}


////生产环境添加压缩
if(!DEV){
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false, screw_ie8: false },
            mangle: { screw_ie8: false },
            output: { screw_ie8: false }
        })
    )
}