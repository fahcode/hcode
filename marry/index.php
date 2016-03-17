<?php
require_once "config.php";
connect();
$sql="select uid from ".DB_TABLE;
$row = fechOne($sql);
?>
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8">
    <title>黄发辉&amp;杨丽婷 结婚请柬</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <meta name="keywords" content="我们结婚啦" />
    <meta name="description" content="我们结婚啦" />
    <meta name="msapplication-tap-highlight" content="no">
    <!-- 去掉移动端浏览器会在超链接元素被触摸（tap）的时候显示一个半透明的高亮背景 -->
    <!-- 启用 WebApp 全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes" /> 
    <meta name="x5-orientation" content="portrait">
    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes">
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true">
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application">
    <!--  QQ应用模式 -->
    <meta name="x5-page-mode" content="app">
    <!-- 删除默认的苹果工具栏和菜单栏。 -->
    <link rel="stylesheet" type="text/css" href="css/animate.min.css"/>
    <link rel="stylesheet" type="text/css" href="css/index.css"/>
    <script type="text/javascript" src="js/zepto.min.js"></script>
    <script type="text/javascript" src="js/swiper-3.2.7.jquery.min.js"></script>
</head>
<body>
<script type="text/javascript">
    //全局字体rem
    (function (size){
        function fn(){
        var win_w = parseInt(document.body.clientWidth);
        win_w = (win_w>size)?640:win_w;
        var win_h = parseInt(document.body.clientHeight),
            html = document.getElementsByTagName('html')[0],
            //获取初始的fontsize,16为比例标准
            originalSize = parseInt((window.getComputedStyle(document.documentElement,null)).fontSize),
            zoom=(win_w / size) / (originalSize/16) * 100;
            html.style.fontSize = zoom + 'px';
        };
        fn();
        window.onorientationchange = function(){
            fn();
        }
    })(640);
