
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
			arr2 = ['loading/year2015.png','loading/tipsList/Bell1.png','loading/tipsList/Bell2.png','loading/tipsList/Bell3.png','loading/tipsList/candy.png','loading/tipsList/club.png','loading/tipsList/leaf.png','loading/tipsList/snowflake_g.png','loading/tipsList/snowflake_r.png','loading/tipsList/snowman.png','loading/tipsList/sock.png','loading/tipsList/star_b.png','loading/tipsList/star_g.png','loading/tipsList/star_r.png','loading/tipsList/star_g_bg.png','loading/tipsList/star_r_bg.png','logo.png','share.png','bg_tips1.png','bg_tips2.png','close.png','hr.png','againBtn.png','shareBtn.png','shootBtn.png','inputBg.png','photoFrame.png'];

		self.loadingImg('img/',[arr1,arr2]);
		//音乐控制
		self.doMusics().doAll();
		//点击控制
		self.doPlay();
	},
	//设置结构的高度
	setWinHei:function(){
		var self = this;
		$('.setWinHei').css('height',self.winHei + 'px');
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
		var audioPhoto = document.getElementById('audioPhoto');

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
			//拍照完成音乐
			doPhoto:function(){
				var _self = this;
				if(self.state){
				audioPhoto.play();
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
							$('.play').fadeIn(400,function(){
								$(this).addClass('animateOk');
								//定时增加logo动画效果
								setTimeout(function(){$('.logo').addClass('bounce')},3000);
								$('.loadingBox').empty();
							})
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
	//点击按钮翻页
	flipOut:function(isTouch,type){
		var self = this;
		var _index = 0;
		//点击播放按钮音乐
		self.doMusics().doBtn();
		var isTouchId = isTouch;
		// 在前面显示的元素，隐藏在后面的元素
		var eleBackIndex = (type>=3)?0:type,
		// 纸牌元素们 
		eleList = isTouchId.children('.item');

	    // 切换的顺序如下
	    // 1. 当前在前显示的元素翻转90度隐藏, 动画时间225毫秒
	    // 2. 结束后，之前显示在后面的元素逆向90度翻转显示在前
	    // 3. 完成翻面效果
	    eleList.addClass("out").removeClass("in");
	    setTimeout(function() {
	        eleList.eq(eleBackIndex).addClass("in").removeClass("out");
	    }, 225);

	},
	/*点击按钮后的页面逻辑*/
	doPlay:function(){
		var self = this;
		var timer = null;
		var isTouchId = $('#isTouch'),
			shareBtn = $('#shareBtn'),
			//重拍按钮
			againBtn = $('#overBtnBox .againBtn'),
			//保存分享按钮
			saveBtn = $('#overBtnBox .saveBtn');
		isTouchId.on('touchstart',function(){
			var _this = $(this);
			var type = _this.find('.in').attr('datas');
			if(type == 1){
				//调用翻转按钮效果
				self.flipOut(_this,type);
				//显示内容层，
				$('.state2').addClass('show');
				//点击播放弹窗音乐
				self.doMusics().doPop();
			}else if(type == 2){
				shareBtn.attr('datas',0);
				//校验输入信息
                queryEmpno();
                //定时清空
                timer = setTimeout(function(){
                	try{clearTimeout(timer);}catch(e){};
                	shareBtn.attr('datas',2);
                },2000)    
			}
			//关闭
			$('#inputClose').on('touchstart',function(){
				$('.state2').removeClass('show').children('.inputBg').addClass('closeAnimate');
				self.flipOut(_this,0);
				shareBtn.attr('datas',2);
			})	

		});
		//拍照后两个按钮功能
		againBtn.on('touchstart',function(){
			//重拍
            selectPhoto('update');
		});
		saveBtn.on('touchstart',function(){
			//弹窗透明层
			self.shareFN();
		})
	},
	//分享效果
	shareFN:function(){
		//$('#share,#share2').on('touchstart',function(){
			var dom = '<div id="shareTipsBox"><div class="tipsImg"></div><div class="clBox"></div></div>';
			$('body').append(dom);

			$('#shareTipsBox').on('touchstart',function(){
				$(this).remove();
			})
		//});
	}
}
