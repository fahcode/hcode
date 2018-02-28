var bigScreen = screen.width>=1920;

var coverCallback = null;
//弹窗
var Cover = function(coverClass){
	var self = this;
	var coverEle = null;
	this.scroll=[];
	this.curCover=[];
	var curZ = 3000;
	if(typeof(coverClass)=="string")
	{
		coverEle = $("."+coverClass);
	}
	else if(typeof(coverClass)=='object')
	{
		coverEle =coverClass;
	}
	else
	{
		coverEle = $(".cover")
	}
	this.init = function(){
		self.setCoverInit();
		self.bind();
	};
	this.setCoverInit = function(){
		coverEle.each(function(){
			$(this).css({display:'none',zIndex:3001,left:'50%',marginLeft:(-$(this).width()/2),top:"50%",marginTop:(-$(this).height()/2)+"px"});
		});
		coverEle.css({position:'fixed'});
	};
	this.setCoverPosition = function(obj){
		var coverHeight;
		var index;
		obj.each(function(){
			coverHeight = $(this).find(".scroller").height()+140;
			index = $(this).index();
			if(coverHeight>$(window).height())
			{
				$(this).find(".content_inner").height($(window).height()-140);
			}
			else
			{
				$(this).find(".content_inner").height('auto');
			}
			$(this).css({marginTop:(-$(this).height()/2)+"px",marginLeft:-$(this).width()/2});
			if(self.scroll[index])
			{
				self.scroll[index].refresh();
			}
			else
			{
				self.scroll[index] = new IScroll($(this).find(".content_inner")[0],{scrollbars: true,
					mouseWheel: true,
					interactiveScrollbars: true,
					shrinkScrollbars: 'scale',
					fadeScrollbars: false,
					click:true
				});
			}
		});
	};
	this.bind = function(){
	    $(".close,.confirm").unbind('click').bind('click',function(){
			self.hide();
		});
		$("#overlay").unbind('click').bind('click',function(){
			// if(ZT.state==3)
			// {
			// 	return;
			// }
			
			//self.hide();
		});
		$(window).resize(function(){
			self.setCoverPosition(coverEle);
		});
	};
	this.unbindClick = function(){
		$(".close,.confirm").unbind('click');
		// $("#overlay").unbind('click');
	};
	this.bindClick = function(){
		$(".close,.confirm").unbind('click').bind('click',function(){
			self.hide();
		});
		// $("#overlay").unbind('click').bind('click',function(){
		// 	self.hide();
		// });
	};
	this.hide = function(needresume){
		if(self.curCover.length<=0)
		{
			return;
		}
		var lastCover = self.curCover[self.curCover.length-1];

		var callback = function(){
			lastCover.hide();
		};
		
		if(self.curCover.length<=1)
		{
			if(typeof(needresume)=='undefined')
			{
				needresume = true;
			}
			if(needresume)
			{
				resumeGame();
			}
			$("#overlay").animate({opacity:0},200,'ease-in-out',function(){
				$("#overlay").hide();
			});
		}
		else
		{
			var nextCover = self.curCover[self.curCover.length-2];
			$("#overlay").css({zIndex:parseInt(nextCover.css('z-index'))-1});
		}
		self.curCover.pop();
	    lastCover.animate({opacity:0},200,'ease-in-out',callback);
	};
	this.hideAll = function(needresume){
		if(typeof(needresume)=='undefined')
		{
			needresume = true;
		}
		var length = self.curCover.length;
		for(var i=0;i<length;i++)
		{
			resume = false;
			if(i==length-1)
			{
				resume = needresume;
			}
			self.hide(resume);
		}
	};
	this.show = function(obj){
		for(var i in self.curCover)
		{
			if(self.curCover[i].selector==obj.selector)
			{
				return;
			}
		}
		curZ+=2;
		this.unbindClick();
		var callback = function(){
			self.curCover.push(obj);
		};
		setTimeout(function(){
			self.bindClick();
		},500);
		obj.css({opacity:0,display:'block',zIndex:curZ});
		if(self.curCover.length==0)
		{
			$("#overlay").css({opacity:0,display:'block',zIndex:curZ-1});
			$("#overlay").animate({opacity:0.6},300,'ease-in-out',function(){
				$("#overlay").show();
			});
		}
		else
		{
			$("#overlay").css({zIndex:curZ-1});
		}
		this.setCoverPosition(obj);
		obj.animate({opacity:1},300,'ease-in-out',callback);
		pauseGame();
	};
	this.init();
}
var cover;

