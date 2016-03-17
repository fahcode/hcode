var cruels = function(){
	return (new cruels.prototype.init());
}


cruels.prototype = {
	init:function(){
		this.locations = 0;//记录滚动位置
		//判断设备是否支持touch事件
		this.isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		this.wid  = $(window).width();
		this.hei  = $(window).height();
		this.TouchResult = null;//触摸方向
		this.hpV = 100;
		this.isGameOver = 0;//是否游戏结束
		this.times = 10;//最多打击的次数
		this.touchTimes = 0;//单击次数
		this.propType = 0;//道具类型，默认无
		this.musicOFF = 1;//默认是打开
		return this;
	},
	//加载图片
	loadImg:function(loadID,arr){
		var self = this,
			len = arr.length,
			iCount = 0,
			planValue = '0%';
		//页面延时
		//setTimeout(function(){
			for(var i = 0;i<len;i++){
				var newImgs = new Image();
				newImgs.src = arr[i];
				newImgs.onload = function(){
					if(iCount <= len){
						iCount++;
						planValue = Math.floor( ((iCount/len)*100).toFixed(2)) + '%';
						$('#planWid').css('width',planValue);//设置长度
						$('#planValue').html(planValue);//写入文字值
						$('#gameStart').addClass('loadOk');
						if(iCount == len){
							//延时出现
							setTimeout(function(){
								$('#' + loadID).empty();
								$('.main').show();
								//玩游戏
								self.playGame();
							},1000)
						}
					}
				}
			}
		//},1000);	
	},
	//音乐控制
	doMusics:function(state){
		var self = this;
		var audio = document.getElementById('audio');
		var audioBg = document.getElementById('audioBg');
		//var audio = $('#audio');
			
		if(state == 1){
			if(self.musicOFF == 1){
				audio.play(); 
			}	
		}else{
			$('.musicBtn').on('touchstart',function(){
				var _this = $(this);
				if(_this.attr('class').indexOf('off') != -1){
					_this.removeClass('off');
					self.musicOFF = 1;
					//audio.setAttribute('src','music/m.mp3');
					audioBg.play();
					//_this.addClass('McenterRotate');
				}else{
					_this.addClass('off');
					self.musicOFF = 0;
					//audio.attr('src','');
					audio.pause();
					audioBg.pause();
					//_this.removeClass('McenterRotate');//清除旋转和缩放合成的效果
				}
			})
		}
	},
	//计算高度
	getWidth:function(){
		var self = this;
		var wid = (self.wid > 640)?640:self.wid,
			hei = (self.wid >= 640)?1010:self.hei;
		$('body').attr('zoom',wid/640);
		//$('.anim-down').css('transform','scale('+ wid/640 +','+ wid/640 +')');
		$('.content .row').css({'width':wid + 'px','height':hei + 'px'});

	},
	//设置人物高度位置
	playL:function(){
		var self = this;
		var bb = parseInt($('#btPlay>.desk').height());
		//console.log(bb);
		$('#play').css('bottom',bb + 'px');
	},
	//页面按钮逻辑控制
	btnLogic:function(){
		var self = this;

		var Logics = {
			closes:function(close,pop){
				var close = $('.' + close);
				close.on('touchstart',function(){
					var _this = $(this);
					_this.closest('.' + pop).hide();
				})
			},
			opens:function(){
				$('#shareBtn').on('touchstart',function(){
					$('.shareDiv').show();
				})
			},
			init:function(){
				this.opens();
				this.closes('close,.popOpcaty,.shareImg','pop');
			}
		}

		Logics.init();

	},
	//玩游戏
	playGame:function(){
		var self = this;
		var clicks = 0;//点击次数
		var timers = null;//存储连续扣分定时函数
		var cProp = $('#cProp');
		//touch控制
		$('#whip,#candle,#nunchaku,#stick').bind('touchstart',function(){
			var _this = $(this),
				type = _this.attr('id');
				//alert("道具类型：" + type);
				if(type == "whip"){
					cProp.children('.anim1').show();
					self.propType = 1;
				}else if(type == "candle"){
					cProp.children('.anim2').show();
					self.propType = 2;
				}else if(type == "nunchaku"){
					cProp.children('.anim3').show();
					self.propType = 3;
				}else if(type == "stick"){
					cProp.children('.anim4').show();
					self.propType = 4;
				}
				setTimeout(function(){
					cProp.children().hide();
				},800)

		});
		//点击人物控制
		self.touchPlay();
		
	},
	//触摸滑动方向和是否点击判断事件
	touchPlay:function(){
		var self = this;
		var headDom = $('#headControl'),
			bodyDDom = $('#bodyD'),
			handDom = $('#handControl'),
			fellDom = $('#feelControl'),
			addAnimDom = $('#addAnim');

		var startX = 0,startY = 0,endX =0,endY =0;//记录单点击的坐标
		var touchs = $('#headControl,#bodyD');
		function resets(){
			headDom.attr('class','head head1');
			bodyDDom.attr('class','bodyD bodyD1');
			handDom.attr('class','hand hand1');
			//sayDom.attr('class','say');
			fellDom.attr('class','feel');
			addAnimDom.children().hide();
		}
		function addAnim(type,dt){
			if(self.touchTimes == self.times){return false;}
			if(type == 'headControl'){
				switch(dt){
					case 0:
					//头部只单击时，不做任何效果
						return false;
						break;
					case 1:
						headDom.attr('class','head').addClass('head5');
						break;
					case 2:
						headDom.attr('class','head').addClass('head4');
						break;
					case 3:
						headDom.attr('class','head').addClass('head2');
						break;
					case 4:
						headDom.attr('class','head').addClass('head3');
						break;
					default:
						break;
				}
			}else if(type == 'bodyD'){
				//先处理在身体上单击时，不同道具的效果
				if(dt == 0){
					switch(self.propType){
						case 0:
							addAnimDom.children('.anim1').show().css({
								'top':startY + 'px',
								'left':startX + 'px'
							});
							headDom.attr('class','head').addClass('head6');
							bodyDDom.attr('class','bodyD').addClass('bodyD3');
							fellDom.attr('class','feel').addClass('feel2');
							break;
						case 1:
							addAnimDom.children('.anim2').show().css({
								'top':startY + 'px',
								'left':startX + 'px'
							});
							headDom.attr('class','head').addClass('head7');
							bodyDDom.attr('class','bodyD').addClass('bodyD2');
						fellDom.attr('class','feel').addClass('feel1');
							break;
						case 2:
							addAnimDom.children('.anim3').show().css({
								'top':startY + 'px',
								'left':startX + 'px'
							});
							headDom.attr('class','head').addClass('head6');
							bodyDDom.attr('class','bodyD').addClass('bodyD3');
							fellDom.attr('class','feel').addClass('feel2');
							break;
						case 3:
							addAnimDom.children('.anim4').show().css({
								'top':startY + 'px',
								'left':startX + 'px'
							});
							headDom.attr('class','head').addClass('head7');
							bodyDDom.attr('class','bodyD').addClass('bodyD2');
							fellDom.attr('class','feel').addClass('feel1');
							break;
						case 4:
							addAnimDom.children('.anim5').show().css({
								'top':startY + 'px',
								'left':startX + 'px'
							});
							headDom.attr('class','head').addClass('head6');
							bodyDDom.attr('class','bodyD').addClass('bodyD3');
							fellDom.attr('class','feel').addClass('feel2');
							break;
						default:
							break;
					}
				}else{
					//先处理在身体滑动时，不同道具的效果
					switch(self.propType){
						case 0:
							//无道具时，则无效果
							//addAnimDom.children('.anim1').show();
							break;
						case 1:
							addAnimDom.children('.anim2').show();
							break;
						case 2:
							addAnimDom.children('.anim3').show();
							break;
						case 3:
							addAnimDom.children('.anim4').show();
							break;
						case 4:
							addAnimDom.children('.anim5').show();
							break;
						default:
							break;
					}
				}
				//先处理在身体滑动时，身体部位的变化
				switch(dt){
					case 0:
						//headDom.attr('class','head').addClass('head2');
						handDom.attr('class','hand').addClass('hand2');
						break;
					case 1:
						headDom.attr('class','head').addClass('head6');
						handDom.attr('class','hand').addClass('hand3');
						bodyDDom.attr('class','bodyD').addClass('bodyD3');
						fellDom.attr('class','feel').addClass('feel2');
						break;
					case 2:
						headDom.attr('class','head').addClass('head7');
						handDom.attr('class','hand').addClass('hand3');
						bodyDDom.attr('class','bodyD').addClass('bodyD2');
						fellDom.attr('class','feel').addClass('feel1');
						break;
					case 3:
						headDom.attr('class','head').addClass('head2');
						handDom.attr('class','hand').addClass('hand3');
						break;
					case 4:
						headDom.attr('class','head').addClass('head3');
						break;
					case 5:
						//在裤裆上单击
						headDom.attr('class','head').addClass('head6');
						handDom.attr('class','hand').addClass('hand3');
						fellDom.attr('class','feel').addClass('feel1');
						addAnimDom.children('.anim1').css({
							'top':startY + 'px',
							'left':startX + 'px'
						})
						break;
					default:
						statements_def
						break;
				}
			}
			//播放声音
			self.doMusics(1);
			self.cHp();//血量变化
			//重置状态
			setTimeout(resets, 500);			
		}
		var touchEvents = {
			moveEndX :0,moveEndY :0,X:0,Y:0,
			
			touchS:function(cDom){
				var _this = this;
				cDom.bind("touchstart", function(e) {
				    e.preventDefault();
				    //判断是否选择了道具
				    if(self.propType == 0){alert('请选择刑具哦！');return false;}
				    startX = e.touches[0].pageX,
				    startY = e.touches[0].pageY;
				    self.TouchResult = 0;
				});
			},
			onlyOneTouch:function(domId){
				var _this = this;
				var cDom = $('#' + domId);
				cDom.bind("touchend", function(e) {
					self.TouchResult = 5;
				});
			},
			//处理方向判断
			touchE:function(cDom){
				var _this = this;
				cDom.bind("touchend", function(e) {
					e.preventDefault();
					var domThis = $(this).attr('id');
					//alert(domThis);
					cDom.addClass('ani-marTop');//使用css3来做上下滑动动画
					endX = e.changedTouches[0].pageX,//滑动x
				    endY = e.changedTouches[0].pageY,//滑动y
				    _this.X = endX - startX,
				    _this.Y = endY - startY;

				    /*if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {}//left to right
				    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {}//right to left*/
				    if ( Math.abs(_this.X) > Math.abs(_this.Y) && _this.X > 0 ) {//left to right
				    	self.TouchResult = 1;
				    }else if ( (Math.abs(_this.X) > Math.abs(_this.Y)) && (_this.X < 0) ) {//right to left
				    	self.TouchResult = 2;
				    }else if ( (Math.abs(_this.Y) > Math.abs(_this.X)) && (_this.Y > 0)) {//top to bottom
				    	self.TouchResult = 3;
				    }else if ( Math.abs(_this.Y) > Math.abs(_this.X) && _this.Y < 0 ) {//bottom to top
				    	self.TouchResult = 4;
				    }else{}//其他其他情况

				    if(e&&e.preventDefault){
						window.event.returnValue = false;//??
					}
					//console.log(self.TouchResult);
					addAnim(domThis,self.TouchResult);
					
				});
			},
			
			init:function(touchs){
				this.touchS(touchs);
				this.onlyOneTouch('playDiv');
				this.touchE(touchs);
				
				
			}
		};
		touchEvents.init(touchs);

	},
	//血量处理变化
	cHp:function(){
		var self = this;
		var sayDom = $('#sayControl');

		self.touchTimes++;
		self.hpV-= Math.floor((100/self.times));
		switch(self.touchTimes){
			case 1:
				sayDom.attr('class','say').addClass('say3 say4');
				break;
			case 3:
				sayDom.attr('class','say').addClass('say5 say6');
				break;
			case 5:
				sayDom.attr('class','say').addClass('say7 say8');
				break;
			case 7:
				sayDom.attr('class','say').addClass('say9 say10');
				break;
			case 10:
				sayDom.attr('class','say').addClass('say11 say12');
				break;
			default:
				break;
		}

		if(self.hpV > 0){
			$('#HPPV').css('width',self.hpV + '%');
			$('#HPV').html(self.hpV);
		}else{
			//0血时，写入后1s,跳走
			$('#HPPV').css('width','0%');
			$('#HPV').html('0');
			setTimeout(function(){
				self.gameOver();
			},2000)
			
		}		
	},
	gameOver:function(){
		var self = this;
		self.touchTimes = 0;//重置步数
		self.locations = 0;//重置翻页位置
		//重置血量
		self.hpV = 100;
		$('#HPPV').css('width',self.hpV + '%');
		$('#HPV').html(self.hpV);
		
		$('#gameStart').removeClass('ani-marTop').css('marginTop','0px');//返回第一个图层
		$('#column1').hide();//隐藏第一个图层
		$('#column2').show().addClass('gameOver');//显示第一个图层
		weixinShare();//调用微信分享函数
	},
	//处理翻页
	TouchPage:function(touchID,cdom){
		var self = this;
		var doms = $('.' + cdom);//获取需要修改的dom
		var cDom = $('#' + touchID);//获取滑动的dom结构
		//获取第一页的marginTop
		var startMarginTop = parseInt(cDom.css('marginTop'));

		var hei = parseInt($(document).height());
		var len = parseInt(doms.length);
		var startX = 0,startY = 0,moveEndX = 0,moveEndY = 0,endX = 0,endY = 0;
		cDom.bind("touchstart", function(e) {
		    e.preventDefault();
		    startX = e.touches[0].pageX,
		    startY = e.touches[0].pageY;
		});
		//只负责滑动时跟随
		cDom.bind("touchmove", function(e) {
			//startMarginTop = parseInt(cDom.css('marginTop'));
		    e.preventDefault();
		    cDom.removeClass('ani-marTop');//去掉css3来做动画
		    moveEndX = e.touches[0].pageX,//滑动x
		    moveEndY = e.touches[0].pageY,//滑动y
		    X = moveEndX - startX,
		    Y = moveEndY - startY;
		    /*if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {}//left to right
		    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {}//right to left*/

			if ( Math.abs(Y) > Math.abs(X) && Y > 0) {//top to bottom
		        if(self.locations <= 0){
		        	//console.log('不能上了')
		        }else{
		        	cDom.css('marginTop',(-1 * hei * self.locations)+Math.abs(Y) + 'px');
		    	}
		    }
		    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {//bottom to top
		        if(self.locations >= (len-1)){
		        	//console.log('不能下了')
		        }else{
		        	//设置人物高度位置
					cruels.playL();
		        	cDom.css('marginTop',(-1 * hei * self.locations)-Math.abs(Y) + 'px');

		    	}
		    }
		    else{//其他其他情况
		    }
		});
		//处理翻页
		cDom.bind("touchend", function(e) {
			e.preventDefault();
			cDom.addClass('ani-marTop');//使用css3来做上下滑动动画
			endX = e.changedTouches[0].pageX,//滑动x
		    endY = e.changedTouches[0].pageY,//滑动y
		    X = endX - startX,
		    Y = endY - startY;

		    if ( Math.abs(Y) > Math.abs(X) && Y > 0) {//top to bottom
		        if(self.locations <= 0){
		        	//console.log('不能上了')
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
		        	//console.log('不能下了')
		        }else{
		        	if(Math.abs(Y) > (hei/5)){
		        		doms.eq(self.locations).removeClass('loadOk');//去掉旧动画class
		        		self.locations++;
		        		cDom.css('marginTop',-1 * hei * self.locations + 'px');
		        		doms.eq(self.locations).addClass('loadOk');//给新页面添加动画class
		        		//单独清除gameover
		        		$('#column2').removeClass('gameOver');
		        		//删除探照灯层
		        		setTimeout(function(){$('.stage').remove();},5500);
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


cruels.prototype.init.prototype = cruels.prototype;//把this->init
cruels = cruels();