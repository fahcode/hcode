function ggkCanvas(canvas,imgUlr,type,rangeId,drawSize,tips,ifTxt,nameArr){//canvas dom,图片url,是否写入文字，名字数组
        var bodyStyle = document.body.style;
        (document.getElementsByTagName('body')[0]).setAttribute('root','root');
        var datas; //存放像素点
        bodyStyle.mozUserSelect = 'none';
        bodyStyle.webkitUserSelect = 'none';
        var w = canvas.width,h = canvas.height;

        //通过ifTxt判断是否写入文字
        canvas.style.zIndex = 999;
        var newCanvas  = canvas.cloneNode(true);//var newCanvas  = document.createElement('canvas');
        newCanvas.style.cssText = "z-index:900;";
        newCanvas.setAttribute('id','txtCanvas');
        canvas.parentNode.appendChild(newCanvas);
        var txtCanvas = newCanvas;

        var colors = ['#f00','#000','#ccc','#fe9d01','#049ff1','#ff6600','#43a102','#55a255','#2ec8e9'];

		var num = 0,bb = 0;//记数rgba为0的像素点
        var img = new Image();
        img.src = imgUlr;
        
        var ctx = canvas.getContext('2d');
        var ctxT = txtCanvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        ctxT.clearRect(0, 0, w, h);


        img.addEventListener('load', function(e) {
            var Elements = canvas,
                allLeft = parseInt(canvas.offsetLeft),
                allTop = parseInt(canvas.offsetTop);
            while(Elements.getAttribute('root') != 'root'){//(Elements.indexOf("BodyElement")) == -1
                Elements = Elements.parentNode;
                allLeft = allLeft + parseInt(Elements.offsetLeft);
                allTop = allTop + parseInt(Elements.offsetTop);
            }
            var offsetX = allLeft,
                offsetY = allTop;
            var mousedown = false;

            //把图片做背景
            canvas.style.backgroundColor='transparent';
            txtCanvas.style.backgroundColor='transparent';
            txtCanvas.style.backgroundImage='url('+img.src+')';
            txtCanvas.style.backgroundPosition='center center';
            txtCanvas.style.backgroundRepeat='no-repeat';
            txtCanvas.style.backgroundSize='auto 100%';
            
            //写入文字
            if(ifTxt){
                editTxt(ctxT);
            }

            ctx.fillStyle='transparent';
            ctx.fillRect(0, 0, w, h);

            layer(ctx);//绘制遮罩层

            canvas.addEventListener('touchstart', eventDown);
            canvas.addEventListener('touchend', eventUp);
            canvas.addEventListener('touchmove', eventMove);
            canvas.addEventListener('mousedown', eventDown);
            canvas.addEventListener('mouseup', eventUp);
            canvas.addEventListener('mousemove', eventMove);



            function layer(ctx) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = 'gray'//'gray';
                ctx.fillRect(0, 0, w, h);
            }

            function eventDown(e){
                e.preventDefault();
                mousedown=true;
            }

            function eventUp(e){
                e.preventDefault();
                mousedown=false;
                judgeResult();
            }
            //判断是否刮完
            function judgeResult(){
                num = 0;//每次移动重置计数
                datas = ctx.getImageData(0,0,w,h);//获取此时的像素情况
                for(var i = 0;i<datas.data.length;i++){
                    datas.data[i]
                    if(datas.data[i] == 0){
                      num++;
                    }
                }
                if(num >= parseInt(datas.data.length * 0.4) ){
                    mousedown=false;
                    //重置绘图
                    ctx.save();
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.fillStyle='transparent';
                    ctx.fillRect(0,0,w,h);
                    ctx.restore();
                    setTimeout(function(){
                        //console.log(newCanvas);
                        if(tips != null){
                            canvas.parentNode.removeChild(newCanvas);
                            getspggk();
                        }else{
                            canvas.parentNode.removeChild(newCanvas);//删除canvas底层
                            (canvas.parentNode).style.display = 'none';
                            bodyStyle.overflowY = 'visible';//还原垂直滚动
                            document.body.removeChild( (document.getElementById('zz')) );//删除遮罩层
                            doggkResult(type,rangeId);//去获取结果
                        }
                    },1000);
                }
            }
            //写入文字
            function editTxt(ctxT){
                var txtX,txtY,fontsize,Tlen = nameArr.length;//随机的 x,y，颜色
                //console.log(Tlen);
                for(var i = 0;i < Tlen;i++){
                    txtX = (Math.floor(Math.random()*(w/2-10)+10)),txtY = (Math.floor(Math.random()*(h-10)+10)),fontsize = (Math.floor(Math.random()*30+10));
                    ctxT.save();
                    ctxT.globalCompositeOperation = 'source-over';
                    ctxT.font = '22px 黑体';//文字大小样式
                    ctxT.textAlign = 'center';//居中
                    ctxT.fillStyle = '#fff';//colors[parseInt((colors.length)*Math.random())];
                    //ctxT.transform(1,Math.random(),0,1,0,0);//矩阵变换
                    ctxT.fillText(nameArr[i],w/2,(h/(Tlen+1))*(i+1),w);
                    ctxT.restore();
                }
            }

            function eventMove(e){
                e = e || window.event;
                e.preventDefault();
                if(mousedown) {
                    //判断是否为触摸事件
                    if(e.changedTouches){
                        e=e.changedTouches[e.changedTouches.length-1];
                    }

                    var x = e.pageX - offsetX,
                        y = e.pageY - offsetY;
                    with(ctx) {
                        ctx.save()
                        beginPath();
                        ctx.globalCompositeOperation = 'destination-out';//destination-out
                        arc(x, y, drawSize, 0, Math.PI * 2);
                        fill();
                        bb++;//计数小球
                        //console.log('小球数：' + bb);
						closePath();
                        ctx.restore();
                    }
                }
            }

        });
    }