//弹窗
function setWidth()
{
    if(bigScreen||cc.sys.DESKTOP_BROWSER)
    {
    	$(".cover").css({maxWidth:'400px'});
        return;
    }
    if($(window).height()<=$(window).width()*1.2)
    {
        $("#Cocos2dGameContainer").addClass('fixwidth');
    }
    else
    {
        $("#Cocos2dGameContainer").removeClass('fixwidth');
    }
}

$(function(){
	setWidth();
	$(window).resize(function(){
		setWidth();
	});
	cover = new Cover();
	$(".save_phone_btn").click(function(){
		var phoneValue = $.trim($("#phone_input").val());
		var regPartton=/1[3-8]+\d{9}/;
		if(!phoneValue||phoneValue==null)
		{
			alert("手机号码不能为空");
			return;
		}
		else if(!regPartton.test(phoneValue))
		{
			alert("请输入正确的手机号");
			return;
		}
		cover.hide($("#phone_cover"));
		setPhoneNum(phoneValue);
		// if(setPhoneCallback)
		// {
		// 	setPhoneCallback();
		// 	setPhoneCallback = null;
		// }
	});
	$(".go_home").click(function(){
		manager.ChangeScene('start');
		ZT.state = 0;
		cover.hide();
	});
	$(".sharebtn").click(function(){
		showShareTip();
	});
    $(".getitembtn").click(function(){
    	getPrize();
    });
    $(".okbtn").click(function(){
        $('.close').click();
    });

	$(".share_tip").click(function(){
		if(!canclick)
		{
			return;
		}
		$(".share_tip").hide();
		if(cover.curCover.length==0)
		{
			resumeGame();
		}
	});

	$(".palyagin").unbind('click').bind('click',function(){
		wantPlayGame();
    });

});

function setPhoneNum(phone)
{
    $.ajax({
        url: "./ajax/action.php",
        type: 'post',
        data:{"op":"updateAddress","phone":phone},
        success: function(res){
            if(res.ret == '0') {
                phonenum = phone;
                $('.phonenumber').text(phonenum);
                alert("修改成功！");
            } else {
                alert(res.msg);
            }
        },
        dataType: 'json'
    });
}
function getPhoneNum()
{

}
//写cookies
function setCookie(name,value) 
{
    var Days = 30; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 
var canclick = true;
//读取cookies 
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]); 
    else 
        return null; 
} 

//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
}

function playGame()
{
	if(ZT.state==0)
	{
		cover.hideAll(false);
		manager.ChangeScene('game');
	}
	else if(ZT.state==3)
	{
		cover.hideAll(false);
		if(!!LayerCaChe['game'])
		{
			LayerCaChe['game'].start();
		}
		else
		{
			manager.ChangeScene('game');
		}
	}
	else if(ZT.state==2)
	{
		cover.hideAll();
	}
}

function pauseGame()
{
	if(ZT.state==1&&!!LayerCaChe['game'])
	{
		LayerCaChe['game'].pause();
	}
}

function resumeGame()
{
	if(LayerCaChe['game'])
	{
		if(ZT.state==2)
		{
			LayerCaChe['game'].resumegame();
		}
		else if(ZT.state==3)
		{
			manager.ChangeScene('start');
			ZT.state=0;
		}
	}
}

function showShareTip()
{
	canclick = false;
	pauseGame();
	cover.hide(false);
	$(".share_tip").show();
	setTimeout(function(){
		canclick = true;
	},2000);
}

function wantPlayGame()
{
	playGame();
}

function randomNum(start,end)
{
	return Math.floor(Math.random()*(end-start))+start;
}

function removeFromArrayByIndex(array,index)
{

    if (index > -1) {
    	delete array[i];
        array.splice(index, 1);
    }
}

function removeFromArray(array,val)
{
    var index = indexOfArray(array,val);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function indexOfArray(array,val)
{
    for (var i = 0; i < array.length; i++) {
        if (array[i] == val) return i;
    }
    return -1;
}