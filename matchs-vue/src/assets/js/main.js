
const tool = {
	winHei: 0,
	winWid:0,
	init:function(){
		var self = this;
		self.isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		self.touchOneByOne = (self.isTouch)?'touchstart':'click';
	},
	setWinHei:function(ele){
		var self = this;
		var win_w = parseInt(document.documentElement.clientWidth);
        var win_h = parseInt(document.documentElement.clientHeight);

		document.getElementById(ele).style = 'width: '+ win_w +'px;height: '+ win_h +'px;'
	},
	//查询cookie是否存在
	selectCookie: function(name, decode){
		var val = false;
        //获取cookie字符串
        var strCookie=document.cookie;
        //将多cookie切割为多个名/值对
        var arrCookie=strCookie.split("; ");
        //遍历cookie数组，处理每个cookie对
        for(var i=0;i<arrCookie.length;i++){
            var arr=arrCookie[i].split("=");

            if(arr[0] == name && arr[1]!=""){
            	val = decodeURI(arr[1]);
            	if(!!decode && decode == "unescape") val = unescape(arr[1]);
            }
        }
        return val;
	},
	weixin: function(appid, ops, lineSucCallback, peoSucCallback,lineCelCallback, peoCelCallback){
		if(!!window.wx){
			initWx(window.wx)
		}else{
			requirejs(["weixin/main"], function(weixin) {
	            //wx对像就基本等同于官方的weixin对像，包含所有官网api
	            window.wx = new weixin(appid,function(){
	                initWx(window.wx)
	            });
	        });
		};
        
        function initWx(wx){
        	wx.onMenuShareTimeline({
                title: ops.title, // 分享标题
                link: ops.link, // 分享链接
                imgUrl: ops.img, // 分享图标
                success: function () {
                	if(typeof lineSucCallback == 'function') lineSucCallback();
                },
                cancel: function () {
                	if(typeof lineCelCallback == 'function') lineCelCallback();
                }
            });
            //朋友
            wx.onMenuShareAppMessage({
                title: ops.title, // 分享标题
                //desc: '我是' + window.qsResult.res + "，你，有多少战斗力？", // 分享描述
                desc: ops.desc,
                link: ops.link, // 分享链接
                imgUrl: ops.img, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                	if(typeof peoSucCallback == 'function') peoSucCallback();
                },
                cancel: function () {
                	if(typeof peoCelCallback == 'function') peoCelCallback();
                }
            });
        }
    },
    orientation: function(callback){
    	////判断是否是横屏
        var supportOrientation = (typeof window.orientation === 'number' &&
            typeof window.onorientationchange === 'object');
        
        var orientation,
            timer = null;
        var updateOrientation = function() {
            clearTimeout(timer);
            timer = setTimeout(function(){
                /*if (supportOrientation) {
                    orientation = window.orientation;
                    switch (orientation) {
                        case 90:
                        case -90:
                            orientation = 'landscape';//这里是横屏
                            break;
                        default:
                            orientation = 'portrait';
                            break;
                    }
                } else {*/
                    orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
                //};
                if((typeof callback=="function")){
                    callback(orientation);
                }
            },300);
        };
        updateOrientation();
        
        /*if (supportOrientation) {
            window.addEventListener('orientationchange', updateOrientation, false);
        } else {*/
            //监听resize事件
            window.addEventListener('resize', updateOrientation, false);
        //}
        
    },
	isWeixin:function(){
		var val = false;
	    var ua = navigator.userAgent.toLowerCase();  
	    if(ua.match(/MicroMessenger/i)=="micromessenger") {
	        val = true;
	    };
	    return val;
	},
	issystem: function(){
		var val = "ios";
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if(isAndroid) val = "android";

		return val;
	},
	isPc:function() {
		var userAgentInfo = navigator.userAgent;
		var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {flag = false;break;}
		}
		return flag;
	},
	//获取倒计时
    countDown: function(dm, tms, csss) {
        var self = this;
        var getBtn = $(dm);
        var _css = dm.style;
        getBtn.attr('disabled', 'disabled');
        getBtn.css(csss);
        getBtn.val(tms + 's');
        getBtn.text(tms + 's');
        
        var i = 0;
        var _timer = setInterval(function() {
            i++;
            getBtn.val(tms - i + 's');
            getBtn.text(tms - i + 's');
            if (i >= tms) {
                clearInterval(_timer);
                dm.style = _css;
                getBtn.removeAttr('disabled');
                getBtn.val('发送');
                getBtn.text('发送');
            }
        }, 1000)
    },
    //时间判断
    timeset:function(beginTime,endTime,nowTime){

        var myDate1=new Date(2016,11,23,18);
        //var myDate1=new Date(2016,11,16,20);
        var myDate2=new Date(2016,11,23,21);

        var now = new Date();
        
        if( (now.getTime()>=myDate1.getTime()) && (now.getTime()<=myDate2.getTime()) ){
            //在2016/12/23/18-2016/12/23/21
            return true;
        };
        return false;
    },
	//预加载图片
	loadImg:function(imgArr){
		var self = this;
		var imgArr = imgArr;
		var _img,
			len = imgArr.length,
			count = 0;
		for(var i =0;i<len;i++){
			_img = new Image();
			_img.src = self._imgPath + imgArr[i];
			_img.onload = function(){
				count++;
				if(count >= len){
					//callbackfn
					//console.log(count);
				};
			}
		}
	}
};
window._Tool = tool;

export default tool;