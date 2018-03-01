'use strict'

import Resource from "../config/Resource";

const Tool = {
    init: function() {
        var self = this;
        
    },
    setWinHei: function() {
        var self = this;
        var wrap = document.getElementById('setWinHei');
        //设置高度
        var win_w = parseInt(document.documentElement.clientWidth);
        var win_h = parseInt(document.documentElement.clientHeight);
        if(win_w>=640){
            wrap.style.height = '1035px';
        }else{
            wrap.style.height = win_h+'px';
        };
    },
    getRds: function(lm, sz){
        var self = this;
        var arrs = new Array();
        for(var i = 0;i < lm; i++){
            arrs.push(i);
        };

        var rsArrs = [];
        var rd;
        for(var j =0;j<sz;j++){
            rd = Math.floor( Math.random()*(lm-j) );
            rsArrs[j] = arrs[rd];
            //删除当前
            arrs.splice(rd, 1);
        }

        return rsArrs;
    },
    getRdArrs: function(ar1, ar2, n1, n2){
        var self = this;
        var allArr = [];
        var len1 = ar1.length,
            len2 = ar2.length;

        var qsa1 = self.getRds(len1, n1);
        let qsa2 = Tool.getRds(7, 3);
        for(var i = 0;i<n1;i++){
            allArr.push(ar1[ qsa1[i] ]);
        };
        for(var j = 0;j<n2;j++){
            allArr.push(ar2[ qsa2[j] ]);
        };
        return allArr;
    },
    ajaxget: function(url, type, dataType, data, callback, failcallback, errcallback) {
        var self = this;
        //显示loading
        //myApp.showIndicator();
        $.ajax({
            url: url,
            type: type,
            dataType: dataType,
            data: data,
            error: function(msg) {
                //console.log(msg);
                if (!!errcallback) {
                    errcallback.call(self);
                };
            },
            success: function(result) {
                if (result.status == 1) {
                    callback.call(self, result);
                } else {
                    //console.log(result.msg);
                    ////微信授权
                    if(result.status == -10){
                        window.location.href = Resource.AjaxUrls.wxauth;
                    }
                    if (!!failcallback) {
                        failcallback.call(self, result);
                    };
                };
            }
        });
    },
    //获取倒计时
    countDown: function(dm, tms, csss) {
        var self = this;
        var getBtn = $(dm);
        var _css = getBtn[0].style;
        getBtn.attr('disabled', 'disabled');
        getBtn.css(csss);
        getBtn.val(tms + 's后再次获取');
        getBtn.html(tms + 's后再次获取');
        
        var i = 0;
        var _timer = setInterval(function() {
            i++;
            getBtn.val(tms - i + 's后再次获取');
            if (i >= tms) {
                clearInterval(_timer);
                getBtn[0].style = _css;
                getBtn.removeAttr('disabled');
                getBtn.val('发送短信');
            }
        }, 1000)
    },
    /*weixin: function(shareDesc){
        var shareImg = "http://db.ztgame.com/act/guess/share.png";
        requirejs(["weixin/main"], function(weixin) {
            //与当前域名、公共号对应的appid，必须有效。
            var appid = 'wx0fcf7f47419c8171';
            //wx对像就基本等同于官方的weixin对像，包含所有官网api
            var wx = new weixin(appid,function(){
                //朋友圈
                wx.onMenuShareTimeline({
                    title: '【龙珠最强之战】手游预约邀请', // 分享标题
                    link: window.location.href, // 分享链接
                    imgUrl: shareImg, // 分享图标
                    success: function () {
                        //console.log('分享给朋友圈')
                    },
                    cancel: function () {

                    }
                });
                //朋友
                wx.onMenuShareAppMessage({
                    title: '【龙珠最强之战】手游预约邀请', // 分享标题
                    //desc: '我是' + window.qsResult.res + "，你，有多少战斗力？", // 分享描述
                    desc: '我是' + shareDesc  + "，你，有多少战斗力？",
                    link: window.location.href, // 分享链接
                    imgUrl: shareImg, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        //console.log('分享给朋友')
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        });
    },*/
    //新闻列表页面和视频列表页 添加无限滚动
    createScrollLoad: function(self, box, parentbox, url, ops, callback) {
        var self = this;
        // 加载flag
        var _off = true;
        // 最多可加载的页数
        var over = false;
        //当前页数
        var pageIdx = 2;
        var boxdom = $(box);
        if (!!parentbox) {
            var parentbox = $(parentbox);
        } else {
            var parentbox = boxdom;
        };
        var ops = ops;
        //加载的序号
        var lastIndex = parentbox.children('ul').children().length;
        // 注册'infinite'事件处理函数
        var boxHeight = boxdom[0].clientHeight;
        var boxbodyHeight = boxdom[0].scrollHeight;
        var st = 0;
        var space = 20;
        var timer = null,
            timers = null;

        ///插入加载结构
        var ht = $('<div class="scroll-preloader" style="">加载中...</div>');
        parentbox.children('.scroll-preloader').remove();
        parentbox.append(ht);

        boxdom.off();
        boxdom.on('scroll', function() {
            boxbodyHeight = boxdom[0].scrollHeight;
            st = this.scrollTop;
            if ((boxHeight + st) >= (boxbodyHeight - space)) {
                if (_off) {
                    _off = false;
                    if (over) return false;
                    //console.log(page1);
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        ht.show();
                        doload();
                    }, 200);

                };
            }
        });

        function doload() {
            ops.page = pageIdx;
            //类型，第几页，当前是第几条请求，模版id
            self.ajaxget(url, 'GET', 'json', ops, function(data) {
                //内容已经请求完毕
                if (data.list.length < 1) {
                    //console.log('没了啊');
                    //隐藏加载
                    ht.html('没有更多了');
                    //ht.hide();
                    over = true;
                    boxdom.off();
                    return false;
                };
                doplay(data.list);
            });
            // 模拟1s的加载过程
            function doplay(data) {
                // 生成新条目的HTML
                var html = '';
                var btn = "";
                for (j = 0; j < data.length; j++) {
                    lastIndex++;
                    btn = data[j].reward_status==1? '':'<a href="javascript:;" class="btn getBtn" title="领取"></a>'
                    html += '<li><div class="txt">'+ data[j].item_name +'</div><div class="im"><img src="'+ data[j].item_pic +'" alt=""></div><div class="bb">'+ btn +'</div></li>';
                    
                };

                // 添加新条目
                parentbox.children('ul').append(html);
                pageIdx++;
                // 重置加载flag
                _off = true;
            };
        };
    }
};


export { Tool as default };