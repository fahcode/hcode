

var controls = 1;
ifIE9 = (navigator.userAgent.indexOf("MSIE 6.0")>0) || (navigator.userAgent.indexOf("MSIE 7.0")>0) || (navigator.userAgent.indexOf("MSIE 8.0")>0);

window.onload = function(){
	//doleft()//设置canvas的left
	isLogin(9);//刷新获取积分
	doPlay();
	doPage();//翻页
	ReceivePacket();//刮刮卡兑换
}


//设置canvas的left
function doleft(){
	var canvas = document.getElementById('canvas');
	//计算位置
    var allwid = $(window).width();
    var allHei = $(window).height();
    var bodyWid = $(document).width();
    var bodyHei = $(document).height();
    var slTop = $(window).scrollTop();
    if(!ifIE9){
    	$('body').append('<div id="zz" style="position:absolute;z-index:800;opacity:0.7;background-color:#000;top:0;left:0;width:'+ bodyWid +'px;height:'+ bodyHei +'px;"></div>');
    }else{
    	$('body').append('<div id="zz"></div>');
    }

    var canvasWid = parseInt((canvas.parentNode).style.width);
    var canvasHei = parseInt((canvas.parentNode).style.height);
    (canvas.parentNode).style.left = (allwid - canvasWid)/2 + 'px';//设置left
    if((navigator.userAgent.indexOf("MSIE 6.0")>0)){
    	(canvas.parentNode).style.display = 'absolute';
    	(canvas.parentNode).style.top = '850px';
    }else{
    	if(parseInt(allHei) < parseInt(canvasHei)){
	    	(canvas.parentNode).style.top = 50 + slTop + 'px';
	    }else{
	    	(canvas.parentNode).style.top = (allHei - canvasHei)/2 + slTop + 'px';//设置top
	    }
    }
    $('body').css('overflowY','hidden');
}

//滚动位置
function sTop(vlu){
    var ss = document.body.scrollTop || document.documentElement.scrollTop;
    var timer = setInterval(function(){
        document.documentElement.scrollTop = document.body.scrollTop = ss;
        if(parseInt(ss)<parseInt(vlu)){
          ss=ss+40;
          if(parseInt(ss)>parseInt(vlu)){clearTimeout(timer);return;}
        }else{
          ss=ss-40;
          if(parseInt(ss)<parseInt(vlu)){
            clearInterval(timer);return;
          }
        }
    },30);
}

//翻页
function doPage(){
	$('.pageBtn .up').click(function(){$('.ggkResult-m .box').css('marginLeft','0px');});
	$('.pageBtn .down').click(function(){$('.ggkResult-m .box').css('marginLeft','-885px');});
}


//判断登陆
function doPlay(){
	//只做登陆
	$('#integral').click(function(){
		isLogin(0);
	});
	//控制多次点击
	//点击靶子，登陆且执行
	$('#ggk .ggkBtn').click(function(){
		var rangeId = $(this).parent().attr('rangeid');
		////console.log(controls);
		if(controls == 1){controls = 0;isLogin(1,rangeId);}
	});
	//点击打靶5次，登陆且执行
	$('#ggk .doFive').click(function(){
		var rangeId = $(this).parent().attr('rangeid');
		////console.log(controls);
		if(controls == 1){controls = 0;isLogin(2,rangeId);}
	});
	//特殊刮刮卡
	$('.surprise .spBtnShow').live('click',function(){
		var isOk = $(this).parent().attr('isok');
		if(controls == 1){controls = 0;isLogin('surprise',isOk);}
	});
	//成长计划，登陆且执行
	$('.develop').click(function(){
		var dataType = $(this).attr('data-develop');
		isLogin(3,dataType);
	});
	//超值礼包兑换，登陆不执行
	$('.img4Link .option').click(function(){
		var _this = $(this);
		isLogin(4,_this);
	});
	//钻石兑换
	$('#exchange').click(function(){
		var pid = $(this).parent().attr('pid');
		isLogin(5,pid);
	});
}

