var device = {
    Android: function () {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function () {
        return navigator.userAgent.match(/iPad|iPod|iPhone/i) ? true : false;
    },
    iphone: function () {
        return navigator.userAgent.match(/iPhone/i) ? true : false;
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function () {
        return (device.Android() || device.BlackBerry() || device.Windows() || device.iOS());
    }
};
$(function(){

	if(device.Android())
	{
	    $(".top_bar .download_open").addClass('androiddown');
	    $(".appstore").addClass('androiddown_btn');
	}
	else
	{
	    $(".top_bar .download_open").addClass('commondownload');
	    $(".appstore").addClass('appstore_btn');
	}
	ROC.init();
});

var ROC = {
	init:function(){
		/*this.newsslide = new Swiper('.news_slide',{
			nextButton:".news_slide .arrow_right",
			prevButton:".news_slide .arrow_left",
			pagination : '.slide-pagination'
		});
		this.herosslide = new Swiper('.heros_slide',{
			nextButton:".heros_slide .arrow_right",
			prevButton:".heros_slide .arrow_left"
		});*/
		this.bind();
		
	},
	bind:function(){
		var self = this;
		$(".playbtn").click(function(){
			var url = $(this).data('videourl');
			self.playVideo(url);
		});
	},
	playVideo:function(url){
		if(!url)
		{
			alert('暂无视频');
			return;
		}
		notouch();
		if($(".VIDEOBG").length==0)
		{
			var videobg = $('<div class="VIDEOBG"></div>');
			$('body').append(videobg);
			videobg.css({width:'100%',height:'100%',background:'#000',position:'fixed',top:0,left:0,zIndex:999999,display:'flex',alignItems:'center'});
			
			var topbar = $('<div class="VIDEOTOP"></div>');
			var finish = $('<a href="javascript:void(0)" class="VIDEO-FINISH">完成</a>');
			videobg.append(topbar);
			topbar.append(finish);
			topbar.css({width:'100%',height:'40px',background:'#606062',position:'absolute',top:0,left:0,zIndex:'9999999'});
			finish.css({display:'inline-block',lineHeight:'30px',padding:'0 10px',color:'#020202',borderRadius:'5px',position:'relative',left:0,top:5,fontSize:'18px',fontWeight:'bold'});
		}
		else
		{
			$(".VIDEOBG").show();
			$(".VIDEOBG")[0].style.visibility = 'visible';
		}
		var video = $('<video id="VIDEOOBJECT" src="'+url+'" controls="controls"></video>');
		$(".VIDEOBG").append(video);
		video.css({width:'100%',position:'absolute',zIndex:'100',top:'50%'});
		setCss3(video,'transform','translate(0,-50%)');
		var videoElement = document.getElementById('VIDEOOBJECT');
		videoElement.play();
		videoElement.addEventListener("webkitendfullscreen", function(){
			playEnd();
		}, false);
		videoElement.addEventListener("endfullscreen", function(){
			playEnd();
		}, false);
		videoElement.addEventListener("ended", function(){
			playEnd();
		}, false);
		$(".VIDEO-FINISH").unbind('click').click(function(){
			playEnd();
		});
		function playEnd()
		{
			videoElement.pause();
			$(videoElement).remove();
			$(".VIDEOBG").hide();
			$(".VIDEOBG")[0].style.visibility = 'hidden';
			cantouch();
		}
	}
}
function bodyScroll(e){
	e.preventDefault();
}
function notouch()
{

	document.addEventListener('touchmove', bodyScroll, false);
}
function cantouch()
{
	document.removeEventListener('touchmove', bodyScroll, false);
}
function setCss3(element,attr,value)
{
	var obj = {};
	obj[prefix+attr] = value;
	element.css(obj);
}
var prefix = function() {
  var div = document.createElement('div');
  var cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
  div.style.cssText = cssText;
  var style = div.style;
  if (style.webkitTransition) {
    return '-webkit-';
  }
  if (style.MozTransition) {
    return '-moz-';
  }
  if (style.oTransition) {
    return '-o-';
  }
  if (style.msTransition) {
    return '-ms-';
  }
  return '';
}();
function bodyScroll(e){
	e.preventDefault();
}
function notouch()
{

	document.addEventListener('touchmove', bodyScroll, false);
}
function cantouch()
{
	document.removeEventListener('touchmove', bodyScroll, false);
}

function isios()
{
	var ua = navigator.userAgent.toLowerCase();
	if (/iphone|ipad|ipod/.test(ua)) {
		return true;	
	}
	return false;
}