</script>
<div style="display:none"><img src="http://www.huangfahui.com/marry/img/share.jpg" alt="分享显示的封面"/></div>
<!-- 通过定位来获取高度(可避免大多数的工具栏影响) -->
<div class="testHei"><div class="winHei" id="winHei"></div></div>
<div class="main setWinHei ">
    <!-- 加载页面 -->
    <div class="loading pa tst" id="loading">
       <div class="spinner">
            <div class="planValue" id="planValue">0%</div>
          <div class="spinner-container container1">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container2">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container3">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
        </div>
    </div>
    <!-- 信函层 -->
    <div class="letter pa anim3D" id="letter">
        <div class="Tit pa ot0"></div>
        <div class="letterBox pa ot0">
            <!-- 翻页背景 -->
            <div class="ImgBg pa part8 ot0"></div>
            <div class="ImgBg pa part1"></div>
            <div class="ImgBg pa part2" ></div>
            <!-- 信封面 -->
            <div class="ImgBg pa part7 "></div>
            <div class="ImgBg pa part3 tfo50"></div>
            <div class="ImgBg pa part4 tfo51 ot0" id="seeLetter"></div>
            <!-- 两个喜字 -->
            <div class=" pa part5" id="openLetterBox">
                <div class="ImgBg xih pa tfo55 xiAnim"></div>
                <div class="ImgBg xis pa"></div>
            </div>
            <div class="ImgBg pa part6 ot0"></div>
        </div>
    </div>
    <div class="play swiper-container" id="play">
        <div class="doUp touchdown"></div>
        <div class="swiper-wrapper">
        <!-- 信内容 包括邀请你来-->
        <div class="column letterTxt swiper-slide">
            <div class="txtBg pa">
                <div class="starList">
                    <div class="star s1 pa ot0"></div>
                    <div class="star s2 pa ot0"></div>
                    <div class="star s3 pa ot0"></div>
                </div>
                <div class="txt1 ot0"></div>
                <div class="txt2 ot0"></div>
                <div class="coupleImg ot0"></div>
                <div class="txt3 ot0">邀请您</div>
                <div class="invite ot0"></div>
            </div>
        </div>
        <!-- 图片展示1 -->
        <div class="column marryImg1 anim3D swiper-slide" >
                <!-- showWife -->
            <div class="targetBox " id="switchCouple">
                <div class="couple img1"></div>
                <div class="couple img2"></div>
                <div class="txt1 pa"></div>
                <div class="bkbg b1"></div>
                <div class="bkbg b2"></div>
            </div>
        </div>
        <!-- 图片展示2 -->
        <div class="column marryImg2 anim3D swiper-slide" >
            <div class="coupleImgList pa" id="switchImg">
                <div class="coupleImg img1 rotate1 pa"></div>
                <div class="coupleImg img2 rotate2 pa"></div>
                <div class="coupleImg img3 rotate3 pa"></div>
                <div class="coupleImg img3 rotate3 pa"></div>
                <div class="coupleImg img3 rotate3 pa"></div>
                <div class="coupleImg img3 rotate3 pa"></div>
                <div class="coupleImg rotate3 pa"></div>
                <div class="coupleImg rotate3 pa"></div>
                <div class="coupleImg rotate3 pa"></div>
                <div class="coupleImg rotate3 pa"></div>
            </div>
            <div class="pulley pa">
                <div class="axle pa"></div>
                <div class="point pa w1" id="point"></div>
            </div>
            <div class="txt1 pa ot0"></div>
            <div class="txt2 pa ot0"></div>
        </div>
        <!-- 时间 -->
        <div class="column marryTime swiper-slide">
            <div class="timeBox pa">
                <div class="month pa ot0">3月</div>
                <div class="year pa ot0">2016&nbsp;&nbsp;March</div>
                <div class="hour pa ot0">正月廿三&nbsp;09:00</div>
                <ul class="dayList">
                    <li class="item marry">
                        <div class="t"><span>1</span><span>周二</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>2</span><span>周三</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>3</span><span>周四</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>4</span><span>周五</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>5</span><span>周六</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>6</span><span>周日</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>7</span><span>周一</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>8</span><span>周二</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>9</span><span>周三</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>10</span><span>周四</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>11</span><span>周五</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>12</span><span>周六</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>13</span><span>周日</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>14</span><span>周一</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>15</span><span>周二</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>16</span><span>周三</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>17</span><span>周四</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>18</span><span>周五</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>19</span><span>周六</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>20</span><span>周日</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>21</span><span>周一</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>22</span><span>周二</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>23</span><span>周三</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>24</span><span>周四</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>25</span><span>周五</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>26</span><span>周六</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>27</span><span>周日</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>28</span><span>周一</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>29</span><span>周二</span></div>
                    </li>
                    <li class="item">
                        <div class="t"><span>30</span><span>周三</span></div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 交通路线 -->
        <div class="column route swiper-slide">
            <div class="routeBox pa">
                <div class="tit pa ot0">您可以参考交通方案哦！</div>
                <div class="txt pa ot0">期待您的到来</div>
                <div class="times pa ot0">2016.03.01</div>
                <div class="option pa ot0">
                    <dl>
                        <dt>始发地：</dt>
                        <dd>
                            <select id="isAudit">
                              <option value="sh" selected="selected">上海</option>
                              <option value="hz">杭州</option>
                              <option value="yw">义乌</option>
                              <option value="sz">深圳</option>
                              <option value="lj">老家婚宴</option>
                            </select>
                        </dd>
                    </dl>
                </div>
                <div class="result ot0">
                    <div class="box">
                    <div class="goal">江西省赣州市寻乌县澄江镇北亭村<div class="tt">(29号10:30到达瑞金火车站会有车接)</div></div>
                        <div class="tit">出发方案：</div>
                        <div class="goWay" id="goWay">
                            <table border="1" cellspacing="0" align="center">
                            <tbody id="goWayBox">
                                <tr class="h">
                                    <td class="td1">车次</td>
                                    <td class="td1">出发站<br>到达站</td>
                                    <td class="td1">出发时间<br>到达时间</td>
                                    <td class="td1">备注</td>
                                </tr>
                                <!-- <tr class="c">
                                    <td>K469</td>
                                    <td>
                                    <div>上海南</div>
                                    <div class="end-s">赣州</div>
                                    </td>
                                    <td><div>02-28/17:20</div><div class="end-t">02-29/08:28</div></td>
                                    <td>历时15:08</td>
                                </tr> -->
                                
                            </tbody>
                            </table>
                        </div>
                        <div class="tit">返回方案：</div>
                        <div class="backWay" id="backWay">
                            <table border="1" cellspacing="0" align="center">
                            <tbody id="backWayBox">
                                <tr class="h">
                                    <td class="td1">车次</td>
                                    <td class="td1">出发站<br>到达站</td>
                                    <td class="td1">出发时间<br>到达时间</td>
                                    <td class="td1">备注</td>
                                </tr>
                                
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 祝福和期待到来 -->
        <div class="column liveWish swiper-slide">
            <div class="live pa">
                <div class="groom pa ot0"></div>
                <div class="bride pa ot0"></div>
            </div>
            <div class="txtBox pa">
                <div class="txtB l ot0">因为爱</div>
                <div class="txtB r ot0">见证爱</div>
                <div class="txtC ot0">
                    <div class="txt ">那一天，我们相识</div>
                    <div class="txt ">走过了风风雨雨的三年</div>
                    <div class="txt ">两颗小小的心从此被系在一起</div>
                    <div class="txt ">在这个美丽的日子</div>
                    <div class="txt ">我们决定让幸福延续</div>
                    <div class="txt ">期待我们的婚礼，有你们的见证</div>
                </div>
                <!-- 祝福 -->
                <div class="Wish">
                    <a href="javascript:;" id="WishLive" class="WishLive ot0 "></a>
                    <div class="txt ot0">已经收到<span id="WishVal"><?php echo $row['uid']; ?></span>个祝福，谢谢您的祝福</div>
                </div>
            </div>
            
        </div>
        </div>
    </div>
    <div class="music musicAnim" id="closeMusic" datas="1">
        <!--背景音乐-->
        <audio id="audioBg" src="music/bg.mp3" preload="preload" autoplay="autoplay" loop="loop"></audio>
    </div>
</div>

<script type="text/javascript" src="js/global.min.js"></script>
<script>

</script>

</body>
</html>