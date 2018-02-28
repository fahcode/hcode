//弹窗
var wh;
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
	this.hide = function(obj,animation,callback){
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