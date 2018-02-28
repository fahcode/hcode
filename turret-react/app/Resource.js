'use strict'

const Resource = {
    htmlImgs:{
        slogan: "./slogan.png",
        pan: "./pan.png",
        panZhen: "./rollPole.png",
        gfImg: "./gfImg.png",
        shareTips: "./shareTips.png",
        shareTips1: "./shareTips1.png",
        shareImg: "http://xx2.ztgame.com/act/zp/images/share.jpg"
    },
    AjaxUrls: {
        userinfo: "/act/zp/api.php?a=userinfo",
        //微信授权 
        wxauth: "/act/zp/api.php?a=wxauth",
        //wxauth: "/act/zp/api.php?c=sys&a=wxauth&id=6",
        // /登录内嵌 
        login: "/act/zp/api.php?a=login",
        //分享回调
        shareback: "/act/zp/api.php?a=shareback",
        //启动抽奖
        lotto: "/act/zp/api.php?a=lotto",
        //领取奖励  
        getprize: "/act/zp/api.php?a=getprize",
        //奖励列表   
        prizelog: "/act/zp/api.php?a=prizelog",
        //服务器列表
        zonelist: "/act/zp/api.php?a=zonelist",
        //角色列表     
        charlist: "/act/zp/api.php?a=charlist",
        //角色绑定    
        charbind: "/act/zp/api.php?a=charbind",
        //测试环境地址
        test_regUrl: "http://reg.ztgame.com/fast?source=xx2_site&regtype=phone&alerttype=1&returntype=1&returnurl=f1e80feafceca9e6e32898356009a09b41aa0bb3925990a9958a76b58a3881e68950e5cdd187e5b5aeede29edd940455ebaf53088d385fd1&cssurl=f1e80feafceca9e6e32898356009a09b41aa0bb3925990a9958a76b58a3881e62b4a41b8340b0304b366870102d96583&sign=3fb03bc74d8abe2a1c4fb35fd744b746"
    }
}

Resource.imgReq = require.context("../images", true, /^\.\/.*\.png||.jpg||.mp4$/);


export default Resource;
