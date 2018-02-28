const chalk = require('chalk')


const Setting = {
	Commands:{
		init: {
			//////type参数
			default: {
				type: "g"
			},
			type: {
				g: {
					text: 'pc端gulp模版--默认带有sass、代码压缩、图片压缩、热更新',
					url: "git.dev.ztgame.com/leo/pc-gulp.git",
					build: 'gulp'
				},
				p: {
					text: '简单的pc端模版--默认带有初始化css、统计代码',
					url: "git.dev.ztgame.com/sites/mytest.git",
					build: 'gulp'
				},
				m: {
					text: '简单的移动端webpack模版--默认带有remjs、sass、统计代码、热更新',
					url: "git.dev.ztgame.com/sites/yueyuanzhiye.git",
					build: 'webpack',
					ism: true, //是否移动端
				},
				x: {
					text: '响应式的gulp模版--默认带有remjs、sass、统计代码、热更新',
					url: "git.dev.ztgame.com/sites/ts.git",
					build: 'gulp',
					ism: true,
				},
				v: {
					text: 'vue模版--默认带有remjs、sass、统计代码、热更新、路由、vuex',
					url: "git.dev.ztgame.com/sites/zt3.git",
					build: 'webpack',
					ism: true
				},
				r: {
					text: 'react模版--默认带有remjs、sass、统计代码、热更新、路由、redux',
					url: "git.dev.ztgame.com/leo/pc-gulp.git",
					build: 'webpack',
					ism: true
				}
			},

		},
		sass: {
			default: {
				type: "a"
			},
			type: {
				a: {
					text: '处理sass',
					url: "git.dev.ztgame.com/leo/pc-gulp.git",
					build: 'gulp'
				},
			}
		}
	},
	gametype: {
		zt2: {
			id: 17,//项目id
			other_key: 30026572,//第三方的统计id
			other_name: 'cnzz',//第三方的统计
			wxshareId: "wx0fcf7f47419c8171", //微信分享id
			developOutPath: '//192.168.12.132/common/zt2/act/',//内部测试环境输出路径
			developProxyTargetKey: ['/api', '/login' , '/user', '/project', '/upload'], //需要代理的关键字,/代表全部转发
			developProxyTarget: 'http://act.zt2.web.ztgame.com', //代理的地址
		},
		zt2m: {
			id: 5174,
			other_key: 'UA-92269597-2',
			other_name: 'google',
			wxshareId: "wx0fcf7f47419c8171", //微信分享id
			developOutPath: '//192.168.12.132/common/els/act/', //内部测试服务器输出地址
			developProxyTargetKey: ['/api'],//需要代理的关键字,/代表全部转发
			developProxyTarget: 'http://els.web.ztgame.com/act/' //代理的地址
		},
		els: {
			id: 25, //游戏id
			other_key: 30032869, //第三方统计id
			other_name: 'cnzz', //第三方统计类型
			wxshareId: "wx0fcf7f47419c8171", //微信分享id
			developOutPath: '//192.168.12.132/common/els/site/act/', //内部测试服务器输出地址
			developProxyTargetKey: "['/api']",//需要代理的关键字,/代表全部转发
			developProxyTarget: 'http://els.web.ztgame.com/act/' //代理的地址
		}
	},
	/////////////
	questions: [
		{
			type : "input",
			name : "sender.name",
			message : chalk.red("项目名称")
		},
		{
			type : "list",
			name : "sender.type",
			message : chalk.red("选择需要创建的项目模版"),
			choices:["g pc端gulp模版", "p 简单pc端模版", "m 简单移动端webpack模版", "x 响应式的gulp模版", "v vue模版", "r react模版"],
			default: 'g pc端gulp模版'
		},
		{
			type : "list",
			name : "sender.game",
			message : chalk.red("选择项目类别，用来生成对应的统计代码和目录地址"),
			choices:["zt2 征途2", "jtlq 街头篮球", "els 艾尔之光", "x 响应式的gulp模版", "v vue模版", "r react模版"],
			default: "zt2 征途2"
		},
		{
			type : "confirm",
			name : "sender.isShare",
			message : chalk.red("是否使用微信分享功能"),
			default: false
		}
	],
	replaces: [
		{
			name: 'statistic',//统计类型 //内部统计
			file: function(build){ return '/src/index.html'; },
			key: '<!-- statistics -->',
			template: function(tid){ return Setting.replaceTemplates.ztgame(tid); }
		},
		{	
			name: 'otherStatistic', //第三方统计
			file: function(build){ return '/src/index.html'; },
			key: '<!-- otherStatistics -->',
			template: function(tid, sname){ return Setting.replaceTemplates[sname](tid); }
		},
		{	
			name: 'developOutPath', //内部测试服务器的输出地址
			file: function(build){
				return (build=="webpack"? "/webpack.config.js": "/gulpfile.js")
			},
			key: 'developOutPathReplaceKey',
			template: function(tid, sname, fileName, project){ return (project.developOutPath+fileName); }//拼接类似 //192.168.12.132/common/els/act/aaa
		},
		{	
			name: 'developProxyTargetKey',  //代理关键字
			file: function(build){
				return (build=="webpack"? "/webpack.config.js": "/gulpfile.js")
			},
			key: 'developProxyTargetKeyReplaceKey', 
			template: function(tid, sname, fileName, project){ return (project.developProxyTargetKey); }
		},
		{	
			name: 'developProxyTarget', //代理地址
			file: function(build){
				return (build=="webpack"? "/webpack.config.js": "/gulpfile.js")
			},
			key: 'developProxyTargetReplaceKey', 
			template: function(tid, sname, fileName, project){ return (project.developProxyTarget + fileName); }
		},
		{	
			name: 'weixinshare', //微信分享
			file: function(build){
				return '/src/index.html';
			},
			key: '<!-- wxshareReplace -->', 
			template: function(tid, sname, fileName, project){ return Setting.replaceTemplates.wxshare(project.wxshareId); }
		}
	],
	/////统计代码
	replaceTemplates: {
		ztgame: (id)=>{
			return (`<script type="text/javascript">
				        var _gadate = new Date().getTime();
				        var _maq = _maq || [];
				        var _gatype  = ${id};    //游戏类型
				        _maq.push(['_setAccount', _gatype]);
				 
				    (function() {
				        var ma = document.createElement('script'); ma.type = 'text/javascript'; ma.async = true;
				        ma.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'gaanalytics.ztgame.com/analytics.js?'+_gadate;
				        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ma, s);
				    })(); 
					</script>`)
		},
		baidu: (key)=>{
			return (`<script type="text/javascript">
					 var _hmt = _hmt || [];
					(function() {
					  var hm = document.createElement("script");
					  hm.src = "https://hm.baidu.com/hm.js?${key}";
					  var s = document.getElementsByTagName("script")[0]; 
					  s.parentNode.insertBefore(hm, s);
					})();
					</script>`)
		},
		cnzz: (key)=>{
			return (`<script type="text/javascript">
					var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_${key}'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "w.cnzz.com/c.php%3Fid%3D${key}' type='text/javascript'%3E%3C/script%3E"));
					</script>`)
		},
		google: (key)=>{
			return (`<script>
					  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
					  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
					  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
					  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
					  ga('create', '${key}', 'auto');
					  ga('send', 'pageview');
					</script>`)
		},
		wxshare: (wxid)=>{
			return (`<script src="//cdnsapi.ztgame.com/site/js/require.js"></script>
					 <script>
					  	/////如果页面上的wx未初始化过 
		                if(!!!window.wx){
		                    requirejs(["weixin/main"], function(weixin) {
		                        var appid = "${wxid}"; //与当前域名、公共号对应的appid，必须有效。
		                        //wx对像就基本等同于官方的weixin对像，包含所有官网api
		                        window.wx = new weixin(appid, function(){
		                            setWeixin(window.wx);
		                        });
		                    });
		                }else setWeixin(window.wx);
		                function setWeixin(wx){
		                    var shareImg = "http://www.ztgame.com/home/v2/images/logo.jpg";
		                    wx.onMenuShareTimeline({	//朋友圈
		                        title: '分享标题', // 分享标题
		                        link: window.location.href, // 分享链接
		                        imgUrl: shareImg, // 分享图标
		                        success: function () {},// 用户确认分享成功
		                        cancel: function () {} // 分享关闭
		                    });
		                    wx.onMenuShareAppMessage({	//朋友
		                        title: '分享标题', 
		                        desc: '分享描述', // 分享描述
		                        link: window.location.href,
		                        imgUrl: shareImg,
		                        type: 'link', // 分享类型,music、video或link，不填默认为link
		                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		                        success: function () {},
		                        cancel: function () {}
		                    });
		                    wx.onMenuShareQQ({
		                        title: '分享标题',
		                         desc: '分享描述', 
		                        link: window.location.href,
		                        imgUrl: shareImg 
		                    });
		                }
					</script>`)
		}
	}
}



module.exports = Setting;