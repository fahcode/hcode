var fontname = "微软雅黑";
var GameLayer = cc.LayerColor.extend({
    _drawers:[],
    qiuGap:2000,
    qiuNum:1,
    startqiuNum:4,
    addPerMinuite:2,
    currentqiu:0,
    gameTotalTime:20,
    gameTime:0,
    qiu_score:[1,2,3,4,5,6,7],
    showed_star:0,
    curXin:0,
    stars:[0,0,0],
    ctor:function () {
        var self = this;
        this._super();
        winSize = cc.winSize;
        //设置背景颜色
        this.init(cc.color(133,225,249),winSize.width,winSize.height);
        //添加背景
        this.bg_sprite = new cc.Sprite(res.bg1_jpg);
        this.bg_sprite.attr({
            x: 0,
            y: winSize.height,
            anchorX:0,
            anchorY: 1
        });
        this.addChild(this.bg_sprite, 0);
        this.addDrawers();
        //物理引擎初始化
        world.init();
        // this.setupDebugNode();
        // this.scheduleUpdate();
        //添加拳头
        this.fist = new Fist();
        this.guang = new Guang();
        this.addChild(this.fist,3);
        this.addChild(this.guang,4);
        //添加说明
        this.tipboard = new cc.Sprite("#tip.png");
        this.tipboard.attr({
            x: winSize.width*0.5,
            y: 20,
            anchorX:0.5,
            anchorY: 0
        });
        this.addChild(this.tipboard, 0);
        //添加分数
        var shadowOffset = cc.p(0, 0);
        var fontDefRedShadow = new cc.FontDefinition();
        fontDefRedShadow.fontName = "Microsoft Yahei";
        fontDefRedShadow.fontSize = 56;
        fontDefRedShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        // fontDefRedShadow.strokeEnabled = true;
        // fontDefRedShadow.strokeStyle = cc.color(27, 135, 4);
        // fontDefRedShadow.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        // fontDefRedShadow.fillStyle = cc.color(255, 255, 255);
        // // shadow
        // fontDefRedShadow.shadowEnabled = true;
        // fontDefRedShadow.shadowOffsetX = shadowOffset.x;
        // fontDefRedShadow.shadowOffsetY = shadowOffset.y;
        
        this.scorelabel = new cc.LabelTTF("0", fontDefRedShadow);
        this.scorelabel.attr({
            x: winSize.width*0.5,
            y: winSize.height-25,
            anchorX:0.5,
            anchorY: 1
        });
        this.addChild(this.scorelabel,5);
        this.scoretext = new cc.Sprite("#score.png");
        this.scoretext.attr({
            x: winSize.width*0.5,
            y: winSize.height-95,
            anchorX:0.5,
            anchorY: 1
        });
        this.addChild(this.scoretext,5);

        var fontDefRedShadow2 = new cc.FontDefinition();
        fontDefRedShadow2.fontName = "Microsoft Yahei";
        fontDefRedShadow2.fontSize = 30;
        fontDefRedShadow2.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        //添加倒计时
        this.timelabel = new cc.LabelTTF(this.getGameTime(),fontDefRedShadow2);
        //this.timelabel = new cc.LabelTTF("00:60", fontname,30, cc.TEXT_ALIGNMENT_LEFT);
        this.timelabel.attr({
            x: winSize.width-100,
            y: winSize.height-60,
            anchorX:0.5,
            anchorY: 0.5
        });
        this.addChild(this.timelabel,5);
        this.board_bg1 = new cc.Sprite("#board_bg.png");
        this.board_bg1.attr({
            x: winSize.width-100,
            y: winSize.height-60,
            anchorX:0.5,
            anchorY: 0.5
        });
        this.addChild(this.board_bg1,5);

        this.board_bg2 = new cc.Sprite("#board_bg.png");
        this.board_bg2.attr({
            x: 100,
            y: winSize.height-60,
            anchorX:0.5,
            anchorY: 0.5
        });
        this.addChild(this.board_bg2,5);

        this.stars[0] = new cc.Sprite("#star2.png");
        this.stars[0].attr({
            x: 55,
            y: winSize.height-60,
            anchorX:0.5,
            anchorY: 0.5
        });
        this.addChild(this.stars[0],6);
        this.stars[1] = new cc.Sprite("#star2.png");
        this.stars[1].attr({
            x: 100,
            y: winSize.height-60,
            anchorX:0.5,
            anchorY: 0.5
        });
        this.addChild(this.stars[1],6);
        this.stars[2] = new cc.Sprite("#star2.png");
        this.stars[2].attr({
            x: 145,
            y: winSize.height-60,
            anchorX:0.5,
            anchorY: 0.5
        });
        this.addChild(this.stars[2],6);
        return true;
    },
    update:function(dt){
        // if(!!window.noupdate)
        // {
        //     return;
        // }
        if(!!world.space)
        {
            world.space.step(dt);
        }
        var self = this;
        for(var i in self._drawers)
        {
            self._drawers[i].update();
        }
    },
    setupDebugNode:function()
    {
        // debug only
        this._debugNode = cc.PhysicsDebugNode.create( world.space );
        this._debugNode.visible = true ;
        this.addChild(this._debugNode,10);
    },
    reset:function(){
        this.bind();
        this.curXin = 0;
        this.showed_star = 0;
        this.currentqiu = 0;
        world.destroyWorld();
        this.scheduleUpdate();

        for(var i=0;i<3;i++)
        {
            this.stars[i].initWithSpriteFrameName("star2.png");
        }
        //this.setupDebugNode();
        this.stopAll();
        this.randomQiu();
    },
    resize:function(){
        this.bg_sprite.attr({
            x: 0,
            y: winSize.height,
            anchorX:0,
            anchorY: 1
        });
    },
    getGameTime:function(){
        var m = parseInt(this.gameTime/60);
        var s = parseInt(this.gameTime%60);
        if(m<10)
            m='0'+m;
        if(s<10)
            s='0'+s;
        return m+':'+s;
    },
    countTime:function(){
        var self = this;
        var string;
        if(self.gameTime<=0)
        {
            self.gameover();
            return;
        }
        this.timeClock = setInterval(function(){
            self.gameTime-=1;
            
            if(self.gameTime>=0)
            {
                self.timelabel.setString(self.getGameTime());
            }
            if(self.gameTime<=0)
            {
                clearInterval(self.timeClock);
                self.timeClock = null;
                self.gameover();
                return;
            }
            // if(self.gameTime%15==0)
            // {
            //     var sec = Math.floor(self.gameTime/15);
            //     var nextqiuNum = self.qiuNum;
            //     if(sec==4)
            //     {
            //         nextqiuNum = 1;
            //     }
            //     else if(sec==3)
            //     {
            //         nextqiuNum = 2;
            //     }
            //     else if(sec<=2)
            //     {
            //         nextqiuNum = 4;
            //     }
            //     if(nextqiuNum!=self.qiuNum)
            //     {
            //         self.qiuNum = nextqiuNum;
            //         self.randomQiu();
            //     }
            // }
        },1000);
    },
    addDrawers:function(){
        var drawer;
        for(var i=0;i<3;i++)
        {
            drawer = new Drawer();
            drawer.attr({
                x:0,
                y:winSize.height-114+200-120*i,
                anchorX:0,
                anchorY: 1
            });
            this.addChild(drawer);
            this._drawers.push(drawer);
        }
    },
    hideAllQiu:function(){
        for(var i in this._drawers)
        {
            this._drawers[i].hideQiu();
        }
    },
    bind:function(){
        var self = this;
        if(!cc.sys.isMobile) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    self._touchStart(event.getLocation());
                    // var pos = event.getLocation(), target = event.getCurrentTarget();
                    // if(event.getButton() === cc.EventMouse.BUTTON_RIGHT)
                    //     cc.log("onRightMouseDown at: " + pos.x + " " + pos.y );
                    // else if(event.getButton() === cc.EventMouse.BUTTON_LEFT)
                    //     cc.log("onLeftMouseDown at: " + pos.x + " " + pos.y );
                    // target.sprite.x = pos.x;
                    // target.sprite.y = pos.y;
                },
                onMouseMove: function(event){
                    // var pos = event.getLocation(), target = event.getCurrentTarget();
                    // cc.log("onMouseMove at: " + pos.x + " " + pos.y );
                    // target.sprite.x = pos.x;
                    // target.sprite.y = pos.y;
                },
                onMouseUp: function(event){
                    // var pos = event.getLocation(), target = event.getCurrentTarget();
                    // target.sprite.x = pos.x;
                    // target.sprite.y = pos.y;
                    // cc.log("onMouseUp at: " + pos.x + " " + pos.y );
                }
            }, this);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan: function(touches,event){
                    self._touchStart(touches[0].getLocation());
                },
                onTouchesMoved: function(touches,event){

                },
                onTouchesEnded: function(touches,event){

                },
                onTouchesCancelled: function(touches,event){

                }
            }, this);
        }
    },
    _touchStart:function(pos){
        var handRect = cc.rect({x:pos.x,y:pos.y,width:1,height:1});
        var qiuRect;
        var clicked = false;
        for(var i=2;i>=0;i--)
        {
            for(var j in this._drawers[i]['qius'])
            {
                if(clicked)
                {
                    break;
                }
                var qiu = this._drawers[i]['qius'][j];
                if(!qiu||qiu.state==0)
                {
                    continue;
                }
                qiuRect = qiu.getBoundingBoxToWorld();
                // console.log(qiuRect);
                // console.log(handRect);
                window.noupdate = 1;
                // console.log(cc.rectIntersectsRect(qiuRect,handRect));
                if(cc.rectIntersectsRect(qiuRect,handRect)&&qiu.inclipe())
                {
                    var result = qiu.hit();
                    if(result=='star')
                    {
                        this.jiaXin();
                    }
                    // console.log("打中");
                    this.hit(result,qiu.convertToWorldSpace());
                    // console.log(qiu.inclipe());
                    // console.log(qiu.convertToWorldSpace());
                    clicked = true;
                    break;
                }
                
            }
        }
    },
    hit:function(result,pos){
        //打中时执行
        var self = this;
        if(!result)
        {
            return;
        }
        if(result!='star')
        {
            music.play('mouse0');
            this.fist.hit(pos);
            self.guang.hide();
            setTimeout(function(){
                self.guang.hit(pos);
            },50);
            this.jiafen(pos,result);
            ZT.score +=result;
            this.scorelabel.setString(ZT.score);
        }
        else
        {
            this.fist.hit(pos);
            setTimeout(function(){
                self.guang.hit(pos);
            },50);
        }
        
    },
    jiaXin:function(){
        this.curXin++;
        if(this.curXin>3)
        {
            return;
        }
        for(var i=0;i<this.curXin;i++)
        {
            this.stars[i].initWithSpriteFrameName("star1.png");
        }
    },
    randomQiu:function(){
        var self = this;
        var gapTime = 0;
        if(!!this.qiucolck)
        {
            clearInterval(this.qiucolck);
            this.qiucolck = null;
        }
        function setShowQius(num,gap){
            if(ZT.state!=1)
            {
                return;
            }
            for(var i=0;i<num;i++)
            {
                self.showAQiu(parseInt(gap/num*i));
            }
        }
        setShowQius(self.qiuNum,self.qiuGap);
        this.qiucolck = setInterval(function(){
            setShowQius(self.qiuNum,self.qiuGap);
        },this.qiuGap);
    },
    showAQiu:function(gap){
        var self = this;
        var random = parseInt(Math.random()*gap)+gap/2;
        var cat;
        var gamedtime = this.gameTotalTime-this.gameTime
        if(gamedtime>=this.gameTotalTime/4&&gamedtime<this.gameTotalTime/4*2&&this.showed_star<=0)
        {
            cat = "star";
            this.showed_star++;
        }
        else if(gamedtime>=this.gameTotalTime/4*2&&gamedtime<this.gameTotalTime/4*3&&this.showed_star<=1)
        {
            cat = "star";
            this.showed_star++;
        }
        else if(gamedtime>=this.gameTotalTime/4*3&&gamedtime<this.gameTotalTime&&this.showed_star<=2)
        {
            cat = "star";
            this.showed_star++;
        }
        else
        {
            cat = Math.floor(Math.random()*6)+1;
        }
        this.currentqiu++;
        if(this.currentqiu>9)
        {
            this.currentqiu=1;
        }
        var index = this.randomDrawer(self);
        this.qiuclock2 = setTimeout(function(){
            if(ZT.state!=1)
            {
                return;
            }
            self._drawers[index].showQiu(cat);
        },gap);
    },
    jiafen:function(pos,result){
        var self = this;
        if(parseInt(result)<0)
        {
            var sprite = new cc.Sprite("#plus1.png");
        }
        else
        {
            var sprite = new cc.Sprite("#plus1.png");
        }
        
        sprite.attr({
            x:pos.x+120,
            y:pos.y+100,
            anchorX:0.5,
            anchorY: 0.5
        });

        var action = cc.moveTo(0.3, cc.p(pos.x+120,pos.y+120));
        var callback = cc.callFunc(function(){
            self.removeChild(sprite);
        }, this);
        // var particleSystem = new cc.ParticleSystem(res.particle);
        // particleSystem.duration = 0.5;
        // particleSystem.speed = 100;
        // particleSystem.attr({
        //     x:pos.x,
        //     y:pos.y-20,
        //     anchorX:0.5,
        //     anchorY: 0.5
        // });
        // particleSystem.setAutoRemoveOnFinish(true);
        // this.addChild(particleSystem,5);
        var seq = cc.sequence(action,callback);
        this.addChild(sprite,20);
        sprite.runAction(seq);
    },
    randomDrawer:function(count){
        var self = this;
        if(!!count)
            count = 0;
        var random = Math.floor(Math.random()*3);
        if(count>=5)
        {
            return random;
        }
        count++;
        if(self._drawers[random].isFull())
        {
            random = self.randomDrawer(count);
        }
        return random;
    },
    countDown:function(readygo){
        cc.eventManager.setEnabled(false);
        var i = 0;
        var self = this;
        var sprite;
        var action = cc.scaleTo(0.2, 1);
        var callback = cc.callFunc(function(){
            self.removeChild(sprite);
        }, this);
        var callback1 = cc.callFunc(function(){
            music.play('second_music');
        }, this);
        var seq = cc.sequence(action,callback1,cc.delayTime(0.3),callback);
        if(!self.coversprite)
        {
            self.coversprite = cc.LayerColor.create(cc.color(0, 0, 0, 100),winSize.width,winSize.height);
            self.addChild(self.coversprite,9);
        }
        else
        {
            self.coversprite.setVisible(true);
        }
        var showNum = function(){
            i++
            sprite = cc.Sprite.create('#start'+(4-i)+'.png');
            sprite.attr({
                x:winSize.width/2,
                y:winSize.height/2,
                anchorX:0.5,
                anchorY: 0.5,
                scale:0.5
            });
            self.addChild(sprite,10);
            sprite.runAction(seq);
            if(i>=3)
            {
                setTimeout(function(){
                    if(self.coversprite)
                    {
                        self.coversprite.setVisible(false);
                    }
                    music.play('time_music');
                    if(!!readygo)
                    { 
                        readygo();
                    }
                },500);
                
                clearInterval(self.startClock);
                cc.eventManager.setEnabled(true);
                return;
            }
        };
        showNum();
        this.startClock = setInterval(function(){
            showNum();
        },1000);
    },
    start:function(){
    	// if(startTip) alert(startTip);
        music.stopBg();
        ZT.state = 1;
        ZT.score = 0;
        this.qiuNum = this.startqiuNum;
        this.gameTime = this.gameTotalTime;
        this.timelabel.setString(this.getGameTime());
        this.scorelabel.setString("0");
        gamestart();
        
        var self = this;
        if(!!this.qiucolck)
        {
            clearInterval(this.qiucolck);
            this.qiucolck = null;
        }
        if(!!this.qiucolck2)
        {
            clearTimeout(this.qiucolck2);
            this.qiucolck2 = null;
        }
        if(!!this.startClock)
        {
            clearInterval(this.startClock);
            this.startClock = null;
        }
        this.hideAllQiu();
        this.countDown(function(){
            music.play('bg1');
            self.reset();
            self.countTime();
        });
    },
    pause:function(){
        if(ZT.state!=1)
        {
            return;
        }
        ZT.state = 2;
        if(!!this.qiucolck)
        {
            clearInterval(this.qiucolck);
            this.qiucolck = null;
        }
        if(!!this.qiuclock2)
        {
            clearTimeout(this.qiuclock2);
            this.qiucolck2 = null;
        }
        if(!!this.startClock)
        {
            clearInterval(this.startClock);
            this.startClock = null;
        }
        if(!!this.timeClock)
        {
            clearInterval(this.timeClock);
            this.timeClock = null;
        }
        for(var i in this._drawers)
        {
            this._drawers[i].pause();
        }
    },
    resumegame:function(){
        ZT.state = 1;
        var self = this;
        this.countDown(function(){
            for(var i in self._drawers)
            {
                self._drawers[i].resume();
            }
            self.reset();
            self.countTime();
        });
    },
    gameover:function(){
        // this.stopAll();
        music.play('over_music');
        if(!!this.qiucolck)
        {
            clearInterval(this.qiucolck);
            this.qiucolck = null;
        }
        if(!!this.qiucolck2)
        {
            clearTimeout(this.qiucolck2);
            this.qiucolck2 = null;
        }
        if(!!this.startClock)
        {
            clearInterval(this.startClock);
            this.startClock = null;
        }
        if(!!this.timeClock)
        {
            clearInterval(this.timeClock);
            this.timeClock = null;
        }
        ZT.state = 3;
        gameover(ZT.score);
    },
    stopAll:function(){
        for(var i in this._drawers)
        {
            this._drawers[i].stopAll();
        }
    },
    exit:function(){
        if(!!this.qiucolck)
        {
            clearInterval(this.qiucolck);
            this.qiucolck = null;
        }
        if(!!this.qiucolck2)
        {
            clearTimeout(this.qiucolck2);
            this.qiucolck2 = null;
        }
        if(!!this.startClock)
        {
            clearInterval(this.startClock);
            this.startClock = null;
        }
        if(!!this.timeClock)
        {
            clearInterval(this.timeClock);
            this.timeClock = null;
        }
        this.hideAllQiu();
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        if(!!LayerCaChe['game'])
        {
            
        }
        else
        {
            LayerCaChe['game'] = new GameLayer();
            this.addChild(LayerCaChe['game']);
            // var bottom = new BottomLayer();
            // this.addChild(bottom,1);
        }
        LayerCaChe['game'].start();
    },
    onExit:function(){
        if(!!LayerCaChe['game'])
        {
            LayerCaChe['game'].exit();
        }
    },
    resize:function(){
        if(!!LayerCaChe['game'])
        {
            LayerCaChe['game'].resize();
        }
    }
});

