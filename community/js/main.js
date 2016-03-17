var doSome = function(){
	return new doSome.prototype.init();
}

doSome.prototype = {
	init:function(){
		this.timers;//合作媒体存放定时
		this.moveSwiper;//视频Swiper
		this.myplayer;
		this.ifIE9 = (navigator.userAgent.indexOf("MSIE 6.0")>0) || (navigator.userAgent.indexOf("MSIE 7.0")>0) || (navigator.userAgent.indexOf("MSIE 8.0")>0);
		this.allWid = parseInt($(document).width());
		this.allHei = parseInt($(document).height());
		this.windowHei = parseInt($(window).height());
		this.windowWid = parseInt($(window).width());
		//判断设备是否支持touch事件
		this.isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
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
	swipers:function(){
		var self = this;
		//头图轮播      
		var mySwiper1 = new Swiper ('#swiper1', {
		  direction: 'horizontal',
		  loop: true,
		  autoplay: 3000,//可选选项，自动滑动
		  paginationClickable: true,
		  grabCursor: true, //设置鼠标手
		  // 如果需要分页器
		  pagination: '#pagination1'
		})
		//
		var mySwiper2 = new Swiper ('#swiper2', {
		  direction: 'horizontal',
		  loop: true,
		  autoplay: 2000,//可选选项，自动滑动
		  paginationClickable: true,
		  grabCursor: true, //设置鼠标手
		  // 如果需要分页器
		  pagination: '#pagination2'
		}) 
		//新闻区域
		var mySwiper3 = new Swiper ('#swiper3', {
		  direction: 'horizontal',
		  loop: true,
		  autoplay: 1000,//可选选项，自动滑动
		  paginationClickable: true,
		  grabCursor: true, //设置鼠标手
		  // 如果需要分页器
		  pagination: '#pagination3'
		})
	},
	//判断屏幕尺寸来设置视频滚动的 大小
	screenMove:function(size){
		var self = this;
		var tabSwiper = function(){
			var slides = 1;
			var space = 0;
			if(self.windowWid > size){
				slides = 3;
				space = 20;
			}else{
				slidesPerView = 1;
				spaceBetween = 0;
			}
			//视频区域
			self.moveSwiper = new Swiper ('#swiper4', {
			  direction: 'horizontal',
			  slidesPerView : slides
			});
			$('.swiper-button-prev').on('click', function(e){
		    e.preventDefault()
			    self.moveSwiper.swipePrev()
			})
			$('.swiper-button-next').on('click', function(e){
			    e.preventDefault()
			    self.moveSwiper.swipeNext()
			})
			
		}
		tabSwiper();
		
		$(window).resize(function(){
			self.windowWid = parseInt($(window).width());
			tabSwiper();
		})
	},
	//设置合作媒体
	mediaShow:function(){
		var self = this,timer;
		var events = self.isTouch ? 'touchstart': 'mouseover';
		$('.mhz-fst').on(events,function(){
			clearTimeout(timer);
			$('#mhz_ul>.showBox').show().animate({'height':'100%'},300);
			timer = setTimeout(function(){
				$('#mhz_ul>.showBox').animate({'height':'0px'},200,function(){$(this).hide()});
			},2000);
		});
	},
	//手机下触摸显示内容
	touchSome:function(){
		var self = this,
			state = 1,
			timer,
			dom = $('.mobile .hvBox').closest('.item');
		dom.on('touchstart',function(e){
			e.stopPropagation();//禁止事件冒泡
			var _this = $(this).find('.hvBox');
			if(state == 1){
				state = 0;
				_this.fadeIn();
				timer = setTimeout(function(){
			      _this.fadeOut();
			      state = 1;
			    },5000);
			}
			
		  })
	},
	//播放视频
	doMove:function(){
		var self = this;
		var moveUrlDom = $('.moveUrl .tvBtn');
		var video = {
		    h5_elTpl : '<div style="display:none;position:fixed;z-index:999999;' +
		                 'left:0;right:0;top:0;bottom:0;' +
		                 'background:rgba(0,0,0,0.75);">' +
		               '<video src="" style="position:absolute;z-index:9999;width:100%;' +
		                   'left:0;right:0;top:50%;"></video>' +
		             '</div>',
		    _popEl    : null,
		    _videoEl  : null,
		    _videoCtl : null,
		    objvideo : null,
		    open: function(url) {
		        this._popEl.show();
		        this._videoEl.attr('src', url);
		        this._videoCtl.play();
		        return this;
		    },
		    close: function() {
		        this._videoCtl.pause();
		        this._popEl.empty();
		        this._videoEl.empty();
		        return this;
		    },

		    init: function() {
		        var that = this,
		            height;

		        this._popEl    = $(this.h5_elTpl);
		        this._videoEl  = this._popEl.find('video');
		        this._videoCtl = this._videoEl[0];

		        height = $(window).width() * 9 / 16;

		        this._videoEl.css({
		            height    : height,
		            marginTop : height / -2
		        });

		        this._videoEl.bind('touchstart', function(e) {
		            e.stopPropagation();
		        });

		        that._popEl.bind('touchstart click', function() {
		            that.close();
		            return false;
		        });

		        $('body').append(this._popEl);

		        return this;
		    },
		    getvideos:function(path){
		    	var _this = this;
			    
			    var newpath = path==undefined?'':path;
			    _this.objvideo = $('#video_wrap').gplayer({
			            file:newpath, 
			            width:'959',
			            height:'539',
			            auto:true
			        })
			        //this.player = objvideo;
			        //return objvideo;        
			 },
			 playervideo:function(url){  
		        var _this = this;   
		        _this.getvideos(url);

		        $("#video_close").click(function(){
		          //_this.objvideo.pause();
		          $("#video_wrap").empty();
		          $('.tan_box,.maskbg').fadeOut();
		        });
		    }
		 
		}
		//只单独使用click，不然在m下会触发两次
		moveUrlDom.on('click',function(){
			var url = $(this).closest('.moveUrl').attr('data-url');
			if(self.allWid < 650 ){
				video.init();
				video.open(url);
			}else{
				$('.tan_box,.maskbg').fadeIn();
				video.playervideo(url);
			}
		})
		
	},
	//内容tab
	Tabs:function(){
		var self = this;
		//标签切换	
		self.Tab_fn('.news .tabBtn .list','.news .tabCon',3,'.news .plan','hv');//首页新闻类别切换
	},
	//Tabq切换函数
	Tab_fn:function(classname,box,num,plan,addclass){
	    var classname = $(classname);
	    var box = $(box);
	    var plan = $(plan),
	    	planWid = parseInt(plan.children().width());
	    var  len = classname.children().length;
	    for(var i = 0;i<num;i++) {
	        classname.children().eq(i).click(function (){
	            var index = $(this).index();
	            classname.children().removeClass(addclass);
	            $(this).addClass(addclass);
	            plan.children().animate({'marginLeft': index*(15+planWid) + 'px'},100);

	            box.children().hide();
	            box.children().eq(index).fadeTo(300,1,function(){$(this).show();});
	        })
	    }
	},
	myLength:function(strs){
		var arrs = strs.split('');
		return arrs.length;
	}
}


doSome.prototype.init.prototype = doSome.prototype;//把this->init
doSome = doSome();
