var BottomLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.attr({
            anchorX:0,
            anchorY: 0,
            width:winSize.width,
            height:59
        });
        cc.MenuItemFont.setFontName("微软雅黑");
        cc.MenuItemFont.setFontSize(30);
        var item1 = new cc.MenuItemFont("活动首页",this.goHome, this);
        var item2 = new cc.MenuItemFont("游戏规则",this.gameInfo, this);
        var item3 = new cc.MenuItemFont("我的宝库",this.myGifts, this);
        var itemArray = [item1,item2,item3];
        var x = (1+2*i)/6
        for(var i=0;i<itemArray.length;i++)
        {
            itemArray[i].setPosition(winSize.width*(1+2*i)/6,30);
        }
        var menu = new cc.Menu(item1, item2, item3);
        menu.attr({
            anchorX:0,
            anchorY: 0,
            x:0,
            y:0
        });
        this.addChild(menu, 1);
        var sprite = new cc.Sprite(res.black_jpg);
        sprite.attr({
            anchorX:0,
            anchorY: 0,
            x:0,
            y:0
        });
        this.addChild(sprite, 0);
        return true;
    },
    goHome:function(){
        if(ZT.state==0)
        {
            return;
        }
        if(ZT.state==1)
        {
            cover.show($("#menu_cover"));
        }
        else
        {
            manager.ChangeScene('start');
        }
    },
    gameInfo:function(){
        // var scene = new StartScene();
        // cc.director.runScene(new cc.TransitionFade(1.2, scene));
        cover.show($("#game_intro"));
    },
    myGifts:function(){
        myPrizes();
        // return getRank();
    },
    getPrice:function(){
        // var cookie = getPhoneNum();
        // if(cookie)
        // {
        if(ZT.state==0)
        {
            $("#get_price .palyagin").html('开始游戏');
        }
        else if(ZT.state==2||ZT.state==1)
        {
            $("#get_price .palyagin").html('继续游戏');
        }
        else if(ZT.state==3)
        {
            $("#get_price .palyagin").html('再玩一次');
        }
        $(".user_phone").html(phonenum);
        cover.show($("#get_price"));
        // }
        // else
        // {
        //     setPhoneCallback = function(){
        //         $(".user_phone").html(getPhoneNum());
        //         cover.show($("#get_price"));
        //     };
        //     cover.show($("#phone_cover"));
        // }
    }
});
