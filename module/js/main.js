var play = function(imgList){
	this.imgList = imgList;//图片数组
	this.imgLen = imgList.length;
	this.locations = 0;//记录滚动位置
	//判断设备是否支持touch事件
	this.isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

	this.init();//初始化
};

play.prototype = {
	init:function(){
		this.imgLoad();//图片加载
		this.getWidth();//给每个div增加宽高
		//this.touchEvents()//触摸事件
		
		this.unlock();//点击指纹，解锁页面

	},
	//图片加载后隐藏loading层
	imgLoad:function(){
		var self = this;
		var iCount = 0,oneImg;
		for(var i =0;i< self.imgLen;i++){
			oneImg = new Image();
			oneImg.src = (self.imgList)[i];
			oneImg.onload = function(){//判断加载
				iCount++;
				$('.loading-txt').html('' + ((iCount/self.imgLen).toFixed(2))*100 + '%');
				if(iCount >= self.imgLen){
					$('.music').fadeIn();//显示音乐
					$('.loading').fadeOut(400, function() {
						$(this).empty();
						$('#page1').addClass('loadOk');//加载后给第一个添加css动画class
					});
					if(!self.isTouch){alert('当前设备不支持滑动事件！');return false;}
					return false;
				}
			}
		}
	},
	//点击指纹，解锁页面
	unlock:function(){
		var self = this;
		var timer,i = 5;
		$('.fingerprint').on('mouseup touchend',function(){
			i = 0;//修改判断值
			clearTimeout(timer);//清空settimeout列队
			$(this).removeClass('av');
			
		});
		$('.fingerprint').on('touchstart',function(){
			i = 5;
			var _this = $(this);
			_this.addClass('av');
			timer =  setTimeout(function(){
				if(i == 5){
					_this.addClass('hide');
					$('.imgDoUp').addClass('anim-openup');
					$('.imgDoDown').addClass('anim-opendown');
					$('.anim-down').fadeIn();//显示上滑动作
					//解锁后给页面添加触摸事件
					self.touchEvents();//触摸事件
				}
			},2000);
		})
		
		
	},
	//计算高度
	getWidth:function(){
		var self = this;
		var wid = parseInt($(document).width());
		var hei = parseInt($(document).height());
			wid = (wid > 640)?640:wid;
			hei = (wid >= 640)?1010:hei;
		$('body').attr('zoom',wid/640);
		$('.anim-down').css('transform','scale('+ wid/640 +','+ wid/640 +')');
		$('.content .row').css({'width':wid + 'px','height':hei + 'px'});

	},
	//触摸方向判断事件
	touchEvents:function(){

		var self = this;
		var doms = $('.row');//获取滑动的dom结构
		var cDom = $('#touchBox');//获取需要修改的dom
		//获取第一页的marginTop
		var startMarginTop = parseInt(cDom.css('marginTop'));

		var hei = parseInt($(document).height());
		var len = parseInt(doms.length);
		
		cDom.bind("touchstart", function(e) {
		    e.preventDefault();
		    startX = e.originalEvent.changedTouches[0].pageX,
		    startY = e.originalEvent.changedTouches[0].pageY;
		});
		//只负责滑动时跟随
		cDom.bind("touchmove", function(e) {
			//startMarginTop = parseInt(cDom.css('marginTop'));
		    e.preventDefault();
		    cDom.removeClass('ani-marTop');//去掉css3来做动画
		    moveEndX = e.originalEvent.changedTouches[0].pageX,//滑动x
		    moveEndY = e.originalEvent.changedTouches[0].pageY,//滑动y
		    X = moveEndX - startX,
		    Y = moveEndY - startY;
		    /*if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {}//left to right
		    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {}//right to left*/

			if ( Math.abs(Y) > Math.abs(X) && Y > 0) {//top to bottom
		        if(self.locations <= 0){
		        	console.log('不能上了')
		        }else{
		        	cDom.css('marginTop',(-1 * hei * self.locations)+Math.abs(Y) + 'px');
		    	}
		    }
		    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {//bottom to top
		        if(self.locations >= (len-1)){
		        	console.log(self.locations);
		        	console.log('不能下了')
		        }else{
		        	cDom.css('marginTop',(-1 * hei * self.locations)-Math.abs(Y) + 'px');
		    	}
		    }
		    else{//其他其他情况
		    }
		});
		//处理翻页
		cDom.bind("touchend", function(e) {
			e.preventDefault();
			console.log(55);
			cDom.addClass('ani-marTop');//使用css3来做动画
			endX = e.originalEvent.changedTouches[0].pageX,//滑动x
		    endY = e.originalEvent.changedTouches[0].pageY,//滑动y
		    X = endX - startX,
		    Y = endY - startY;

		    if ( Math.abs(Y) > Math.abs(X) && Y > 0) {//top to bottom
		        if(self.locations <= 0){
		        	console.log('不能上了')
		        }else{
		        	if(Y > (hei/5)){//只有滑动超过一半
		        		doms.eq(self.locations).removeClass('loadOk');//去掉旧动画class
		        		self.locations--;
		        		cDom.css('marginTop',-1 * hei * self.locations + 'px');
		        		doms.eq(self.locations).addClass('loadOk');//给新页面添加动画class
		        	}else{
		        		cDom.css('marginTop',-1 * hei * self.locations + 'px');
		        	}
		    	}
		    }
		    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {//bottom to top
		        if(self.locations >= (len-1)){
		        	console.log('不能下了')
		        }else{
		        	if(Math.abs(Y) > (hei/5)){
		        		doms.eq(self.locations).removeClass('loadOk');//去掉旧动画class
		        		self.locations++;
		        		console.log(self.locations);
		        		cDom.css('marginTop',-1 * hei * self.locations + 'px');
		        		doms.eq(self.locations).addClass('loadOk');//给新页面添加动画class
		        	}else{
		        		cDom.css('marginTop',-1 * hei * self.locations + 'px');
		        	}	
		    	}
		    }else{}//其他其他情况

		    if(e&&e.preventDefault){
				window.event.returnValue = false;//??
			}
		});
	}
	
}