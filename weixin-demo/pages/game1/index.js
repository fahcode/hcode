//snake.js
var app = getApp();
const defaultDirection = 'right';

Page({
   data:{
        score: 0,//比分
        maxscore: 0,//最高分
        startx: 0,
        starty: 0,
        endx:0,
        endy:0,//以上四个做方向判断来用
        ground: [],//存储操场每个方块
        rows:24,
        cols:22,//操场大小
        snake:[],//存蛇
        food:[],//存食物
        direction: defaultDirection,//方向
        modalHidden: true,
        timer:'',

        isstop: false
   } ,
   onLoad:function(){
       var maxscore = wx.getStorageSync('maxscore');
       if(!maxscore) maxscore = 0
        this.setData({
        maxscore:maxscore
        });
        
        this.initGround(this.data.rows,this.data.cols);//初始化操场
        this.initSnake(3);//初始化蛇
        this.creatFood();//初始化食物
        this.move();//蛇移动
   },
   //计分器
    storeScore:function(){

      if(this.data.maxscore < this.data.score){
      this.setData({
        maxscore:this.data.score
        })
        wx.setStorageSync('maxscore', this.data.maxscore)
      }
  },
  //操场
    initGround:function(rows,cols){
        for(var i=0;i<rows;i++){
            var arr=[];
            this.data.ground.push(arr);
            for(var j=0;j<cols;j++){
                this.data.ground[i].push(0);
            }
        }
    },
   //蛇
   initSnake:function(len){
       for(var i=0;i<len;i++){
           this.data.ground[0][i]=1;
           this.data.snake.push([0,i]);
       }
   },
   //移动函数
   move:function(){
       var self=this;
       this.data.timer=setInterval(function(){
         console.log('移动')
           self.changeDirection(self.data.direction);
            self.setData({
               ground:self.data.ground
           });
       },400);
   },
    tapStart: function(event){
        this.setData({
            startx: event.touches[0].pageX,
            starty: event.touches[0].pageY
            })
    },
    tapMove: function(event){
        this.setData({
            endx: event.touches[0].pageX,
            endy: event.touches[0].pageY
            })
    },
    tapEnd: function(event){
        var heng = (this.data.endx) ? (this.data.endx - this.data.startx) : 0;
        var shu = (this.data.endy) ? (this.data.endy - this.data.starty) : 0;

        if(Math.abs(heng) > 5 || Math.abs(shu) > 5){
          //通过滑动的差值来判断方向
            var direction = (Math.abs(heng) > Math.abs(shu)) ? this.computeDir(1, heng):this.computeDir(0, shu);
            
            switch(direction){
            case 'left':
                if(this.data.direction=='right')return;
                break;
            case 'right':
                if(this.data.direction=='left')return;
                break;
            case 'top':
                if(this.data.direction=='bottom')return;
                break;
            case 'bottom':
                if(this.data.direction=='top')return;
                break;
            default:
        }
        this.setData({
          startx:0,
          starty:0,
          endx:0,
          endy:0,
          direction: direction
        })
        
      }
    },
    computeDir: function(heng, num){
    if(heng) return (num > 0) ? 'right' : 'left';
    return (num > 0) ? 'bottom' : 'top';
    },
    //随机创建食物
    creatFood:function(){
        var x=Math.floor(Math.random()*this.data.rows);
        var y=Math.floor(Math.random()*this.data.cols);
        var ground= this.data.ground;
        ground[x][y]=2;
        this.setData({
            ground:ground,
            food:[x,y]
        });
    },
    //判断方向
    changeDirection:function(dir){
      console.log(dir)
        switch(dir){
        case 'left':
            return this.changeLeft();
            break;
        case 'right':
            return this.changeRight();
            break;
        case 'top':
            return this.changeTop();
            break;
        case 'bottom':
            return this.changeBottom();
            break;
        default:
        }
    },
    changeLeft:function(){
        
        var arr=this.data.snake,
            len=this.data.snake.length,
            //蛇尾
            snakeTAIL=arr[0],
            ground=this.data.ground;
        //蛇尾清空
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;
        //除蛇头以外的，全部等于之前一个的位置
        for(var i=0;i<len-1;i++){
            arr[i]=arr[i+1];   
        };
        //处理蛇头
        var x=arr[len-1][0];
        //列减1
        var y=arr[len-1][1]-1;
        //修改数据
        arr[len-1]=[x,y];

        ///检查是否超出。并且吃东西，这个时候尾巴被加长了一节
        this.checkGame(snakeTAIL);
        ///把渲染的蛇 的位置保存
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        
        this.setData({
            ground:ground,
            snake:arr
        });
        
        return true;
    },
    changeRight:function(){
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1][1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0];
        var y=arr[len-1][1]+1;
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;

        } 
        
        this.setData({
                ground:ground,
            snake:arr
        });
        
        
        return true;
    },
    changeTop:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1][1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0]-1;
        var y=arr[len-1][1];
        arr[len-1]=[x,y];
            this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        this.setData({
            ground:ground,
            snake:arr
        });
      
        return true;
    },
    changeBottom:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };
        var x=arr[len-1][0]+1;
        var y=arr[len-1][1];
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        this.setData({
            ground:ground,
            snake:arr
        });
        return true;
    },
    //检查结果，和吃食物
    checkGame:function(snakeTAIL){
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        ///边界值判断
        if(snakeHEAD[0]<0||snakeHEAD[0]>=this.data.rows||snakeHEAD[1]>=this.data.cols||snakeHEAD[1]<0){
                clearInterval(this.data.timer);
                    this.setData({
                    modalHidden: false,
                        })  
        }
        //头尾相连
        for(var i=0;i<len-1;i++){
            if(arr[i][0]==snakeHEAD[0]&&arr[i][1]==snakeHEAD[1]){
                clearInterval(this.data.timer);
                    this.setData({
                        modalHidden: false,
                    })
            }
        }
        //吃食物了
        if(snakeHEAD[0]==this.data.food[0]&&snakeHEAD[1]==this.data.food[1]){
          //增尾巴
            arr.unshift(snakeTAIL);
            this.setData({
                score:this.data.score+10
            });
            this.storeScore();
            this.creatFood();
        }
        
        
    },
    //重置
    modalChange:function(){
      this.setData({
              score: 0,
          ground:[],
          snake:[],
              food:[],
              modalHidden: true,
              direction: defaultDirection
      })
      this.onLoad();
    },
    switchGame: function(state){
      var nowState = !this.data.isstop;
      this.setData({
        isstop: nowState
      });
      console.log(nowState)
      //暂停和开启游戏
      if (nowState){
        clearInterval(this.data.timer);
        return false;
      }
      //开始移动
      this.move()
    },
    onHide: function(){
      this.switchGame(false)
    }

  
});