//获取用户名和积分
function getInfo(){
	$.ajax({
        typ:'post',
		contentType: "application/develop; charset=utf-8",
		url: 'http://event.zygames.com/qqsm/201507/DiamondRange/GetAvatar',
		dataType: 'jsonp',
		jsonp: "jsonpcallback",
		success: function(result){
			if(result.Code == 0){
				var username = result.Data.AvatarName;
				var serArea = result.Data.GameAreaId;
				var RemainPoints = result.Data.RemainPoints;
				//超级刮刮卡进度
				var sptimes = result.Data.RemainDiamonds;//可特殊刮的次数
				var PowerPoints = (result.Data.PowerPoints)/2000;//2000=100%
				PowerPoints = (PowerPoints*100).toFixed(2) + '%';//转换百分比，保留两位小数


				if(serArea == 0){serArea = "电信一区";}else if(serArea == 1){serArea = "网通一区";}else if(serArea == 2){serArea = "电信二区";}

				$('#integral').hide();//隐藏按钮
				$('.jifen').show();//显示积分
				$('.DoImg').attr('src','http://cdn1.zygames.com/qqsm/events/201509/ggk/img/2_2.jpg');//修改图片
				$('.jifen .username').html(username);
				$('.jifen .serArea').html(serArea);
				$('.jifen .integral').html(RemainPoints);
				$('#plan #newPlan').html(PowerPoints);//写入百分比
				$('#plan #newTimes').html(sptimes);//写入次数
				$('#plan #newBar').animate({
					'width': PowerPoints
				},500);//写入次数
				//判断特殊刮卡
				if(sptimes >= 1){
					$('.surprise').attr('isok','spok');
					$('.surprise .spBtn').addClass('spBtnShow');//写入可点击的class
				}

			}else{
				alert(result.Message);
				return false;
			}
		}
	});
}

//获取是否还有未领取的奖励
function getggk(){
	$.ajax({
        type: "post",
		contentType: "application/json; charset=utf-8",
		url: 'http://event.zygames.com/qqsm/201507/DiamondRange/GetUserPacket',
		dataType: 'jsonp',
		jsonp: "jsonpcallback",
        success:function(result){
        	if(result.Code == 0){
        		var residueList = result.Datas;

        		if(residueList.length>0){
        			controls = 0;//在还有剩余时间，禁止刮刮卡点击
        			dispose(residueList,false);
        		}
        	}
        	
        }
    });
}

//0，9只登陆和获取信息
//1，单次打靶
//2，10次打靶
//3，成长计划购买
//4,只登陆后显示图片
//5，钻石兑换
//判断登陆
function isLogin(type,dataType){//登陆类型
	$.ajax({
        type: "post",
		contentType: "application/json; charset=utf-8",
		url: 'http://event.zygames.com/qqsm/201507/DiamondRange/IsLogin',
		dataType: 'jsonp',
		jsonp: "jsonpcallback",
        success:function(data){
        	if(data.Code  == 0){
        		if((type == 0) || (type == 9)){
        			getInfo();//获取用户名和积分
        			getggk();//获取剩余的礼包
        		}else if(type == 1){
        			doggk(1,dataType);
        		}else if(type == 2){
        			doggk(10,dataType);
        		}else if(type == 3){
        			develop(dataType);
        		}else if(type == 4){
        			popShow(dataType);//显示图层
        		}else if(type == 5){
        			exchange(dataType);
        		}else if(type == 'surprise'){
        			if(dataType == "spok"){
        				//领取特殊刮卡
        				doggk(dataType,dataType);
        			}
        		}
        	}/*else if((dataCode == 104) || (dataCode == 201) || (dataCode == 102) || (dataCode == 101)){
                 startPop_fmAvatar('http://event.zygames.com/qqsm/201507/DiamondRange/Login', '_top',1);
        	}*/else if(data.Code == 501){
        		controls = 1;
        		alert('活动结束!');
        		return false;
        	}else if(data.Code == 701){
        		controls = 1;
        		alert('维护期间，暂停开放!');
        		return false;
        	}else{
        		controls = 1;
        		if(type == 9){return false;}
        		//未登陆则调用登陆js
        		startPop_fmAvatar('http://event.zygames.com/qqsm/201507/DiamondRange/Login', '_top', 1);
        	}
        }
    });

}

//刮卡效果函数
function doggk(type,rangeId){
	if(type == 'spok'){
		surpriseggk();
	}else{
		if(rangeId){
			doleft();//在登陆的情况下，生成效果层
			if(!ifIE9){
				//数据解析后，模拟刮卡效果。刮完后显示结果
				var canvas = document.getElementById('canvas');
				canvas.parentNode.style.display = 'block';
			    var imgUlr = 'img/ggk' + rangeId + '.png';
				ggkCanvas(canvas,imgUlr,type,rangeId,30,null,false);
			}else{
				var canvas = document.getElementById('canvas');
				canvas.parentNode.style.display = 'block';
				$('.canvas').append('<img id="ieAnimation" src="img/am/Animation' + Math.floor(Math.random()*5+1) + '.gif"/>');
				setTimeout(function(){
					$('body').css('overflowY','visible');//还原垂直滚动
					$('#zz').remove();//删除遮罩层
					canvas.parentNode.style.display = 'none';
					$('#ieAnimation').remove();//删除动画
					doggkResult(type,rangeId);
				},1300)
			}
		}
	}
}

