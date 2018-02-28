//index.js
//获取应用实例
var app = getApp()
//默认的起始值
const defaultNumbers = [[0, 0, 2, 2], [0, 2, 4, 0], [0, 4, 0, 0], [0, 0, 0, 0]];

Page({
  data: {
    score: 0,
    maxscore: 0,
    startx: 0,
    starty: 0,
    endx:0,
    endy:0,
    direction:'',
    numbers: defaultNumbers,
    modalHidden: true,
  },
  onLoad: function () {
    //调用API从本地缓存中获取数据,获取最高分
    var maxscore = wx.getStorageSync('maxscore')
    if(!maxscore) maxscore = 0
    this.setData({
      maxscore:maxscore
      })
  },
  //保存分数
  storeScore:function(){
      console.log(this.data.maxscore, this.data.score)
      if(this.data.maxscore < this.data.score){
      this.setData({
        maxscore:this.data.score
        })
        wx.setStorageSync('maxscore', this.data.maxscore)
      }
  },
  tapStart: function(event){
    //记录start 的位置
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
    //x轴方向的位移
    var heng = (this.data.endx) ? (this.data.endx - this.data.startx) : 0;
    //y轴方向的位移
    var shu = (this.data.endy) ? (this.data.endy - this.data.starty) : 0;
    console.log(heng, shu);
    if(Math.abs(heng) > 5 || Math.abs(shu) > 5){
      //通过两个方向的位移判断滑动的方向
      var direction = (Math.abs(heng) > Math.abs(shu)) ? this.computeDir(1, heng):this.computeDir(0, shu);
      this.setData({
        startx:0,
        starty:0,
        endx:0,
        endy:0
      })
      this.mergeAll(direction) && this.randInsert();
    }
  },
  //通过值的正负判断左右或者上下的方向
  computeDir: function(heng, num){
    if(heng) return (num > 0) ? 'right' : 'left';
    return (num > 0) ? 'bottom' : 'top';
  },

  mergeAll: function(dir){
    this.checkGame();
    switch(dir){
      case 'left':
        //往左
        return this.mergeleft();
        break;
      case 'right':
        //往右
        return this.mergeright();
        break;
      case 'top':
        return this.mergetop();
        break;
      case 'bottom':
        return this.mergebottom();
        break;
      default:
    }
  },

  //左划，  处理x轴方向的数据
  mergeleft: function(){
    var change = false;
    var arr = this.data.numbers;
    
    for(var i = 0; i < 4; i++){
      //merge first
      for(var j = 0; j < 3; j++){
        //为空不处理
        if(arr[i][j] == 0) continue;
        //处理同一列的是否要相加值
        for(var k = 1; k < 4-j; k++){
          //相邻都不为空
          if(arr[i][j] != 0 && arr[i][j+k] != 0){
            if(arr[i][j] != arr[i][j+k]) break;   //不相同则直接跳过
            arr[i][j] = arr[i][j] *2;
            arr[i][j+k] = 0;
            change = true;
            this.setData({
              //得分等于合成值的一半
              score: this.data.score + arr[i][j]/2
            })
            break;
          }
        }
      }
      //移动全部元素，移动数据位置
      for(var j = 0; j < 3; j++){
        if(arr[i][j] == 0){
          //处理当前元素后面的全部元素
          for(var k = 1; k < 4-j; k++){
            if(arr[i][j+k] != 0){
              arr[i][j] = arr[i][j+k];
              arr[i][j+k] = 0;
              change = true;
              break;
            }
          }
        }
      }
    }
    this.setData({
          numbers:arr
          })
    this.storeScore()
    return change
  },
  //右滑
  mergeright: function(){
    var change = false
    var arr = this.data.numbers;
    
    for(var i = 0; i < 4; i++){
      //merge first
      for(var j = 3; j > 0; j--){
        if(arr[i][j] == 0) continue;
        for(var k = 1; k <= j; k++){
          if(arr[i][j] != 0 && arr[i][j-k] != 0){
            if(arr[i][j] != arr[i][j-k]) break;
            arr[i][j] = arr[i][j] *2;
            arr[i][j-k] = 0;
            change = true;
            this.setData({
            score: this.data.score + arr[i][j]/2
            })
            break;
          }
        }
      }
      //movemove
      for(var j = 3; j > 0; j--){
        if(arr[i][j] == 0){
          for(var k = 1; k <= j; k++){
            if(arr[i][j-k] != 0){
              arr[i][j] = arr[i][j-k];
              arr[i][j-k] = 0;
              change = true;
              break;
            }
          }
        }
      }
    }
    this.setData({
          numbers:arr
          })
    this.storeScore()
    return change
  },
  //下划
  mergebottom: function(){
    var change = false
    var arr = this.data.numbers;
    
    for(var i = 0; i < 4; i++){
      //merge first
      for(var j = 3; j > 0; j--){
        if(arr[j][i] == 0) continue;
        for(var k = 1; k <= j; k++){
          if(arr[j][i] != 0 && arr[j-k][i] != 0){
            if(arr[j][i] != arr[j-k][i]) break;
            arr[j][i] = arr[j][i] *2;
            arr[j-k][i] = 0;
            change = true
            this.setData({
            score: this.data.score + arr[j][i]/2
            })
            break;
          }
        }
      }
      //movemove
      for(var j = 3; j > 0; j--){
        if(arr[j][i] == 0){
          for(var k = 1; k <= j; k++){
            if(arr[j-k][i] != 0){
              arr[j][i] = arr[j-k][i];
              arr[j-k][i] = 0;
              change = true
              break;
            }
          }
        }
      }
    }
    this.setData({
          numbers:arr
          })
    this.storeScore()
    return change
  },
  //上滑
  mergetop: function(){
    var change = false
    var arr = this.data.numbers;
    
    for(var i = 0; i < 4; i++){
      //merge first
      for(var j = 0; j < 3; j++){
        if(arr[j][i] == 0) continue;
        for(var k = 1; k < 4-j; k++){
          if(arr[j][i] != 0 && arr[j+k][i] != 0){
            if(arr[j][i] != arr[j+k][i]) break;
            arr[j][i] = arr[j][i] *2;
            arr[j+k][i] = 0;
            change = true
            this.setData({
            score: this.data.score + arr[j][i]/2
            })
            break;
          }
        }
      }
      //movemove
      for(var j = 0; j < 3; j++){
        if(arr[j][i] == 0){
          for(var k = 1; k < 4-j; k++){
            if(arr[j+k][i] != 0){
              arr[j][i] = arr[j+k][i];
              arr[j+k][i] = 0;
              change = true
              break;
            }
          }
        }
      }
    }
    this.setData({
          numbers:arr
          })
    this.storeScore()
    return change
  },
  //随机插入
  randInsert: function(){
    //已有的数据列表
    var arr = this.data.numbers
    //随机2或4，2的概率80%
    var num = Math.random() < 0.8 ? 2 : 4
    //计算随机位置
    var zeros = [];
    for(var i = 0; i < 4; i++){
      for(var j = 0; j < 4; j++){
        if(arr[i][j] == 0){
          //如果这个坐标还没有数字，则保存坐标
            zeros.push([i, j]);
        }
      }
    }
    //在无内容数组 随机坐标
    var pst = zeros[Math.floor(Math.random() * zeros.length)];
    //插入随机生成的数据
    arr[pst[0]][pst[1]] = num
    this.setData({
      numbers:arr
      })
    //this.checkGame()
  },
  //检查游戏状态
  checkGame: function(){
    var arr = this.data.numbers
    //还有空位
    for(var i = 0; i < 4; i++){
      for(var j = 0; j < 4; j++){
        if(arr[i][j] == 0) return;
      }
    }
    //相邻横竖方向还有合并的相同值，但是没有考虑最后一行 无相邻行
    for(var i = 0; i < 3; i++){
      for(var j = 0; j < 3; j++){
        if(arr[i][j] == arr[i+1][j] || arr[i][j] == arr[i][j+1]) return;
      }
    }
    ////最后一行 或者一列 只判断最后一个的   
    for(var j = 0; j < 3; j++){
      if(arr[3][j] == arr[3][j+1]) return;
      if(arr[j][3] == arr[j+1][3]) return;
    }
    //游戏结束
    this.setData({
      modalHidden: false,
    })
  },
  //从来重置
  modalChange:function(){
    this.setData({
      score: 0,
      numbers: defaultNumbers,
      modalHidden: true,
    })
  },
  modalCancle:function(){
    this.setData({
      modalHidden: true,
    })
  }
})
