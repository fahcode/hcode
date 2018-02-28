// JavaScript Document
function is_weixn(){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i)=="micromessenger") {
		return true;
	} else {
		return false;
	}
}
var iswx = is_weixn();
 
var pNum = '',shared = false,myorder = 0,allorder = 'XXXXX';
var prizeList =  ['街篮钻石礼包','街篮黄金礼包','京东卡5元面值','iPhone7','键鼠套装','街篮精美周边T恤','街篮白银礼包'];
//var shareStr = '厉害了！已有'+allorder+'位小伙伴预约《街篮》';
var flag = 0;
var wx;
var shareInfo = {
	title: '重返《街篮》，预约3V3篮球真竞技手游，100%赢大奖。',
	desc: '还原经典，火爆操作，3V3篮球真竞技手游《街篮》预约100%中奖。',
	image: 'http://act.jl.ztgame.com/jdlotto/images/share.png',
	link: ''
}

function ajax(action,data,callback){
	return $.ajax({
		url:'./action.php?a='+action+'&rand='+Math.random(),
		type:'GET',
		data:data,
		dataType:"json",
		success: function(res){
			if(res.ret == 0){
				alert(res.msg);
				
				return false;
			}else if(res.ret == 1){
				callback(res);
			}
		}
	})	
}

function ajax2(action,data,callback){
	return $.ajax({
		url:'./action.php?a='+action+'&rand='+Math.random(),
		type:'GET',
		data:data,
		dataType:"json",
		success: function(res){
			callback(res);
			
		}
	})	
}

var count = 59,t;
function countdown(){
	if(count>0){
		count--;
		$('.countdown .cnum').html(count)
	}else{
		clearInterval(t);
		count = 59;
		$('.getcode').show();
		$('.countdown').hide();	
		$('.countdown .cnum').html(count)
	}
}

function cjClick(){
	if(pNum == '' || pNum == 'undefined'){
		$('.overlay,.pop_info').show();	
		$('.pop_info .titrow').find('i').html(allorder);
	}else{
		if(shared == false || shared == 'undefined'){
			alert('请分享朋友圈以获得第二次抽奖机会');
			$('.overlay,.pop_container').hide();
			$('.pop_share').show();		
		}else{
			//直接进行第二次抽奖，弹出抽奖结果弹窗
			ajax('lottoTwice',{phone:pNum,isshare:shared},function(res){
				if(res.type == 'virtual'){
					var tiptxt = '您的礼包码将以短信形式发送到您的手机';
				}else if(res.type == 'entity'){
					var tiptxt = '（奖品由工作人员联系发放）';	
				}
				$('.pop_gift .titrow').find('i').html(prizeList[res.prize]);
				$('.pop_gift .gift').html('<i class="g0'+res.prize+'"></i>');
				$('.pop_gift,.overlay').show();
			})
		}
	}	
}

//分享
function setWeixin(success,cancel) {
	//console.log(wx);
	if(typeof(success)!='function')
	{
		success = function(){
			shared = true;
			$('.overlay,.pop_container,.pop_share').hide();
			_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "分享成功", "用户成功分享朋友圈"]);
		
		}
	}
	if(typeof(cancel)!='function')
	{
		cancel = function(){
			_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "分享取消", "用户取消分享朋友圈"]);
		}
	}
	//朋友圈
	if (typeof(wx) == 'undefined') {
		return;
	}
	wx.onMenuShareTimeline({
		title: shareInfo.title, // 分享标题
		link: shareInfo.link, // 分享链接
		imgUrl: shareInfo.image, // 分享图标
		success:success,
		cancel: cancel
	});
	//朋友
	wx.onMenuShareAppMessage({
		title: shareInfo.title, // 分享标题
		desc: shareInfo.desc, // 分享链接
		link: shareInfo.link, // 分享链接
		imgUrl: shareInfo.image, // 分享图标
		type: 'link', // 分享类型,music、video或link，不填默认为link
		dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		success: success,
		cancel: cancel
	});
}

requirejs(["weixin/main"], function(weixin) {
	var appid = 'wx0fcf7f47419c8171';
	wx = new weixin(appid, function() {
		setWeixin();
	});
}); 


