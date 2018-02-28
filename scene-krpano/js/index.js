
var Swiper = require('./swiper-3.2.7.jquery.min');

var im = {
	krpano: null,
	winWid: parseInt(document.documentElement.clientWidth),
	winHei: parseInt(document.documentElement.clientHeight),
	init:function(){
        var self = this;
        self.krpano = document.getElementById("krpanoSWFObject");

        self.setWinHei();
        self.pageSwiper();
        self.changeSence();
        //self.xiayu();
    },
    setWinHei:function(){
		var self = this;

		if(self.winWid>=640){
			if(self.winHei<1035){
				var s = (self.winHei/1035).toFixed(2);
				$('.setWinHei').css({'width':(640*s)+'px','height':self.winHei+'px'});
			}else{
				$('.setWinHei').css('height','1035px');
			}
		}else{
			$('.setWinHei').css('height',self.winHei+'px');
		};
	},
	pageSwiper: function(){
		var mySwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            onSlideChangeEnd: function(swiper) {
                //切换结束时，告诉我现在是第几个slide
                if (swiper.activeIndex == 4) {
                    $('.pulldown').addClass('up');
                } else {
                    $('.pulldown').removeClass('up');
                };
            }
        });
	},
    changeSence: function(){
    	var self = this;
    	$('#jhd, #lyd, #lxd, #swsm, #ysg, #sfz').on('click', function(){
    		var sence = $(this).attr('id');
    		var cid = $(this).attr('cid');

    		console.log(sence)
    		//切换控制条
    		$('.control li').removeClass('on').eq(cid-1).addClass('on');
    		//显示容器
    		$('#vrscene').show();
    		//切换场景
    		self.krpano.call("loadscene('scene_"+ sence +"', null, 'aa', 'COLORBLEND()')");
    	});

    	$('.control li').on('click', function(){
    		var sence = $(this).attr('class');
    		///隐藏容器
    		if(sence == "back") $('#vrscene').hide();
    		$(this).addClass('on').siblings().removeClass('on');
    		//切换场景
    		self.krpano.call("loadscene('scene_"+ sence +"', null, 'aa', 'COLORBLEND()')");

    	})
    },
    showLayer: function(){

    },
    xiayu: function(){
		var NUMBER_OF_LEAVES = 10;
		var winwidth = $(window).width();
		
	    var container = document.getElementById('leafContainer');
	    for (var i = 0; i < NUMBER_OF_LEAVES; i++) {
	        container.appendChild(createALeaf());
	    }

		function randomInteger(low, high){
		    return low + Math.floor(Math.random() * (high - low));
		}

		function randomFloat(low, high){
		    return low + Math.random() * (high - low);
		}

		function pixelValue(value){
		    return value + 'px';
		}

		function durationValue(value){
		    return value + 's';
		}

		function createALeaf(){
		    var leafDiv = document.createElement('div');
		    var imageDiv = document.createElement('div');
		    imageDiv.className = 'im';
		    leafDiv.className = 'img' + randomInteger(1, 4);
		    leafDiv.style.top = "-100px";
		    leafDiv.style.left = pixelValue(randomInteger(0, winwidth));
		    var spinAnimationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpinAndFlip';
		    leafDiv.style.webkitAnimationName = 'fade, drop';
		    imageDiv.style.webkitAnimationName = spinAnimationName;
		    var fadeAndDropDuration = durationValue(randomFloat(5, 20));
		    var spinDuration = durationValue(randomFloat(4, 15));
		    leafDiv.style.webkitAnimationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;
		    var leafDelay = durationValue(randomFloat(0, 10));
		    leafDiv.style.webkitAnimationDelay = leafDelay + ', ' + leafDelay;
		    imageDiv.style.webkitAnimationDuration = spinDuration;
		    leafDiv.appendChild(imageDiv);
		    return leafDiv;
		}
	}
}

$(function(){
	//////开始全景
	embedpano({swf:"../source/tour.swf", xml:"../source/tour.xml", target:"pano", html5:"prefer", mobilescale:1.0, passQueryParameters:true});

	im.init();
})