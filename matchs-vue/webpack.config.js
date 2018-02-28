const {
    resolve
} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path')

/*const museUiThemePath = path.join(
    __dirname,
    'node_modules',
    'muse-ui',
    'src/styles/themes/variables/default.less'
)*/
//判断当前运行环境是开发模式还是生产模式
const ENV = process.env.NODE_ENV || 'development';
const DEV = ENV === 'development';
console.log("当前运行环境：", DEV ?
    'development' :
    'production');


//webpck插件
var plugins = [
    //热更新
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    //html模板
    new HtmlWebpackPlugin({
        // excludeChunks: ['app']
        //title: "街篮赛事中心",
        template: "./src/index.html",
        filename: "index.html",
        hash: true,
        inject: 'body'
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
        "$": "jquery",
        "jQuery": "jquery",
        isdev: DEV
    }),
    // 提供公共代码
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'js/[name].js'
    }),
    // css 后缀
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: function () {
                return [require('autoprefixer')];
            }
        }
    }),
    ///处理提示非开发环境的错误
    new webpack.DefinePlugin({
      "process.env": { 
         NODE_ENV: JSON.stringify("production") 
       }
    })
];
///路径配置
const outpath = DEV? (__dirname + '/_dist/'): "//192.168.12.132/common/jtlq/act/match/";
//const outpath = "//192.168.12.132/common/jtlq/act/match/";

module.exports = {
    // target: 'electron-renderer',
    // devtool: 'eval',
    entry: {
        app: [
            //'webpack-dev-server/client?http://localhost:3000',
            './src/main.js'
        ],
        // 将 第三方依赖 单独打包
        /*vendor: [
            'jquery'
        ]*/
    },
    output: {
        filename: 'js/[name].bundle.js',
        //path: resolve(__dirname, 'dist'),
        path: outpath,
        //publicPath: __dirname
    },
    /*resolve: {
        extensions: [
            '.js', '.jsx'
        ]
    },
    context: resolve(__dirname, 'src'),*/
    devServer: {
        hot: true,
        host: '192.168.140.56',
        contentBase: outpath,
        publicPath: '/',
        port: '6200',
        proxy: {
          '/match/*': {
             target: 'http://act.jl.web.ztgame.com',
             changeOrigin: true,
             secure: false
          }
       }
    },

    module: {
        //module.noParse 配置哪些文件可以脱离webpack的解析
        noParse: /node_modules\/(jquey\.js)/,
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        
                    }
                }
            },
            {
                test: /\.js[x]?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
                include: /src/
            },
            {
                test: /\.(css)$/,
                use: [
                    "style-loader", "css-loader"
                ],
                // exclude: /node_modules/,
                //include: /src/
            },
            {
                test: /\.(scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'sass-loader']
                }),
                exclude: /node_modules/
                // include: /src/
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                        loader: "url-loader",
                        query: {
                            name: 'images/[name].[ext]?v=[hash:5]',
                            limit: 8192
                        }
                    }, {
                        loader: 'image-webpack-loader',
                        options: {
                            query: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                pngquant: {
                                    quality: "10-20",
                                    speed: 4
                                },
                                svgo: {
                                    plugins: [{
                                        removeViewBox: false
                                    }, {
                                        removeEmptyAttrs: false
                                    }]
                                },
                                gifsicle: {
                                    optimizationLevel: 7,
                                    interlaced: false
                                },
                                optipng: {
                                    optimizationLevel: 7,
                                    interlaced: false
                                }
                            }
                        }
                    }

                ]
            }, {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'url-loader?limit=8192'
                }]

            }, {
                test: /\.(mp3|mp4|ogg)$/,
                use: [{
                    loader: "file-loader?name=media/[name].[ext]"
                }]
            }, {
                test: /\.json$/,
                use: [{
                    loader: "json-loader"
                }]
            }
        ]
    },
    plugins: plugins,
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'muse-components': 'muse-ui/src'
        }
    }
}


////生产环境添加压缩
if(!DEV){
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false}
        })
    )
}