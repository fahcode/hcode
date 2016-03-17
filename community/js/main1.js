var doSome = function(){
	return new doSome.prototype.init();
}


doSome.prototype = {
	init:function(){
		this.timers;//存放定时
		this.moveSwiper;//视频Swiper
		this.ifIE9 = (navigator.userAgent.indexOf("MSIE 6.0")>0) || (navigator.userAgent.indexOf("MSIE 7.0")>0) || (navigator.userAgent.indexOf("MSIE 8.0")>0);
		this.allWid = parseInt($(document).width());
		this.allHei = parseInt($(document).height());
		this.windowHei = parseInt($(window).height());
		this.windowWid = parseInt($(window).width());
		this.newDate = new Date();//当前的时间
		this.endDate = new Date(2015,09,09,11,00,00);//结束的时间,2015,10,09,11,00,00,月分减一
		//this.endDate = this.newDate + 3000;//结束的时间,2015,10,09,11,00,00,月分减一
		//console.log(this.endDate);
		return this;
	},
	//加载图片
	loadImg:function(arr){
		var self = this;
		for(var i = 0;i<arr.length;i++){
			var newImgs = new Image();
			newImgs.src = arr[i];
			newImgs.onload = function(){}
		}
		
	},
	//swipers轮播
	mySwipers:function(){
		var self = this;
		self.mySwipersFn();

		//头图轮播      
		
		//贴图轮播
		
		//新闻区域
		
	},
	//轮播函数
	mySwipersFn:function(){
		var self = this;
		var domBox = $('#swiper1');
		var domWid = parseInt(domBox.width()),
			domHei = parseInt(domBox.height()),
			len = (domBox.find('.swiper-slide')).length;
		console.log(len);
		domBox.children('.swiper-wrapper');
	},
	//判断屏幕尺寸来设置视频滚动的 大小
	screenMove:function(){
		var self = this;
		var tabSwiper = function(){
			var slides = 1;
			var space = 0;
			console.log(self.windowWid);
			if(self.windowWid > 650){
				slides = 3;
				space = 20;
			}else{
				slidesPerView = 1;
				spaceBetween = 0;
			}
			//视频区域
			self.moveSwiper = new Swiper ('#swiper4', {
			  direction: 'horizontal',
			  slidesPerView : slides,
			  spaceBetween : space,
			  // 如果需要前进后退按钮
			  nextButton: '.swiper-button-next',
			  prevButton: '.swiper-button-prev'
			})
			
		}
		tabSwiper();
		
		$(window).resize(function(){
			self.windowWid = parseInt($(window).width());
			tabSwiper();
		})
	},
	myLength:function(strs){
		var arrs = strs.split('');
		return arrs.length;
	}
}

doSome.prototype.init.prototype = doSome.prototype;//把this->init
doSome = doSome();



