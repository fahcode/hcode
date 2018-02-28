//音乐
var music = {
    state:1,
    istan:false,
    audioId:{},
    init:function(){
        this.audioEngine = cc.audioEngine;
        this.audioEngine.setEffectsVolume(1);
        this.state=1;
        this.bgmusic = {bg:musicRes.game_music_ogg,bg1:musicRes.game_music2_ogg};
    },
    play:function(name,loop){
        var self = this;
        if(typeof(loop)=='undefined')
        {
            loop = false;
        }
        if(this.state==0)
        {
            return;
        }
        if(typeof(name)=='undefined')
        {
            return;
        }
        if(name=='bg'||name=='bg1')
        {
            if(typeof(this.audioId['bg'])!='undefined'&&this.audioId['bg']>=0)
            {
                this.audioEngine.stopMusic(this.audioId['bg']);
            }
            this.audioId['bg'] = this.audioEngine.playMusic(this.bgmusic[name],true);
            return;
        }
        else
        {
            if(typeof(this.audioId[name])!='undefined'&&this.audioId[name]>=0)
            {
                this.audioEngine.stopEffect(this.audioId[name]);
            }
            this.audioId[name] = this.audioEngine.playEffect(musicRes[name+'_ogg'],loop);
        }
    },
    pause:function(name){
        this.audioEngine.stopEffect(this.audioId[name]);
    },
    toggleMusic:function(self){
        if(music.state==1)
        {
            music.audioEngine.stopMusic();
            music.audioEngine.setEffectsVolume(0);
            music.state = 0;
        }
        else if(music.state==0)
        {
            music.state = 1;
            music.audioEngine.setEffectsVolume(1);
            music.play('bg');
            
        }
    },
    stopBg:function(){
        this.audioEngine.stopMusic();
        this.audioEngine.stopAllEffects();
    }
}
music.init();
// var music = {
//     state:1,
//     istan:false,
//     tanClock:null,
//     tanGap:10,
//     audioId:{},
//     init:function(){
//         this.audioEngine = cc.AudioEngine2.getInstance();
//         this.audioEngine.init();
//         this.audioEngine.setEffectsVolume(1);
//         this.state=1;
//     },
//     play:function(name,loop){
//         var self = this;
//         if(typeof(loop)=='undefined')
//         {
//             loop = false;
//         }
//         if(this.state==0)
//         {
//             return;
//         }
//         if(typeof(name)=='undefined')
//         {
//             return;
//         }
//         if(name=='bg')
//         {
//             loop = true;
//         }

//         if(name=='sliver_coin'||name=='golden_coin')
//         {
//             if(this.istan)
//             {
//                 if(!this.tanClock)
//                 {
//                     //clearTimeout(this.tanClock);
//                     this.tanClock = setTimeout(function(){
//                         self.istan = false;
//                         self.tanClock = null;
//                     },this.tanGap);
//                 }
//             }
//             else
//             {
//                 this.istan = true;
//                 if(this.audioId[name])
//                 {
//                     this.audioEngine.stopEffect(this.audioId[name]);
//                 }
//                 this.audioId[name] = this.audioEngine.playEffect("res/Music/"+name+".mp3",loop);
//             }
//         }
//         else
//         {
//             if(typeof(this.audioId[name])!='undefined'&&this.audioId[name]>=0)
//             {
//                 this.audioEngine.stopEffect(this.audioId[name]);
//             }
            
//             this.audioId[name] = this.audioEngine.playEffect("res/Music/"+name+".mp3",loop);

//             // debug(name+":"+this.audioId[name]);
//         }
        
//     },
//     pause:function(name){
//         // debug(name+" "+this.audioId[name]);
//         this.audioEngine.stopEffect(this.audioId[name]);
//     },
//     toggleMusic:function(self){
//         if(music.state==1)
//         {
//             music.audioEngine.setEffectsVolume(0);
//             music.state = 0;
//         }
//         else if(music.state==0)
//         {
//             music.audioEngine.setEffectsVolume(1);
//             music.state = 1;
//         }
//     },
//     stopBg:function(){
//         this.audioEngine.stopAllEffects();
//     }
// }

// if(cc.sys.os=="Android")
// {
//     music = musicAndroid;
// }
