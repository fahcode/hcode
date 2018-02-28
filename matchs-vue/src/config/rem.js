//全局字体rem
(function(wsize, hsize) {
    //获取初始的fontsize,16为比例标准
    var originalSize = parseInt((window.getComputedStyle(document.documentElement, null)).fontSize);
    (function fn() {
        var win_w = parseInt(document.documentElement.clientWidth);
        var win_h = parseInt(document.documentElement.clientHeight);
        /* 对应页面最大设计尺寸大宽度设置size */
        //win_w = (win_w>wsize)?wsize:win_w;
        var org = (win_w / wsize);
        ////横屏通过高度计算
        if(win_w>win_h) org = (win_w / hsize);
        //html = document.getElementsByTagName('html')[0]

        var html = document.documentElement,
            zoom = org.toFixed(2) / (originalSize / 16) * 100;
        html.style.fontSize = zoom + 'px';
    })();

})(750, 1334);