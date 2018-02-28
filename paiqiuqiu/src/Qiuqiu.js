var qiuobj = [];
window.collision_type =1;
var Qiu = cc.Sprite.extend({
    state:0,
    showTime:[1500,1600],
    cat:0,
    ctor:function (cat,position) {
        this._super();
        if(cat=='star')
        {
            this.attr({
                width:190,
                height:190
            });
            this.xunzhang = new cc.Sprite("#xunzhang.png");
            this.xunzhang.attr({
                x:95,
                y:95,
                anchorX:0.5,
                anchorY: 0.5
            });
            this.lignt1 = new cc.Sprite("#light1.png");
            this.lignt1.attr({
                x:19,
                y:127,
                anchorX:0.5,
                anchorY: 0.5,
                scale:0,
                opacity:0
            });
            this.lignt2 = new cc.Sprite("#light2.png");
            this.lignt2.attr({
                x:144,
                y:157,
                anchorX:0.5,
                anchorY: 0.5,
                scale:0,
                opacity:0
            });
            this.addChild(this.xunzhang,1);
            this.addChild(this.lignt1,2);
            this.addChild(this.lignt2,2);
        }
        else
        {
            this._img = "boy"+cat+".png";
            this._img2 = "boy"+cat+".png";
            this.initWithSpriteFrameName(this._img);
        }
        this.visible = true;
        this.cat = cat;
        return true;
    },
    hit:function(){
        if(this.state == 1)
        {
            this.drop();
            if(this.cat=='star')
            {
                return 'star';
            }
            return 1;
        }
        return false;
    },
    show:function(){
        if(this.state!=0)
        {
            return;
        }
        var self = this;
        this.createbody();
        var randomy = randomNum(-30,100);
        var randomx = randomNum(-30,0);
        var baseVx = 1100;
        if(this.cat=='star')
        {
            baseVx = 2200;
        }
        var delta = {x:randomx,y:baseVx+randomy};
        this._body.applyImpulse(delta, cp.v(randomNum(-100,100)/100,0));
        this.state = 1;
        if(this.cat=='star')
        {
            setTimeout(function(){
                self.light(self.lignt1,-1);
                self.light(self.lignt2,1);
            },200);
            
        }
    },
    createbody:function(){
        var self = this;
        var radius = this.width*0.5;
        var mass;
        if(this.cat=='star')
        {
            mass = 2;
        }
        else
        {
            mass = 1;
        }
        this._body = world.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius,cp.v(0, 0))));
        var angle = -this.getRotation();
        this._body.setPos(cp.v(this.x,this.y));
        this._body.setAngle(angle*Math.PI/180);
        var circle = world.addShape(new cp.CircleShape(this._body, radius,cp.v(0, 0)));;
        circle.setElasticity(0.8);
        circle.setFriction(0);
        circle.group = 1;
        window.collision_type++;
        circle.data = 0;
        this._shape = circle;
    },
    update:function(){
        if(this.state==0||!this._body)
        {
            return;
        }
        var y = this._body.getPos().y;
        if(y<-128)
        {
            this.stop();
            return;
        }
        var x = this._body.getPos().x;
        this.attr({
            x:x,
            y:y,
            anchorX:0.5,
            anchorY:0.5
        });
        var angle = cp.v.toangle(this._body.rot);
        this.setRotation(-180/Math.PI*angle);
    },
    drop:function(){
        var self = this;
        world.space.removeShape(this._shape);
        world.space.removeBody(this._body);
        this.state = 2;
        // this.stopAllActions();
        // this.initWithSpriteFrameName(this._img2);
        // this.attr({
        //     x: 82,
        //     y: -20,
        //     anchorX:0.5,
        //     anchorY: 0
        // });
        // setTimeout(function(){
        //     self.visible = false;
        // },1000);
        setTimeout(function(){
            self.createbody();
        },400);
    },
    inclipe:function(){
        if(this.getPosition().y>(this.getPosition().x)*0.16875+128+30)
        {
            return true;
        }
        return false;
    },
    stop:function(){
        if(this.state==0)
            return;
        world.removeShape(this._shape);
        world.removeBody(this._body);
        this.state = 0;
    },
    light:function(sprite,index){
        if(typeof(index)=='undefined')
        {
            index = 1;
        }
        var rotate1 = cc.rotateTo(0.2, index*90);
        var rotate2 = cc.rotateTo(0.2, index*180);
        var scale1 = cc.scaleTo(0.2, 1);
        var scale2 = cc.scaleTo(0.2, 0);
        var opacity1 = cc.fadeIn(0.2);
        var opacity2 = cc.fadeOut(0.2);
        var seq1 = cc.sequence(rotate1, rotate2);
        var seq2 = cc.sequence(scale1, scale2);
        var seq3 = cc.sequence(opacity1, opacity2);
        sprite.runAction(seq1);
        sprite.runAction(seq2);
        sprite.runAction(seq3);
    }
});

