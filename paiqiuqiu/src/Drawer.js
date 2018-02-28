var Drawer = cc.Sprite.extend({
    qius:[0,0,0],
    ctor:function (row) {
        var self = this;
        this._super();
        //this.init(cc.color(0,0,0),640,485);
        this.attr({
            width:640,
            height:685
        });
        this.qius = [0,0,0];
        this.clipping = new cc.ClippingNode();
        var stencil = new cc.DrawNode();
        var rectangle = [cc.p(0, 128),cc.p(640, 308),
            cc.p(640, 685),cc.p(0, 685)];     
        var white = cc.color(1, 1, 1, 1);
        stencil.drawPoly(rectangle, white, 1, white);
        this.clipping.setStencil(stencil);
        this.clipping.attr({
            x:0,
            y:0,
            anchorX:0,
            anchorY: 0
        });
        this.addChild(this.clipping);
        var line = new cc.Sprite("#line1.png");
        line.attr({
            x:0,
            y:0,
            anchorX:0,
            anchorY:0
        });
        this.addChild(line,1);
        return true;
    },
    isFull:function(){
        var bool = true;
        if(this.qius.length>=3)
        {
            for(var i in this.qius)
            {
                if(!this.qius[i]||this.qius[i].state==0)
                {
                    bool = false;
                }
            }
        }
        else
        {
            bool = false;
        }
        return bool;
    },
    showQiu:function(cat){
        var self = this;
        //添加地鼠
        if(this.qius.length>0)
        {
            for(var i in this.qius)
            {
                if(this.qius[i].state==0)
                {
                    this.removeChild(this.qius[i]);
                    this.qius[i] = 0;
                }
                
            }

            this.addQiu(cat);
        }
        else
        {
            this.addQiu(cat);
        }
    },
    addQiu:function(cat){
        var positon = this.randomPosition();
        if(!!this.qius[positon]&&this.qius[positon].state!=0)
        {
            return;
        }
        var qiu = new Qiu(cat);
        qiu.attr({
            x:(1+positon*2)/6*winSize.width,
            y:(1+positon*2)/6*winSize.width*180/640+20,
            anchorY:0,
            anchorX:0.5
        });
        this.clipping.addChild(qiu,1);
        qiu.show();
        this.qius[positon] = qiu;
    },
    randomPosition:function(){
        var random = Math.floor(Math.random()*3);
        if(!!this.qius[random]&&this.qius[random].state!=0)
        {
            return this.randomPosition();
        }
        else
        {
            return random;
        }
    },
    update:function(){
        for(var i in this.qius)
        {
            if(!!this.qius[i]&&this.qius[i].state!=0)
            {
                this.qius[i].update();
            }
        }
    },
    stopAll:function(){
        if(!!this.qius)
        {
            for(var i in this.qius)
            {
                if(this.qius[i])
                {
                    this.qius[i].stop();
                }
                this.removeChild(this.qius[i]); 
                delete this.qius[i];
                this.qius[i] = 0;
            }
        }
    },
    hideQiu:function(){
        if(!!this.qiu)
        {
            for(var i in this.qius)
            {
                this.removeChild(this.qius[i]);
                removeFromArrayByIndex(this.qius,i);
            }
        }
    },
    hit:function(){
        if(!this.qiu)
        {
            return false;
        }
        var hitvalue = this.qiu.hit();
        return hitvalue;
    },
    pause:function(){
        if(!!this.qiu)
        {
            cc.director.getActionManager().pauseTarget(this.qiu);
        }
    },
    resume:function(){
        if(!!this.qiu)
        {
            cc.director.getActionManager().resumeTarget(this.qiu);
        }
    }
});
