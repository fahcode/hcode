
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
		//判断是否微信
		self.is_weixn();
		//加载图片
		//第一屏
		var arr1 = ['sun.png','bg1.jpg'],
			//loading图片
			arr2 = ['txt1.png','txt2Bg.png','txt3.png','productBg.png','share.jpg','bg2.jpg','bg3.jpg','cloud.png','arrow.png','chest1.png','chest2.png','chest3.png','kaola/arm_l1.png','kaola/arm_l2.png','kaola/arm_r1.png','kaola/arm_r2.png','kaola/goods1.png','kaola/goods2.png','kaola/goods3.png','kaola/goods4.png','kaola/kaola_main.png','kaola/kaola_view.png','kaola/belt.png','kaola/eyes.png','kaola/eyes_s.png','kaola/light.png','kaola/light_s.png','kaola/mouth.png','lotus/lotus1.png','lotus/lotus2.png','lotus/lotusLight.png','symbol/symbol1.png','symbol/symbol2.png','symbol/symbol3.png','symbol/symbol4.png','symbol/symbol5.png','symbol/symbol6.png','symbol/symbol7.png','symbol/symbol8.png','product/1.jpg','product/2.jpg','product/3.jpg','product/4.jpg','product/5.jpg','product/6.jpg','product/7.jpg','product/8.jpg','product/9.jpg','product/10.jpg','product/11.jpg'];
		self.loadingImg('img/',[arr1,arr2]);

		//音乐开关控制		
		//self.doMusics().doAll();
		//点击宝箱后
		self.doChests();
		//分享提示
		//self.shareFN();
		//禁用文字的默认事件
		self.preventDefault();
	},
	//判断是否微信
	is_weixn:function(){
	    var ua = navigator.userAgent.toLowerCase();
	    //(ua.indexOf('yixin')>0){}
	    if( (ua.match(/MicroMessenger/i)=="micromessenger") || (ua.indexOf('yixin') != -1) ){
	        return true;
	    }else {
	        //不是微信则隐藏
	        $('#share').hide();
	    }
	},
	//禁用文字的默认事件
	preventDefault:function(){
		$("#txtList .tips2").on("touchstart", function(e) {
			console.log(1);
		    e.preventDefault();
		    return false;
		});
	},
	
	//音乐控制
	doMusics:function(state){
		var self = this;
		
		var timer = null;
		//var dom = $('#audioBox').html();
		//var closeMusic = document.getElementById('closeMusic');
		var audioBg = document.getElementById('audioBg');
		var audioBtn = document.getElementById('audioBtn');
		var kaolaAni = document.getElementById('kaolaAni');
		var shakeAudio = document.getElementById('shakeAudio');
		//var audioPhoto = document.getElementById('audioPhoto');

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
					
				},3000);	
			},
			//按钮点击音乐
			doBtn:function(){
				if(self.state){
					audioBtn.play();
					this.doBg();
				}
			},
			//考拉出现音乐
			doKaolaAni:function(){
				if(self.state){
				kaolaAni.play();
				this.doBg();
				}
			},
			//摇一摇音乐
			doShake:function(){
				if(self.state){
				shakeAudio.play();
				this.doBg();
				}
			}
		}
		return ways;
		
	},
	//设置结构的高度
	setWinHei:function(){
		var self = this;
		$('.setWinHei,.column').css('height',self.winHei + 'px');

	},
	//loading加载过程
	loadingImg:function(path,arr){
		var self = this,
			loadLen = arr[0].length,
			imgLen = arr[1].length,
			/*判断是否加载*/
			isLoad = false,
			//计数
			iCount = 0,
			planValue = '0%';
		//3d切换文字
		function page3D(){
			var i = 0;
			var times = setInterval(function(){
				i++;
				if(i>=2){i=0};
				$('#page3D div').eq(i).addClass('hover').siblings().removeClass('hover');
				//加载完成后，关闭切换
				if(isLoad){clearInterval(times);return false;}
			},1500)
		}
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
					if(isDo){
						planValue = Math.floor( ((iCount/len)*100).toFixed(2)) + '%';
						$('#plan').html(planValue);
						//加载成功后执行
						if(iCount >= len){self.loadOk();isLoad =  true;return false;}
					}else{
						//只判断是否全部加载
						if(iCount >= len){isLoad =  true;}
					}
							
				}
			}
		};
		//先执行首屏的图片加载
		(function(){
			//3d切换
			page3D();
			doLoad(arr[0],false);
			var times = setInterval(function(){
				if(isLoad){
					clearInterval(times);
					//执行真实的图片加载
					doLoad(arr[1],true);
				};
			},60);
		})();	
	},
	//加载完成后的逻辑
	loadOk:function(){
		var self = this;
		$('#play').addClass('loadOk');
		//计时单独添加动画class
		//给考拉添加浮动效果
		$('.kaola').addClass('kaolaAni');
		//6s添加两个飞蛾
		/*setTimeout(function(){
			$('.mothBox').show();
		}, 6000);*/
		//点击莲花后的页面逻辑
		self.doPlay();
		//摇一摇功能
		setTimeout(function(){
			self.shake();
		},15000);
	},
	/*点击按钮后的页面逻辑*/
	doPlay:function(){
		var self = this;
		var timeI = 1;
		var count = 0;//计数器
		var timers = null;//定时函数
		var timersAni = null;//定时动画函数
		var lotus = $('#lotus'),
			lightList = $('#lightList'),
			light = lightList.children('.light'),
			lightLen = light.length,
			len = (lightList.children('.show')).length;
		//判断灯亮
		function isCountOk(){
			count = 0;
			timers = setTimeout(function(){
				clearTimeout(timers);
				
					//如果5秒内点击超过15次，就亮灯；不超过则减一灯
					if(count>=10){
						light.eq(len).addClass('show');
						if(len == (lightLen-1)){
							//执行灯全部亮后的操作
							self.lightOk();
						}
					}else{
						if(len != 0){
							light.eq(len-1).removeClass('show');
						}
					}
					//释放控制
					timeI = 1;
					/*初始计数*/
					count = 0;

				//清除落叶函数
				$('#symbolList').attr('class','symbolTxtList');
			},5000);
		}
		lotus.on('touchstart',function(event){
			var _this = $(this);
			var timer3 = null;
			//点击播放按钮音乐
			self.doMusics().doBtn();
			//增加点击效果
			_this.addClass('bounceDown');
			timer3 = setTimeout(function(){
				clearTimeout(timer3);
				_this.removeClass('bounceDown');
			},400);
			//5s内的第一次点击执行延时检验
			if(timeI == 1){
				timeI = 0;//控制延时函数的单次调用

				//计数当前有几个亮灯
				len = (lightList.children('.show')).length;
				//如果灯全部亮了，游戏就结束了
				if(len < lightLen){
					isCountOk();
					//执行符落下效果
					self.symbolAni();
				}
			}
			count++;
		});
	},
	//摇一摇功能
	shake:function(){
		var self = this;
		var state = 1;
		var lightList = $('#lightList'),
			light = lightList.children(),
			lightLen = light.length,
			len = 0;
		//初始化摇一摇
		var myShakeEvent = new Shake({ 
	        threshold: 10,
	        timeout: 1500
	    });  
	    myShakeEvent.start(); 
	    window.addEventListener('shake', shakeEventDidOccur, false);
	    //$('.kaola')[0].addEventListener('click',shakeEventDidOccur, false); 
	    function shakeEventDidOccur(){
	    	//计数当前有几个亮灯
			len = (lightList.children('.show')).length;
			function isCountOk(){
				light.eq(len).addClass('show');
				if(len == (lightLen-1)){
					//执行灯全部亮后的操作
					self.lightOk();
				}
			};
			if(len < lightLen){
				$('.kaola').addClass('shake2');
				var timers = setTimeout(function(){
					clearTimeout(timers);
					$('.kaola').removeClass('shake2');
				},3000);
		    	//执行摇一摇音效
		    	self.doMusics().doShake();
		        //执行符落下效果
				self.symbolAni();
				setTimeout(function(){
					//清除落叶效果
					$('#symbolList').attr('class','symbolTxtList');	
				},6000);
				//判断灯亮
				isCountOk();
			};
	    }
	},
	//执行符落下效果,且随机设置符的left
	symbolAni:function(){
		var aniLen = 3;//一次掉落的个数
		var oldrandom = 0;//记录前一次的随机值
		var symbolList = $('#symbolList'),
			symbol = symbolList.children('div'),
			symbolLen = symbol.length,
			leftArr = ['10%','20%','30%','50%','60%','70%','80%','85%','90%'];
		//随机设置left
		/*for(var i = 0;i< symbolLen;i++){
			var random1 = Math.floor(Math.random()*(leftArr.length));
			symbol.eq(i).css('left',leftArr[random1]);
			if(i==(symbolLen-1)){addFall();}
		}*/
		//随机2设置缩放大小
		for(var i = 0;i< symbolLen;i++){
			var random1 = Math.floor(Math.random()*2);
			symbol.eq(i).removeClass('symbolScale0').addClass('symbolScale'+ random1);
			if(i == (symbolLen-1)){}
		}
		var random2 = Math.floor(Math.random()*4);
		symbolList.attr('class','symbolTxtList random'+random2);
	},
	//灯全部亮后执行的效果
	lightOk:function(){
		var self = this;
		//console.log('gg全部亮了！');
		//清除落叶函数
		//$('#symbolList').attr('class','symbolTxtList');
		//后续操作，睁开眼睛
		$('#eyes').addClass('open');
		//gameOver动画
		$('#play').addClass('gameOver');
		//4.2s后添加宝箱出现动画音效
		setTimeout(function(){
			self.doMusics().doKaolaAni();
		},4200);
		//8s定时增加箱子id,绑定事件
		setTimeout(function(){
			$('.chests').attr('id','chests');
		},8000);
		return false;
	},
	//点击宝箱后
	doChests:function(){
		var self = this;
		var productName = $('#productName'),
			productTxt = $('#productTxt'),
			productImg = $('#productImg');
		var chests = $('.chests');
		chests.on('touchstart',function(){
		  var _this = $(this),
			  id = _this.attr('id');
		  if(id == 'chests'){

			//随机获取当前的运势
			productImg.attr('class','productImg img'+ (randomShare+1));
			productName.html(shareTitle);
			productTxt.html((txtArr.txt)[randomShare]);

			//点击后显示打开状态
			_this.removeClass('initial').addClass('open');
			//隐藏上一个阶段的提示
			$('.openTxt,#normalSun .txt0').hide();
			//添加打开后动画
			$('#normalSun').addClass('open');
			//显示分享
			$('#share').addClass('sshow');
		  }
		})

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