//获取刮卡结果
function doggkResult(type,rangeId){//1或10;rangeId代表当前点击的rangeId
	var ggkUrl;
	if(type == 1){ggkUrl = "http://event.zygames.com/qqsm/201507/DiamondRange/Lottery"}
		else if(type == 10){ggkUrl = "http://event.zygames.com/qqsm/201507/DiamondRange/LotteryX"}
	////console.log(controls);
	//获取打靶产生的奖励
	$.ajax({
        type:'post',
		//contentType: "application/json; charset=utf-8",
		url: ggkUrl,
		data: {"rangeId":parseInt(rangeId)},
		dataType: 'jsonp',
		jsonp: "jsonpcallback",
		error: function(XMLHttpRequest, textStatus, errorThrown){
			//console.log(XMLHttpRequest);
            controls = 1;
            alert("打靶失败");
        },
        success:function(data){
        	if(data.Code == 0){
        		var Packet = data.Data;//PacketList
        		getInfo();//修改积分值
        		//打靶礼包解析函数
        		dispose(Packet,rangeId);//礼包列表，第几个
        	}else{
        		controls = 1;
        		alert(data.Message);
        	}
        }
    });
}

//打靶礼包解析函数
function dispose(Packet,rangeId){
	var nameArr = [];
	if(Packet.length == 1){//单礼包
		var shootOrder = Packet[0].ShootOrder;
		var PacketId = Packet[0].PacketId;
		var PacketType = Packet[0].PacketType;
		var PacketName = Packet[0].PacketName;
		var NodeType = Packet[0].NodeType;
		var RangeId = Packet[0].RangeId;
		$('.ggkResult .ggkName').attr({//修改奖品的属性
			'packetid':PacketId,
			'packettype':PacketType,
			'nodetype':NodeType,
			'shootorder':shootOrder,
			'rangeid':RangeId
		});
		nameArr.push(PacketName);
		$('.ggkResult').show();
		$('.ggkResult .ggkName>span').html(PacketName);//显示奖品的名字
	}else if(Packet.length >1){//多礼包
		for (var i = 0; i < Packet.length; i++) {
			var shootOrder = Packet[i].ShootOrder;
			var PacketId = Packet[i].PacketId;
			var PacketName = Packet[i].PacketName;
			var PacketType = Packet[i].PacketType;
			var NodeType = Packet[i].NodeType;
			var RangeId = Packet[i].RangeId;
			////console.log("多次" + shootOrder);
			nameArr.push(PacketName);
			$('.ggkResult-m').show();
			var dom = "<li><div class='ggkName' rangeid='"+ RangeId +"' shootorder='" + shootOrder +"' packetid='" + PacketId +"' packettype='"+PacketType+"' nodetype='"+NodeType+"'><span >"+ PacketName +"(永久)</span></div><div class='btn-box'><a href='###' class='exchange btn' diamond='0' title='获取道具''>获取道具</a>&nbsp;<a href='###' class='exchange btn' diamond='1' title='转换积分'>转换积分</a></div></li>";
			$('.ggkResult-m .box').append(dom);
		};
	}
}


//刮刮卡礼包转换
function ReceivePacket(){
	$('#ggk .exchange').live('click',function(){
		var _this = $(this);
		var thisInfo = _this.parent().prevAll('.ggkName');
		
		var diamond = _this.attr('diamond');
		var packetId = thisInfo.attr('packetid');
		var shootorder = thisInfo.attr('shootorder');
		var packetType = thisInfo.attr('packettype');
		var nodeType = thisInfo.attr('nodetype');
		var RangeId = thisInfo.attr('rangeid');
		////console.log(packetId +'/'+packetType+'/'+nodeType +'/'+diamond);
		var types = ((_this.parent().parent()).attr('class') == 'ggkResult')?1:2;//判断是多礼包还是单礼包
		//成功后给当前增加class
		doExchange(shootorder,packetId,diamond,packetType,nodeType,RangeId,types);
		thisInfo.addClass('selected');
		_this.parent().parent().hide();
	});
}

