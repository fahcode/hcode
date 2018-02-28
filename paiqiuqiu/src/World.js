var TAG_SPRITE_BALL = 1;
var TAG_SPRITE_USER = 2;
var TAG_SPRITE_NPC = 3;
var PTM_RATIO = 32;
var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
var COLLISION = 1;
var PTM_RATIO = 30;
var world = {
    _shapes:[],
    _bodys:[],
    space:null,
	init:function(){
		this.space = new cp.Space();
        this.space.iterations = 60;
        this.space.gravity = cp.v(0, -3000);
        //this.space.gravity = cp.v(0, -300);
        this.space.sleepTimeThreshold = 0.5;
        this.space.collisionSlop = 0.5;
        //添加墙壁1
        var wall1 = this.space.addShape(new cp.SegmentShape(this.space.staticBody,cp.v(-100, -300),cp.v(winSize.width+100,-300), 0));
        wall1.setElasticity(1);
        wall1.setFriction(1);
        wall1.setLayers(NOT_GRABABLE_MASK);
        wall1.collision_type=0;
        // this._shapes.push(wall1);
        // wall1 = this.space.addShape(new cp.SegmentShape(this.space.staticBody,cp.v(0, 0),cp.v(winSize.width,0), 0));
        // wall1.setElasticity(1);
        // wall1.setFriction(1);
        // wall1.setLayers(NOT_GRABABLE_MASK);
        // wall1.collision_type=2;
        // wall1.data=1;
        // this._shapes.push(wall1);
	},
	destroyWorld:function(){
		for(var i=0;i<this._shapes.length;i++)
        {
            this.removeShape(this._shapes[i]);
        }
        for(var i=0;i<this._bodys.length;i++)
        {
            this.removeBody(this._bodys[i]);
        }
	},
    removeShape:function(shape){
        if(!shape)
            return;
        if(this.space.containsShape(shape))
        {
            this.space.removeShape(shape);
        }
        removeFromArray(this._shapes,shape);
    },
    removeBody:function(body){
        if(!body)
            return;
        if(this.space.containsBody(body))
        {
            this.space.removeBody(body);
        }
        removeFromArray(this._bodys,body);
    },
    addShape:function(shape){
        this._shapes.push(shape);
        return this.space.addShape(shape);
    },
    addBody:function(body){
        this._bodys.push(body);
        return this.space.addBody(body);
    }
}
