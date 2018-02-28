var Fist = cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.initWithSpriteFrameName("fist.png");
        this.visible = false;
    },
    hit:function(pos){
        var self = this;
        this.attr({
            x:pos.x+20,
            y:pos.y+100,
            anchorX:0.5,
            anchorY: 0.5
        });
        this.visible = true;
        // setTimeout(function(){
        //     self.initWithFile(res.hammer1_png);
        // },40);
        setTimeout(function(){
            self.visible = false;
            //self.initWithFile(res.hammer0_png);
        },600);
    }
});
var Guang = cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.initWithSpriteFrameName("guang.png");
        this.visible = false;
    },
    hit:function(pos){
        var self = this;
        this.attr({
            x:pos.x+80,
            y:pos.y+130,
            anchorX:0.5,
            anchorY: 0.5
        });
        this.visible = true;

        this.clock = setTimeout(function(){
            self.visible = false;
        },200);
    },
    hide:function(){
        clearTimeout(this.clock);
        this.visible = false;
    }
});

