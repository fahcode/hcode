$(function(){
	im.init();
});
var im = {
	winHei: parseInt($('#winHei').height()),
	//音乐播放配置
	state: true,
	init:function(){
		var self = this;
		self.setWinHei();
		//加载图片
		//第一屏
		var arr1 = ['bg.jpg','music.png','off.png','on.png','GIC.png','loading/moon.png','loading/moon_bg.png','loading/ld0.png','loading/ld20.png','loading/ld40.png','loading/ld60.png','loading/ld80.png','loading/ld100.png','loading/Christmas.png','loading/deer.png'],
			//loading图片
			arr2 = ['loading/year2015.png','loading/tipsList/Bell1.png','loading/tipsList/Bell2.png','loading/tipsList/Bell3.png','loading/tipsList/candy.png','loading/tipsList/club.png','loading/tipsList/leaf.png','loading/tipsList/snowflake_g.png','loading/tipsList/snowflake_r.png','loading/tipsList/snowman.png','loading/tipsList/sock.png','loading/tipsList/star_b.png','loading/tipsList/star_g.png','loading/tipsList/star_r.png','loading/tipsList/star_g_bg.png','loading/tipsList/star_r_bg.png','logo.png','bg_tips1.png','bg_tips2.png','bg_tips3.png','bg_tips4.png','close.png','share2.png','photoFrame.png','v2/downTips.png','v2/foodBg.png','v2/grdh.png','v2/menuBg.png','v2/menuBtn.png','v2/programBtn.png','v2/txtBg.jpg','v2/window.png','v2/wjtx.png','v2/curtain/curtain1_l.png','v2/curtain/curtain1_r.png','v2/curtain/curtain2_l.png','v2/curtain/curtain2_r.png','v2/programMenu.png','v2/food/food1.png','v2/food/food2.png','v2/food/food3.png','v2/food/food4.png','v2/food/food5.png','v2/food/food6.png','v2/food/food7.png','v2/food/chicken.png','v2/food/tablecloth.png'];

		self.loadingImg('img/',[arr1,arr2]);
		//音乐控制		
		self.doMusics().doAll();
		//点击控制
		self.doPlay();
		//翻页
		self.doPage();
		//食物翻页
		self.doFoodPage();
		//分享提示
		//self.shareFN();
	},
	//设置结构的高度
	setWinHei:function(){
		var self = this;
		$('.setWinHei,.column').css('height',self.winHei + 'px');

	},
	//翻页
	doPage:function(){
		setTimeout(function(){
			var mySwiper1 = new Swiper('.swiper-container', {
	        direction: 'vertical',
	        speed:300
	        
	      });
		},3000)
		
	},
	//食物翻页
	doFoodPage:function(){
		var mySwiper2 = new Swiper('.swiperBox', {
	        direction: 'horizontal',
	        loop:true,
	        autoplay:3000,
	        speed:2000,
	        autoplayDisableOnInteraction:false,
	        // 如果需要分页器
    		pagination: '.swiper-pagination'
	      });
	},
	/*音乐控制*/
	//音乐控制
	doMusics:function(state){
		var self = this;
		var timer = null;
		//var dom = $('#audioBox').html();
		var closeMusic = document.getElementById('closeMusic');
		var audioBg = document.getElementById('audioBg');
		var audioBtn = document.getElementById('audioBtn');
		var audioPop = document.getElementById('audioPop');
		var audioPull = document.getElementById('audioPull');
		var audioFoodIn = document.getElementById('audioFoodIn');

		var ways = {
			doAll:function(){
				var _self = this;
				$(closeMusic).on('touchstart',function(){
					var _this = $(this);
					_this.addClass('doAnimate');
					_self.doBtn();
					var type = $(this).attr('datas');
					if(type == 1){
						self.state = false;
						_this.attr('datas',0);
						$('.switch').addClass('off');
						$(audioBg).attr('src','');
					}else{
						self.state = true;
						_this.attr('datas',1);
						$('.switch').removeClass('off');
						$(audioBg).attr('src','music/bg.mp3');
					}
					setTimeout(function(){
						_this.removeClass('doAnimate');
					},500)
				})
			},
			doBg:function(){
				var _self = this;
				timer = setTimeout(function(){
					clearTimeout(timer);
					try{
						audioBg = document.getElementById('audioBg');
						audioBg.play();
					}catch(e){}
					
				},2000);	
			},
			//按钮点击音乐
			doBtn:function(){
				if(self.state){
					audioBtn.play();
					this.doBg();
				}
			},
			//窗口弹出音乐
			doPop:function(){
				if(self.state){
				audioPop.play();
				this.doBg();
				}
			},
			//拉开完成音乐
			doPull:function(){
				if(self.state){
				audioPull.play();
				this.doBg();
				}
			},
			//食物出现音乐
			doFoodIn:function(){
				if(self.state){
				audioFoodIn.play();
				this.doBg();
				}
			}
		}
		return ways;
		
	},
	//loading加载过程
	loadingImg:function(path,arr){
		var self = this,
			loadLen = arr[0].length,
			imgLen = arr[1].length,
			/*判断是否加载*/
			isLoad = false,
			//计数
			iCount = 0;

		function doLoad(newArr,isDo){
			//重置计数
			iCount = 0;
			isLoad = false;
			var len = newArr.length;
			var newImgs = new Image();
			for(var j = 0;j<len;j++){
				newImgs = new Image();
				newImgs.src = path + newArr[j];
				newImgs.onload = function(){
					iCount++;
					//只判断是否全部加载
					if(iCount >= len){
						//console.log('加载成功');
						isLoad =  true;
					}		
				}
			}
		};
		//先执行首屏的图片加载
		(function(){
			doLoad(arr[0]);
			var times = setInterval(function(){
				if(isLoad){
					clearInterval(times);
					//执行真实的图片加载
					doLoad(arr[1]);
					//执行load动画
					loadChange();
				};
			},60);
		})();
		//执行load动画
		function loadChange(){
			var self = this;
			var planDom = $('#plan');
			var planV = 0;
			var spead = 2000;

			function doPlan(plan){
				if(plan>=100){
					planDom.attr('class','plan pc100');
					//显示小东西
					$('#load .tipsList').addClass('loadShow');
					var timerIs = setInterval(function(){
						//只有图片完全加载后才会显示
						if(isLoad){
							clearInterval(timerIs);
							//处理load层
							$('.loadingBox').fadeOut(500,function(){
								$('.play').addClass('animateOk');
								$('#share2').show();
								//定时增加logo动画效果
								setTimeout(function(){$('.logo').addClass('bounce')},3000);
							});
						}
					},1000);
				}else if(plan>=80){
					planDom.attr('class','plan pc80');
					//显示吊着的小球
					$('#load .BellList').addClass('loadShow');
					
				}else if(plan>=60){
					planDom.attr('class','plan pc60');
					//显示2015
					$('#load .year2015').addClass('loadShow');
					spead = 1000;//修改速度
				}else if(plan>=40){
					planDom.attr('class','plan pc40');
					//显示圣诞节  文字
					$('#load .Christmas').addClass('loadShow');
					
				}else if(plan>=20){
					planDom.addClass('pc20');
					//显示鹿
					$('#load .deer').addClass('loadShow');
				}else{
					//显示月亮
					$('#load .moon').addClass('loadShow');
					planDom.attr('class','plan');
				}
			}
			doPlan(planV);
			var times = setInterval(function(){
				planV+=20;
				doPlan(planV);
				if(planV>=100){clearInterval(times)};
			}, spead);
		};
		
	},
	/*点击按钮后的页面逻辑*/
	doPlay:function(){
		var self = this;
		var timeI = 0;
		var menuBtn = $('#menuBtn .menuBtn'),
			programBtn = $('#menuBtn .programBtn'),
			state2 = $('.state2'),
			state3 = $('.state3'),
			curtainLeft = $('#curtainLeft'),
			curtainRight = $('#curtainRight'),
			shareBtn = $('#share2');

		//关闭
		$('.menuClose').on('touchstart',function(){
			var _this = $(this);
			shareBtn.fadeIn();
			_this.closest('.menuBox').removeClass('showMenu');
			self.doMusics().doBtn();
			try {//try里面运行要执行的代码
				menuBtn.attr('datas',1);
				programBtn.attr('datas',1);
				curtainLeft.removeClass('curtainLeft2');
				curtainRight.removeClass('curtainRight2');
			} catch (err) {}

		});
		programBtn.on('touchstart',function(){
			var _this = $(this);
			var type = _this.attr('datas');
			if(type == 1){
				shareBtn.fadeOut();
				_this.attr('datas',0);
				menuBtn.attr('datas',1);
				self.doMusics().doBtn();
				_this.addClass('rotateY');
				setTimeout(function(){
					_this.removeClass('rotateY');
					//点击播放弹窗音乐
					self.doMusics().doPop();
				},1000);
				setTimeout(function(){
					curtainLeft.addClass('curtainLeft2');
					curtainRight.addClass('curtainRight2');
					//拉开音乐
					self.doMusics().doPull();
				},2000)
				state3.removeClass('showMenu');
				state2.addClass('showMenu');
			}
						
		});
		menuBtn.on('click',function(){
			var _this = $(this);
			var type = _this.attr('datas');
			if(type == 1){
				//隐藏分享
				shareBtn.fadeOut();
				_this.attr('datas',0);
				programBtn.attr('datas',1);
				self.doMusics().doBtn();
				_this.addClass('rotateY');
				setTimeout(function(){
					_this.removeClass('rotateY');
					//点击播放弹窗音乐
					self.doMusics().doPop();
				},800);
				var timers = setInterval(function(){
					timeI++;
					//食物出现音效
					self.doMusics().doFoodIn();
					if(timeI >= 6){timeI=0;clearInterval(timers)};
				},1000);
				state2.removeClass('showMenu');
				state3.addClass('showMenu');
			}
		});
	},
	//分享效果
	shareFN:function(){
		$('#share,#share2').on('touchstart',function(){
			var dom = '<div id="shareTipsBox"><div class="tipsImg"></div><div class="clBox"></div></div>';
			$('body').append(dom);

			$('#shareTipsBox').on('touchstart',function(){
				$(this).remove();
			})
		});
	}
}
