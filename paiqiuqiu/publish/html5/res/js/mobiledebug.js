if(typeof(mdebug)=='undefined')
{
    mdebug = false;
}
//移动端debug 插件
var mobileDebug = function(){
    var isMobile = function(){
         var userAgentInfo = navigator.userAgent;  
           var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
           var flag = false;  
           for (var v = 0; v < Agents.length; v++) {  
               if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }  
           }  
           return flag;
    };
    this.init = function(){
        this.mobile = isMobile();
        // if(!this.mobile)
        // {
        //     return;
        // }
        var div = document.createElement('div');
        this._debugDiv = div;
        var style = {width:"50%",height:"auto",position:'absolute',overflow:'auto',left:0,bottom:0,color:"#fff",fontSize:"16px"};
        for(attr in style)
        {
            div.style[attr] = style[attr];
        }
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(div);
        this.reWriteConsole();
        window.onError = function(sMessage,sUrl,sLine){
            this.priteDebug("--------------error-------------");
            this.priteDebug(sMessage);
            this.priteDebug(sUrl);
            this.priteDebug(sMessage);
            this.priteDebug(sLine);
            this.priteDebug("--------------error-------------");
        }
    };
    this.reWriteConsole = function(){
        var self = this;
        window.console.log = function(data){
            self.priteDebug(data);
        };
    };
    this.priteDebug = function(text,preString){
        if(typeof(preString)=='undefined')
        {
            preString = "";
        }
        if(typeof(text)!="object")
        {
            this._debugDiv.innerHTML+="<br/>"+preString+text;
        }
        else
        {
            this.priteDebug("{");
            for(var i in text)
            {
                this.priteDebug(i+":",preString);
                this.priteDebug(text[i],preString+"&nbsp;&nbsp;&nbsp;&nbsp;");
            }
            this.priteDebug("}",preString);
        }
    };
    this.init();
}
var debugmobileinit = function(){
    if(mdebug)
    {
        var debug = new mobileDebug();
    }
}
document.addEventListener("DOMContentLoaded", debugmobileinit, false);
