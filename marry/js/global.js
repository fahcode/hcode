
$(function(){
	im.init();
});
var im = {
	winHei: parseInt($('#winHei').height()),
	//音乐播放配置
	state: true,
	//cookie
	isWishCookie: 0,
	//判断设备是否支持touch事件
	isTouch:null,
	touchOneByOne:null,
	init:function(){
		var self = this;
		self.isWishCookie = 0;
		self.isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		self.touchOneByOne = (self.isTouch)?'touchstart':'click';
		self.setWinHei();
		//加载图片
		//第一屏
		var arr1 = ['bg1.jpg','normalmusic.svg','letter/letterMain.png'],
			//loading图片
			arr2 = ['letter/img1.png','letter/img2.png','letter/img7.png','letter/img8.png','letter/xi.png','letter/xiBg.png','letter/letterT.png','letter/letterLight.png','letter/cakes.png','axle.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.png','bg6.jpg','bg7.jpg','bride.png','groom.png','icon.png','invite.png','letterTit.png','love.png','loveS.png','marryTit.png','musicBg.png','point.png','up.png','letterTxt/coupleImg1.png','letterTxt/star.png','letterTxt/txt1.png','letterTxt/txt2.png','letterTxt/txtBg.jpg','marryImg/coupleImg2.png','marryImg/coupleImg3.png','marryImg/coupleImg4.png','marryImg/coupleImg5.png','marryImg/coupleImg6.png','marryImg/coupleImg7.png','marryImg/coupleImg8.png','marryImg/coupleImg9.png','marryImg/coupleImg10.png','marryImg/coupleImg11.png','marryImg/coupleImg12.png','marryImg/coupleImg13.png','marryImg/txt1.png','marryImg/txt2.png','marryImg/txt3.png'];
		self.loadingImg('img/',[arr1,arr2]);

		//音乐开关控制		
		self.doMusics().doAll();
		
		//祝福
		self.clickWish();
	},
	//音乐控制
	doMusics:function(state){
		var self = this;
		
		var timer = null;
		//var dom = $('#audioBox').html();
		var closeMusic = document.getElementById('closeMusic');
		var audioBg = document.getElementById('audioBg');
		//var audioPhoto = document.getElementById('audioPhoto');

		var ways = {
			doAll:function(){
				var _self = this;
				$(closeMusic).on(self.touchOneByOne,function(){
					var _this = $(this);
					//_self.doBtn();
					var type = $(this).attr('datas');
					if(type == 1){
						self.state = false;
						_this.removeClass('musicAnim');
						_this.attr('datas',0);
						$('.switch').addClass('off');
						$(audioBg).attr('src','');
						audioBg.pause();
					}else{
						self.state = true;
						_this.addClass('musicAnim');
						_this.attr('datas',1);
						$('.switch').removeClass('off');
						$(audioBg).attr('src','music/bg.mp3');
						audioBg.play();
					}
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
			}
		}
		return ways;
		
	},
	//设置结构的高度
	setWinHei:function(){
		var self = this;
		$('.setWinHei,.column').css('height',self.winHei + 'px');
		
	},
	//上下滑动
	swiper:function(){
		var mySwiper1 = new Swiper('.swiper-container', {
            direction: 'vertical'});
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
						$('#planValue').html(planValue);
						//加载成功后执行
						if(iCount >= len){
							isLoad =  true;
							//隐藏load层
							$('#loading').addClass('ot0');
							setTimeout(function(){
								self.loadOk();
							},1000);
							return false;
						}
					}else{
						//只判断是否全部加载
						if(iCount >= len){isLoad =  true;}
					}
							
				}
			}
		};
		//先执行首屏的图片加载
		(function(){
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
		//添加信封拆开动画
		$('#letter').addClass('loadOk');
		/*添加信封事件*/
		$('#openLetterBox').on(self.touchOneByOne,function(){
			$('#letter').addClass('open');
		});
		$('#seeLetter').on(self.touchOneByOne,function(){
			$('#letter').addClass('see');
			//隐藏信函，同时给滑动层添加动画
			setTimeout(function(){
				$('#letter').hide();
				$('#play').addClass('active');
			},1100);
		});
		self.swiper();
		self.switchCouple();
		self.switchImg();
		//选择出行方案
		self.choosePath();
	},
	/*左右切换新郎新娘*/
	switchCouple:function(){
		var self = this;
		var startX,startY,moveEndX,moveEndY,X,Y,endX,endY;
		var Img1 = $('#switchCouple .img1'),
		    Img2 = $('#switchCouple .img2'),
		    txt1 = $('#switchCouple .txt1');

		function touchstartFN(e){
			e.preventDefault();
			startX = e.touches[0].pageX,
		    startY = e.touches[0].pageY;
		};
		function touchmoveFN(e) {
		    moveEndX = e.touches[0].pageX,//滑动x
		    moveEndY = e.touches[0].pageY,//滑动y
		    X = moveEndX - startX,
		    Y = moveEndY - startY;
		    //left to right
		    if( Math.abs(X) > Math.abs(Y) && X > 0 ){
		    	//切换老婆
		    }
		    //right to left
		    else if( Math.abs(X) > Math.abs(Y) && X < 0 ){
		    	//默认状态下
		    }

		};
		function touchendFN(e) {
			e.preventDefault();
			endX = e.changedTouches[0].pageX,//滑动x
		    endY = e.changedTouches[0].pageY,//滑动y
		    X = endX - startX,
		    Y = endY - startY;
		    //left to right
		    if( Math.abs(X) > Math.abs(Y) && X > 0 ){
		    	$('#switchCouple').removeClass('showWife');
		    }
		    //right to left
		    else if( Math.abs(X) > Math.abs(Y) && X < 0 ){
		    	$('#switchCouple').addClass('showWife');
		    }
		    if(e&&e.preventDefault){
				window.event.returnValue = false;
			}
		};
		//触摸方向判断事件
		$('#switchCouple').on("touchstart",function(eve){touchstartFN(eve)});
		//$('#switchCouple').on("touchmove",function(eve){touchmoveFN(eve)});
		$('#switchCouple').on("touchend",function(eve){touchendFN(eve)});	
	},
	/*左右切换图片*/
	switchImg:function(){
		var self = this;
		var startX,startY,moveEndX,moveEndY,X,Y,endX,endY;
		var ImgArr = $('#switchImg .coupleImg'),
			ImgLen = ImgArr.length,
			_index = 0;

		function touchstartFN(e){
			e.preventDefault();
			startX = e.touches[0].pageX,
		    startY = e.touches[0].pageY;
		};
		function touchmoveFN(e) {
		    moveEndX = e.touches[0].pageX,//滑动x
		    moveEndY = e.touches[0].pageY,//滑动y
		    X = moveEndX - startX,
		    Y = moveEndY - startY;
		    //left to right
		    if( Math.abs(X) > Math.abs(Y) && X > 0 ){
		    	//切换老婆
		    }
		    //right to left
		    else if( Math.abs(X) > Math.abs(Y) && X < 0 ){
		    	//默认状态下
		    }
		};
		function touchendFN(e) {
			e.preventDefault();
			endX = e.changedTouches[0].pageX,//滑动x
		    endY = e.changedTouches[0].pageY,//滑动y
		    X = endX - startX,
		    Y = endY - startY;
		    //left to right
		    if( Math.abs(X) > Math.abs(Y) && X > 0 ){
		    	_index--;
		    	if(_index<0){_index = 0;}
		    }
		    //right to left
		    else if( Math.abs(X) > Math.abs(Y) && X < 0 ){
		    	_index++;
		    	if(_index>=ImgLen){_index = (ImgLen-1);}
		    }
		    //当返回滑时
		    if(_index!=0){ImgArr.eq(_index-1).attr('class','coupleImg rotate0 pa');}
		    //ImgArr.eq(_index-1).attr('class','coupleImg rotate0 pa');
	    	ImgArr.eq(_index).attr('class','coupleImg rotate1 pa');
	    	ImgArr.eq(_index+1).attr('class','coupleImg rotate2 pa');
	    	ImgArr.eq(_index+2).attr('class','coupleImg rotate3 pa');
	    	//设置点的位置
	    	$('#point').attr('class','point pa w' + (_index+1));
	    	if(e&&e.preventDefault){
				window.event.returnValue = false;
			}
		};
		//触摸方向判断事件
		$('#switchImg').on("touchstart",function(eve){touchstartFN(eve)});
		//$('#switchImg').on("touchmove",function(eve){touchmoveFN(eve)});
		$('#switchImg').on("touchend",function(eve){touchendFN(eve)});	
	},
	//出行方案选择
	choosePath:function(){
		var self = this;
		var datas = [
			{
				'name':'sh',
				'datas':{
					'g':[
						{'w1':'K469','w2':['上海南','赣州'],'w3':['02-28/17:20','02-29/08:28'],'w4':'历时15:08'},
						{'w1':'K8769','w2':['赣州','瑞金'],'w3':['02-29/08:47','02-29/10:16'],'w4':'K469=K8769直达瑞金'}
					],
					'b':[
						{'w1':'D3147','w2':['瑞金','上海虹桥'],'w3':['03-02/11:50','03-02/22:10'],'w4':'历时10:20'}
					]
				}
			},
			{
				'name':'hz',
				'datas':{
					'g':[
						{'w1':'K469','w2':['杭州东','赣州'],'w3':['02-28/19:34','02-29/08:28'],'w4':'历时12:54'},
						{'w1':'K8769','w2':['赣州','瑞金'],'w3':['02-29/08:47','02-29/10:16'],'w4':'K469=K8769直达瑞金'}
					],
					'b':[
						{'w1':'D3147','w2':['瑞金','杭州东'],'w3':['03-02/11:50','03-02/20:44'],'w4':'历时08:54'}
					]
				}
			},
			{
				'name':'yw',
				'datas':{
					'g':[
						{'w1':'K469','w2':['义乌','赣州'],'w3':['02-28/21:09','02-29/08:28'],'w4':'历时11:19'},
						{'w1':'K8769','w2':['赣州','瑞金'],'w3':['02-29/08:47','02-29/10:16'],'w4':'K469=K8769直达瑞金'}
					],
					'b':[
						{'w1':'K8724','w2':['瑞金','南昌'],'w3':['03-02/11:12','03-02/18:41'],'w4':'历时07:29'},
						{'w1':'G1306','w2':['南昌西','义乌'],'w3':['03-02/19:43','03-02/21:43'],'w4':'历时02:00'},
					]
				}
			},
			{
				'name':'sz',
				'datas':{
					'g':[
						{'w1':'未知','w2':['深圳','寻乌'],'w3':['02-29/06:00','02-29/24:00'],'w4':'没有合适的火车,可以坐汽车'},
						{'w1':'K8723','w2':['赣州','瑞金'],'w3':['02-29/12:31','02-29/14:00'],'w4':'历时01:29'},
						{'w1':'汽车','w2':['瑞金','寻乌澄江'],'w3':['02-29/15:20','02-29/17:30'],'w4':'到寻乌澄江下车'}
					],
					'b':[
						{'w1':'D6574','w2':['瑞金','赣州'],'w3':['03-02/11:00','03-02/11:56'],'w4':'历时00:56'},
						{'w1':'Z107','w2':['赣州','深圳'],'w3':['03-02/12:22','03-02/17:51'],'w4':'历时05:29'},
					]
				}
			},
			{
				'name':'lj',
				'datas':{
					'g':[
						{'w1':'去桐畈','w2':['无','无'],'w3':['无','无'],'w4':'去桐畈参加正月初6的婚宴'}
					],
					'b':[
						{'w1':'无','w2':['无','无'],'w3':['无','无'],'w4':'自行返回'}
					]
				}
			}
		];
		//默认插入上海
		self.setTraffic('sh',datas);	
		$('#isAudit').change(function(){
			var _index = $(this)[0].selectedIndex;
			var val = $(this)[0].options[_index].value;
			self.setTraffic(val,datas);
		}); 
	},
	//插入交通数据
	setTraffic:function(val,datas){
		var dom;
		var goWayBox = $('#goWayBox'),
			backWayBox = $('#backWayBox');
		//清除数据
		goWayBox.children('.c').remove();
		backWayBox.children('.c').remove();
		for(var i = 0;i<datas.length;i++){
			if(datas[i].name == val){
				var dataList = datas[i].datas;
				var gLen = dataList.g.length;
				var bLen = dataList.b.length;
				//添加出发的路线
				for(var j = 0;j<gLen;j++){
					var thisData = (dataList.g)[j];
					dom = '<tr class="c"><td>'+ thisData.w1 +'</td><td><div>'+ (thisData.w2)[0] +'</div><div class="end-s">'+ (thisData.w2)[1] +'</div></td><td><div>'+ (thisData.w3)[0] +'</div><div class="end-t">'+ (thisData.w3)[1] +'</div></td><td>'+ thisData.w4 +'</td></tr>';
					goWayBox.append(dom);
				}
				//添加返回的路线
				for(var k = 0;k<bLen;k++){
					var thisData = (dataList.b)[k];
					dom = '<tr class="c"><td>'+ thisData.w1 +'</td><td><div>'+ (thisData.w2)[0] +'</div><div class="end-s">'+ (thisData.w2)[1] +'</div></td><td><div>'+ (thisData.w3)[0] +'</div><div class="end-t">'+ (thisData.w3)[1] +'</div></td><td>'+ thisData.w4 +'</td></tr>';
					backWayBox.append(dom);
				};
				return false;
			}
		}
	},
	//点击祝福，且通过cookie判断是否已经点击过
	clickWish:function(){
		var self = this;
		var date=new Date(); 
		//设置date为当前时间+30天
		date.setTime(date.getTime()+30*24*60*60*1000);
		//将date赋值给expires
		//document.cookie="key=value; expires="+date.toGMTString(); 
		//同时读取cookie
		var strCookie=document.cookie;
		var isWish = 0;
		//将多cookie切割为多个名/值对
		var arrCookie=strCookie.split(";");
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if(arr[0] == "isWishCookie"){
				isWish = arr[1];
				break;
			}
		};
		if(parseInt(isWish)){$('#WishLive').addClass('on')};
		$('#WishLive').on(self.touchOneByOne,function(){
			var _this = $(this);
			if( !parseInt(isWish) && !self.isWishCookie){
				self.isWishCookie = 1;
				//ajax提交
				$.getJSON('setWish.php',function(datas){
					if(datas.Code == 0){
						//写入默认cookie
						document.cookie="isWishCookie=" + self.isWishCookie + "; expires="+date.toGMTString();
						_this.addClass('on');
						$('#WishVal').html( parseInt($('#WishVal').html())+1 );
					}
				});
			}else{
				console.log('您已经祝福过了，谢谢您的祝福！');
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