//刮刮卡道具或钻石兑换
function doExchange(shootorder,packetId,diamond,packetType,nodeType,RangeId,types){
	$.ajax({
        typ:'post',
		contentType: "application/json; charset=utf-8",
		url: "http://event.zygames.com/qqsm/201507/DiamondRange/ReceiveLotteryPacket",
		data: {"shootOrder":shootorder,"packetId":packetId,"diamond":diamond,"packetType":packetType,"nodeType":nodeType,"RangeId":RangeId},
		dataType: 'jsonp',
		jsonp: "jsonpcallback",
		error: function(){ 
            controls = 1;
            alert("打靶失败");
        },
        success:function(data){
        	if(data.Code == 0){
        		if(diamond == 1){
        			alert('您转换了：' + data.Message);
        		}else{
        			alert("领取成功！");
        		}
        		getInfo();//修改积分值
        		//1单礼包则隐藏;多礼包，检查class个数，后隐藏
        		if(types == 1){controls = 1;$('.ggkResult').hide();}else if(types == 2){
        			if(($('.ggkResult-m .ggkName').not('.selected')).length == 0){
        				controls = 1;
        				$('.ggkResult-m').hide();
        			}
        		}
        	}else{
        		controls = 1;
        		alert(data.Message);
        		return false;
        	}
        }
    });
}
//获取超级挂挂卡
function surpriseggk(){
	$.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: 'http://event.zygames.com/qqsm/201507/DiamondRange/GetMysteryPacket',
        dataType: 'jsonp',
        jsonp: "jsonpcallback"
	}).done(function(result){
		if(result.Code == 0){
			var PacketName = result.Data.PacketName;
			if(ifIE9){
				doleft();
				var canvas = document.getElementById('canvas');
				canvas.parentNode.style.display = 'block';
				$('.canvas').append('<img id="ieAnimation" src="img/am/Animation' + Math.floor(Math.random()*5+1) + '.gif"/>');
				setTimeout(function(){
					$('body').css('overflowY','visible');//还原垂直滚动
					$('#zz').remove();//删除遮罩层
					canvas.parentNode.style.display = 'none';
					$('#ieAnimation').remove();//删除动画
					getspggk();
				},1300)
			}else{
				$('.checkLogin').hide();//隐藏遮盖层
				alert('请在按钮上方刮卡！');
				//调用挂挂卡动画
	    		var imgUlr = 'img/sp/spGift' + nameMateUrl(PacketName) + '.png';
	    		var canvas = document.getElementById('spCanvas');
	    		ggkCanvas(canvas,imgUlr,0,0,10,PacketName,false);
			}
    	}else{
        	controls = 1;
			alert(result.Message);
		}
	}).fail(function(){ alert("出错啦！"); });
}

//领取特殊刮卡
function getspggk(){
	$('.checkLogin').show();//重置遮盖
	$.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: 'http://event.zygames.com/qqsm/201507/DiamondRange/ReceiveMysteryPacket',
        dataType: 'jsonp',
        jsonp: "jsonpcallback"
	}).done(function(result){
		if(result.Code == 0){
			var PacketName = result.Data.PacketName;
    		getInfo();//修改积分值
    		alert('你获得了：' + PacketName + "!");
            controls = 1;
    	}else{
        	controls = 1;
			alert(result.Message);
		}
	}).fail(function(){ alert("出错啦！"); });
}

function nameMateUrl(PacketName){
	//console.log(PacketName);
	var nameArr = ['猎心者','暴雨梨花','玩具机枪','甜筒手雷','黑板擦','月饼手雷','国威QBU88','国威QBZ95','国威QBS09','火鸡手雷','啪啪雪球枪','无尽Vector','无尽P90','无尽MP5F','无尽85式冲锋枪','鹰眼F2000','鹰眼HK416','鹰眼QBS09','退魔爆裂弩','退魔多重弩','破军磁暴弩','破军HK21'];
	for(var i = 0;i<nameArr.length;i++){
		if( (PacketName.indexOf(nameArr[i])) != -1 ){
			return i+1;
		}
	}
}

//成长计划
function develop(types){//代表第几个
	$.ajax({
        type: "post",
		contentType: "application/json; charset=utf-8",
		url: "http://event.zygames.com/qqsm/201507/DiamondRange/ExchangeGrowthPlan",
		data: {"planId":types},
		dataType: 'jsonp',
		jsonp: "jsonpcallback",
        success:function(data){
        	if(data.Code == 0){
        		getInfo();//获取最新积分
        		alert('购买成功！');
        	}else{
        		alert(data.Message);
        	}
        }
    });
}

//钻石兑换
function exchange(pid){
	$.ajax({
        type: "post",
		contentType: "application/json; charset=utf-8",
		url: "http://event.zygames.com/qqsm/201507/DiamondRange/ExchangebyPoints",
		data: {"packetId":pid},
		dataType: 'jsonp',
		jsonp: "jsonpcallback",
        success:function(data){
        	if(data.Code == 0){
        		getInfo();//获取最新钻石
        		alert('兑换成功！');
        		$('#popbg_fmlogin,#popBox').hide();
        	}else{
        		alert(data.Message);
        		$('#popbg_fmlogin,#popBox').hide();
        	}
        }
    });
}