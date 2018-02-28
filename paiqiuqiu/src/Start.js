var winSize;
var canPlay = true;
var StartLayer = cc.LayerColor.extend({
    ctor:function () {
        this._super();
        var self = this;
        winSize = cc.winSize;
        //设置背景颜色
        this.init(cc.color(133,225,249),winSize.width,winSize.height);
        
        
        //添加方块小元素
        var screenCenter = cc.visibleRect.center;
        if(cc._loadingImage_img1){
            cc.loader.loadImg(cc._loadingImage_img1, {isCrossOrigin : false }, function(err, img){
                self._initStage(img,  cc.p(img.width/2, screenCenter.y));
            });
        }
        if(cc._loadingImage_img2){
            cc.loader.loadImg(cc._loadingImage_img2, {isCrossOrigin : false }, function(err, img){
                self._initStage(img, cc.p(screenCenter.x*2-img.width/2, screenCenter.y+242));
            });
        }
        if(cc._loadingImage_img3){
            cc.loader.loadImg(cc._loadingImage_img3, {isCrossOrigin : false }, function(err, img){
                self._initStage(img, cc.p(screenCenter.x*2-img.width/2, screenCenter.y-118));
            });
        }
        //添加方块小元素

        //添加背景
        this.bg_sprite = new cc.Sprite(res.bg1_jpg);
        this.bg_sprite.attr({
            x: 0,
            y: winSize.height,
            anchorX:0,
            anchorY: 1,
            opacity:0
        });

        this.addChild(this.bg_sprite, 0);
        this.bg_sprite.runAction(cc.fadeIn(0.3));

        cc.spriteFrameCache.addSpriteFrames("res/Plist1.plist");
        //添加开始按钮
        this.menu_item1 = new cc.MenuItemImage(
            "#start.png",
            "#start.png",
            function () {
                self.onNewGame();
            }, this);
        this.menu_item1.attr({
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });

        var menu = new cc.Menu(this.menu_item1);
        menu.attr({
            opacity:0,
            scale:0.2,
            anchorX: 0.5,
            anchorY: 0.5,
            width:this.menu_item1.width,
            height:this.menu_item1.height,
            x:screenCenter.x-this.menu_item1.width*0.5,
            y:screenCenter.y-200

        });
        
        this.addChild(menu, 2);
        
        
        
        
        //添加各种球球
        var qiuqiuMaxTop = (winSize.height*0.5-198);
        for(var i=1;i<=6;i++)
        {
            this['qiu'+i] = new cc.Sprite("#qiu"+i+".png");
        }
        this.qiu1.attr({
            x:winSize.width-100,
            y:225,
            zIndex:1,
            opacity:0
        });
        this.qiu2.attr({
            x:60,
            y:175,
            zIndex:1,
            opacity:0
        });
        this.qiu3.attr({
            x:winSize.width-60,
            y:44,
            zIndex:6,
            opacity:0
        });
        this.qiu4.attr({
            x:65,
            y:40,
            zIndex:6,
            opacity:0
        });
        this.qiu5.attr({
            x:winSize.width-69,
            y:165,
            zIndex:1,
            opacity:0
        });

        this.qiu6.attr({
            x:winSize.width*0.5,
            y:-193,
            zIndex:3
        });
        var seq4;
        var seq5;
        var seq3 = cc.sequence(cc.delayTime(0.1),cc.moveBy(2,cc.p(0,340)),cc.callFunc(function()
        {
            var callback4 = cc.callFunc(function(){
                setTimeout(function(){
                    var controlPoints = [ cc.p(winSize.width+150,0),
                    cc.p(winSize.width,0),cc.p(winSize.width,0)];
                    var bezierForward = cc.bezierBy(0.4,controlPoints);
                    seq5 = cc.sequence(cc.moveBy(0,cc.p(-winSize.width,0)),cc.fadeIn(0),bezierForward);
                    self.slogan.runAction(seq5);
                },300);
                setTimeout(function(){
                    var seq = cc.sequence(cc.scaleTo(0.25,1.2),cc.scaleTo(0.05,1));
                    menu.runAction(cc.fadeIn(0.3));
                    menu.runAction(seq);
                },800);
            });
            seq4 = cc.sequence(cc.moveBy(0,cc.p(-self.qiu1.width,-self.qiu1.height)),cc.fadeIn(0),cc.moveBy(0.3,cc.p(self.qiu1.width,self.qiu1.height)));
            self.qiu1.runAction(seq4);

            seq4 = cc.sequence(cc.delayTime(0.3),cc.moveBy(0,cc.p(self.qiu2.width,-self.qiu2.height)),cc.fadeIn(0),cc.moveBy(0.3,cc.p(-self.qiu2.width,self.qiu2.height)));
            self.qiu2.runAction(seq4);

            seq4 = cc.sequence(cc.delayTime(0.6),cc.moveBy(0,cc.p(0,-self.qiu3.height)),cc.fadeIn(0),cc.moveBy(0.3,cc.p(0,self.qiu3.height)));
            self.qiu3.runAction(seq4);

            seq4 = cc.sequence(cc.delayTime(0.9),cc.moveBy(0,cc.p(0,-self.qiu4.height)),cc.fadeIn(0),cc.moveBy(0.3,cc.p(0,self.qiu4.height)));
            self.qiu4.runAction(seq4);

            seq4 = cc.sequence(cc.delayTime(1.2),cc.moveBy(0,cc.p(-self.qiu5.width,-self.qiu5.height)),cc.fadeIn(0),cc.moveBy(0.3,cc.p(self.qiu5.width,self.qiu5.height)),callback4);
            self.qiu5.runAction(seq4);

            
        }));
        this.qiu6.runAction(seq3);
        for(var i=1;i<=6;i++)
        {
            this.addChild(this['qiu'+i]);
        }
        //添加slogan
        this.slogan = new cc.Sprite("#slogan.png");
        this.slogan.attr({
            x:winSize.width*0.5,
            y:winSize.height-214,
            anchorX: 0.5,
            anchorY: 0.5,
            opacity:0
        });
        this.addChild(this.slogan,1);
        
        return true;


    },
    _getImgSprite:function(img, screenCenter){
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = new cc.Sprite(texture2d);
        logo.x = screenCenter.x;
        logo.y = screenCenter.y;
        logo.width = img.width;
        logo.height = img.height;
        logo.setScale(cc.contentScaleFactor());
        return logo;
    },
    _initStage: function (img, screenCenter) {
        var self = this;
        var logo = self._getImgSprite(img,screenCenter);
        self.addChild(logo, 10);
    },
    resize:function(){
        this.bg_sprite.attr({
            x: 0,
            y: winSize.height,
            anchorX:0,
            anchorY: 1
        });
    },
    onNewGame:function(){
        manager.ChangeScene('game');
    }
});

var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        music.play('bg');
        ZT.state = 0;
        if(!LayerCaChe['start'])
        {
            LayerCaChe['start'] = new StartLayer();
            this.addChild(LayerCaChe['start']);
            // var bottom = new BottomLayer();
            // this.addChild(bottom);
        }
        
    },
    onExit:function(){
        music.stopBg();
    },
    resize:function(){
        if(LayerCaChe['start'])
        {
            LayerCaChe['start'].resize();
        }
    }
});

