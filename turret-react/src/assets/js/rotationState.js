var horizonhtml = '<div id="horizon" class="horizon"><div class="horizon_box"><div class="horizon_pic"><img src="http://jl.ztgame.com/m/images/v3/pm.jpg"></div><span>为了更好的体验，请将手机/平板竖过来</span></div></div>';

var horizonstyle = '<style type="text/css">.horizon{width:100%;height:100%;background:#000;position:fixed;left:0;top:0;right:0;bottom:0;z-index:1001;display:none}.horizon_box{width:100%;height:3rem;position:absolute;top:50%;left:0;margin-top:-1.5rem}.horizon_pic{width:1.5rem;height:2.54rem;margin:0 auto;text-align:center}.horizon img{width:100%;height:100%;margin:0 auto;-webkit-animation:maskAni 1.5s ease infinite alternate;animation:maskAni 1.5s ease infinite alternate;position:static;display:block}.horizon span{font-size:.26rem;display:block;color:#a69d6e;text-align:center;padding-top:.1rem}@keyframes maskAni{0%{transform:rotate(90deg);-webkit-transform:rotate(90deg)}50%{transform:rotate(90deg);-webkit-transform:rotate(90deg)}100%{transform:rotate(0deg);-webkit-transform:rotate(0deg)}}@-webkit-keyframes maskAni{0%{transform:rotate(90deg);-webkit-transform:rotate(90deg)}50%{transform:rotate(90deg);-webkit-transform:rotate(90deg)}100%{transform:rotate(0deg);-webkit-transform:rotate(0deg)}}</style>';



//全局字体rem
(function (wsize,hsize){
    //获取初始的fontsize,16为比例标准
    var originalSize = parseInt((window.getComputedStyle(document.documentElement,null)).fontSize);
    function fn(){
        var win_w = parseInt(document.body.clientWidth);
	    var win_h = parseInt(window.innerHeight);
	    /* 对应页面最大设计尺寸大宽度设置size */
	    //win_w = (win_w>wsize)?wsize:win_w;
        //如果电脑上
        if(win_w>wsize){
            //高度小于设计的尺寸
            if(win_h<hsize){
                win_w = wsize*((win_h/hsize).toFixed(2));
            }else{
                win_w = wsize;
            };
        }else{
            //手机上
            win_w = win_w;
        };
	    var win_h = parseInt(document.body.clientHeight),
	        html = document.getElementsByTagName('html')[0],
	        zoom=(win_w / wsize) / (originalSize/16) * 100;
	        html.style.fontSize = zoom + 'px';
    };
    //设置size
    fn();
    //添加横竖样式
    document.write(horizonhtml);
    document.write(horizonstyle);
    //横竖屏检测
    function detectOtt() {
        if (window.orientation == 90 || window.orientation == -90) {
            document.getElementById('horizon').style.display = 'block';
        } else if (window.orientation == 0 || window.orientation == 180) {
            document.getElementById('horizon').style.display = 'none';
        }
    }
    window.onresize = function(){
         detectOtt();
    };
    
})(640,1035);



                