$(function(){
	ajax('getDataCount','',function(res){
		allorder = 	res.count;
		$('.pop_info .titrow').find('i').html(allorder);
		shareInfo.title = '厉害了！已有'+allorder+'位小伙伴预约《街篮》';
		setWeixin();
	})
	
	if(iswx==true){
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "微信打开", "用户使用微信打开了页面"]);
	}

	//点击预约抽奖
	$('.cj_btn').on('singleTap',function(){
		cjClick();
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "预约抽奖", "用户点击了预约抽奖(黄色按钮)"]);
	});
	
	//点击获取验证码
	$('.getcode').on('singleTap',function(){
		var userName = $('.name').val(),userPhone = $('.phone').val();
		if(userName == ''){
			alert('请输入姓名');
		}else if(userPhone.length!=11){
			alert('请输入正确的手机号码');	
		}else{
			$('.getcode').hide();
			$('.countdown').show();
			t = setInterval(countdown,1000);
			ajax2('getPrizeCount',{phone:userPhone},function(res){
				clearInterval(t);
				count = 59;
				$('.getcode').show();
				$('.countdown').hide();	
				$('.countdown .cnum').html(count);
				if(res.ret == 0){
					alert(res.msg);
					return false;
				}else if(res.ret == 1){
					if(res.prizeCount == 0){
						ajax('sendSMSCode',{phone:userPhone},function(res){})
						$('.getcode').hide();
						$('.countdown').show();
						t = setInterval(countdown,1000);
					}else if(res.prizeCount == 1){
						if(shared == false || shared == 'undefined'){
							alert('请分享朋友圈以获得第二次抽奖机会');
							$('.overlay,.pop_container').hide();
							$('.pop_share').show();	
							pNum = userPhone;
						}else{
							alert('您已成功获得第二次抽奖机会，请点击预约抽奖');
							pNum = userPhone;
							$('.pop_info,.overlay').hide();
						}
						
					}else if(res.prizeCount >= 2){
						alert('您的手机号码已参加过本活动，不能重复参与。');	
					}
				}
			})	
		}
		
	});
	//点击解锁奖励
	$('body').on('singleTap','.unlock_btn',function(){
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "点击按钮", "用户点击了领取奖励按钮"]);	
		//alert(0)
		var userName = $('.name').val(),userPhone = $('.phone').val(),yzm = $('.yzm').val(),tiptxt = '';
		
		if(userName == ''){
			alert('请输入姓名');
		}else if(userPhone.length!=11){
			alert('请输入正确的手机号码');	
		}else if(yzm == ''){
			alert('请输入您收到的短信验证码');
		}else if(flag == 0){
			flag = 1;
			$('.unlock_btn').addClass('clicked').removeClass('unlock_btn');
			ajax2('saveMessage',{name:userName,phone:userPhone,smscode:yzm},function(res){
				flag = 0;
				if(res.ret == 0){
					alert(res.msg);
					$('.getgift').removeClass('clicked').addClass('unlock_btn');
					return false;
				}else if(res.ret == 1){
					
					if(res.type == 'virtual'){
						tiptxt = '您的礼包码将以短信形式发送到您的手机';
					}else if(res.type == 'entity'){
						tiptxt = '（奖品由工作人员联系发放）';	
					}
					$('.pop_gift .tip').html(tiptxt);
					$('.pop_gift .titrow').find('i').html(prizeList[res.prize]);
					$('.pop_gift .subtit').find('i').html(res.count);
					$('.pop_gift .gift').html('<i class="g0'+res.prize+'"></i>')
					$('.pop_info').hide();
					$('.pop_gift').show();	
					$('.getgift').removeClass('clicked').addClass('unlock_btn');
					pNum = userPhone;
					myorder = res.count;
					if(myorder <= 0){
						shareInfo.title = '厉害了！已有'+allorder+'位小伙伴预约《街篮》';
					}else{
						shareInfo.title = '我是第'+myorder+'位预约《街篮》球员，11月2日等你来战';	
					}
					setWeixin();
				}
			});
		}
	});

	//关闭按钮
	$('.intro01_close').on('singleTap',function(){
		$('.overlay,.pop_container').hide();	
		$('.commondots .cdot').hide().addClass('start');
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "关闭弹窗", "用户关闭了巨星之路弹窗"]);	
	});
	$('.intro02_close').on('singleTap',function(){
		$('.overlay,.pop_container').hide();	
		$('.commondots .cdot').hide().addClass('start');
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "关闭弹窗", "用户关闭了花式操作弹窗"]);	
	});
	$('.intro03_close').on('singleTap',function(){
		$('.overlay,.pop_container').hide();	
		$('.commondots .cdot').hide().addClass('start');
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "关闭弹窗", "用户关闭了全天竞技弹窗"]);	
	});
	$('.intro04_close').on('singleTap',function(){
		$('.overlay,.pop_container').hide();	
		$('.commondots .cdot').hide().addClass('start');
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "关闭弹窗", "用户关闭了经典传承弹窗"]);	
	});
	
	$('.share_close').on('singleTap',function(){
		$(this).parent().hide();
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "关闭弹窗", "用户关闭了分享提示箭头窗口"]);	
	});
	
	$('.cj_close').on('singleTap',function(){
		$(this).parent().hide();
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "关闭弹窗", "用户关闭了抽奖大弹窗"]);	
	});
	
	$('.info_close').on('singleTap',function(){
		$('.overlay,.pop_container').hide();	
		$('.commondots .cdot').hide().addClass('start');
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "关闭弹窗", "用户关闭了填写信息弹窗"]);	
	});
	$('.gift_close').on('singleTap',function(){
		$('.overlay,.pop_container').hide();	
		$('.commondots .cdot').hide().addClass('start');
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "关闭弹窗", "用户关闭了奖品弹窗"]);	
	});
	
	
	//分享视频按钮
	$('.share_btn').on('singleTap',function(){
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "分享视频", "用户点击了分享视频按钮"]);
		$('.pop_share').show();		
	});
	
	$('.invite').on('singleTap',function(){
		_czc.push(["_trackEvent", "重返《街篮》，预约抽奖h5", "分享视频", "用户点击了邀好友抽奖按钮"]);
		$('.pop_share').show();		
	});
	
	
})

