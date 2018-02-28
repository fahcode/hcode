var LayerCaChe={};
var Scene = {start:StartScene,game:GameScene};

var manager = {
    curScene:null,
    getScene:function(name,para){
        if(!this[name])
        {
            this[name] = new Scene[name];
        }
        return this[name];
    },
    ChangeScene:function(name){
        var scene = this.getScene(name);
        cc.director.runScene(scene);
        this.curScene = scene;
    }
};