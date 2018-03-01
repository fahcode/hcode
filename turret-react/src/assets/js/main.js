$(function(){
	im.CK_HEAD_URL();
	im.init();
});
var _title = '';
var im = {
	winHei: 0,
	winWid:0,
	//判断设备是否支持touch事件
	isTouch:null,
	HEAD_URL:'',
	of:true,
	CK_HEAD_URL:function(){
		var self = this;
		//测试环境判断
		var _str = "jl.web.ztgame.com";
		var val_ = new RegExp(_str);
		if( val_.test(window.location) ){
	        self.HEAD_URL = "http://act.jl.web.ztgame.com";
        }else{
        	self.HEAD_URL = "http://act.jl.ztgame.com";
        };
	},
	init:function(){
		var self = this;
		self.winWid = parseInt($('#winHei').width());
		self.winHei = parseInt($('#winHei').height());
		self.isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		self.touchOneByOne = (self.isTouch)?'touchstart':'click';
		
		self.setWinHei();
		//self.isWeixinIE();
		if(self.isPc()){
			$('.noBtn').addClass('pc');
			$('.noBtn').attr('href','javascript:;');
		}
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
	isWeixinIE:function(){ 
	    var ua = navigator.userAgent.toLowerCase();  
	    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
	        //是微信提示弹窗
	        $('#weixinTs').show();
	    };
	    $('#weixinTs').on('touchstart',function(){
	    	$(this).hide();
	    })
	},
	tagPage:function(){
		var self = this;
		//进入第二页
		$('.slotBtn').on('click',function(){
			$('.r1').removeClass('on').addClass('of');
			$('.r2').addClass('on');
		});
		//进入第3页
		$('.sureBtn').on('click',function(){
			$('.r2').removeClass('on').addClass('of');
			$('.r3').addClass('on');
		});
		//进入第5页
		$('.noBtn.pc').live('click',function(){
			$('.r2').removeClass('on').addClass('of');
			$('.r5').addClass('on');
		});
		//进入第4页
		$('.setBtn').on('click',function(){
			var val = $('#uid').val();
			if(val == ""){alert('请输入页游ID哦！');return false;};
			if(self.of){
				self.of = false;
				//显示loading
				$('.popBg').addClass('on');
				$('.loaderPop').addClass('on');
				self.setGameId(val,showName);
			}
		});
		//查询游戏名字
		function showName(name){
			$('#gameName').html(name);
			$('.r3').removeClass('on').addClass('of');
			$('.r4').addClass('on');
		};
	},
	isPc:function() {
		var userAgentInfo = navigator.userAgent;
		var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {flag = false;break;}
		}
		return flag;
	},
	setGameId:function(id,callback){
		var self = this;
		$.ajax({
			url: self.HEAD_URL+ '/preorder/index.php?mod=api&act=gettitle&id='+ id,
			type: 'GET',
			dataType: 'json',
			error:function(msg){
				console.log(msg);
				self.hidePop();
				self.of = true;
			},
			success:function(data){
				if(data.status == 1){
					_title = data.title;
					self.hidePop();
					callback.call(self,data.title);
				}else{
					self.hidePop();
					alert(data.msg);
					self.of = true;
				}
			}
		});
		
	},
	showEvenPop:function(btnclass,showcalss){
		var btnclass = $('.'+btnclass);
		var showcalss = $('.'+showcalss);
		var popBg = $('.popBg');
		btnclass.on('click',function(){
			$('.pop').removeClass('on');
			popBg.addClass('on');
			showcalss.addClass('on');
		});
		showcalss.children('.closePop').on('click',function(){
			popBg.removeClass('on');
			showcalss.removeClass('on');
		});
	},
	showPop:function(showcalss){
		var showcalss = $('.'+showcalss);
		var popBg = $('.popBg');

		popBg.addClass('on');
		showcalss.addClass('on');

		showcalss.children('.closePop').on('click',function(){
			popBg.removeClass('on');
			showcalss.removeClass('on');
		});
	},
	hidePop:function(){
		$('.popBg').removeClass('on');
		$('.pop').removeClass('on');
	},
	hideEvenPop:function(_class){
		$('.'+_class).on('click',function(){
			$('.popBg').removeClass('on');
			$(this).removeClass('on');
		});
		
	},
	showTvPop:function(btn,_class){
        $('.'+btn).on('click','li.no>a',function(){
            $('.' + _class).addClass('on');
            $('.popBg').addClass('on');
        });
        $('.closeBtn,.closePop').on('click',function(){
			$('.'+_class).removeClass('on');
			$('.popBg').removeClass('on');
		});
    },
    //时间判断
    timeset:function(beginTime,endTime,nowTime){

        var myDate1=new Date(2016,11,23,18);
        //var myDate1=new Date(2016,11,16,20);
        var myDate2=new Date(2016,11,23,21);

        var now = new Date();
        
        if( (now.getTime()>=myDate1.getTime()) && (now.getTime()<=myDate2.getTime()) ){
            //在2016/12/23/18-2016/12/23/21
            return true;
        };
        return false;
    },
	//获取主播数据
	getLiveData:function(){
		var self = this;
		$.ajax({
			url: self.HEAD_URL+'/christmas/index.php',
			type: 'GET',
			dataType: 'json',
			error:function(msg){
				console.log(msg);
			},
			success:function(data){
				insertData(data);
			}
		});
		/*插入数据*/
		function insertData(data){
			var isLook =  self.timeset();
			var len = data.length;
			var dom1,dom2,max = 6;
			var imgArrs = [],ii = 1;
			var row = parseInt(data.length/6)+parseInt((data.length%6)==0?0:1);
			for(var i = 0;i<row;i++){
				dom1 = '<li class="bk swiper-slide"><ul class="sublist">';
				/*if(i==row-1){
					max = (data.length%6 == 0)?6:(data.length%6);
				};*/
				for(var j = 0;j<max;j++){
					
					if(!!data[(i*6+j)]){
						var _url = data[(i*6+j)].url;
                        //未到时间
                        if(!isLook){_url = 'javascript:;'};
                        //第一个默认加载
                        if(i == 0){
                        	dom2 = '<li class="b' +(j+1) + (!isLook?' no':'') + '"><a href="'+ _url +'"><span><img src="'+ data[(i*6+j)].image +'" alt=""></span></a><p>'+  data[(i*6+j)].title +'</p></li>';
                        }else{
                        	imgArrs.push(data[(i*6+j)].image);
                        	dom2 = '<li class="b' +(j+1) + (!isLook?' no':'') + '"><a href="'+ _url +'"><span><img src="../images/bx6.png" alt=""></span></a><p>'+  data[(i*6+j)].title +'</p></li>';
                        };
					}else{
						dom2 = '<li class="b'+ (j+1) +' no"><a href="javascript:;"><img src="../images/bx6.png" alt=""></a></li>';
					};
					dom1 += dom2;
				};
				dom1 += '</ul></li>';
				$('.treeBox>ul').append(dom1);
			};

			//插入结束后调用swiper
			var mySwiper2 = new Swiper ('.swiper-container2', {
	            direction: 'horizontal',
	            
	            // 如果需要前进后退按钮
	            nextButton: '.sp-next',
	            prevButton: '.sp-prev'
	        });
	        //设置图片
	        var timer = setInterval(function(){
	        	console.log(row);
	        	if(ii>=4){
	        		clearInterval(timer);
	        		return false;
	        	};
	        	self.setImgUrl(imgArrs,ii);
	        	ii++;
	        },1000);
		}
	},
	//设置图片
	setImgUrl:function(data,row){
		console.log(data);
		var doms = $('.treeBox .bk');
		for(var i = (row-1)*6;i<row*6;i++){
			console.log(row);
			console.log(i);
			doms.eq(row).find('li').eq(i).find('img').attr('src',data[i]);
		};
		
	},
	//预加载图片
	loadImg:function(imgArr){
		var self = this;
		var imgArr = imgArr;
		var _img,
			len = imgArr.length,
			count = 0;
		for(var i =0;i<len;i++){
			_img = new Image();
			_img.src = self._imgPath + imgArr[i];
			_img.onload = function(){
				count++;
				if(count >= len){
					//callbackfn
					//console.log(count);
				};
			}
		}
	}
};
