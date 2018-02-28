import fetch from '../config/fetch'

//赛事直播地址   
export const living = () => fetch('/match/index.php?c=living&f=info');

//个人页菜单
export const menuList = () => fetch('/match/index.php?c=menu&f=list');

//获取个人每日奖励状态
export const prizeState = () => fetch('/match/index.php?c=prize&f=state');
//完成任务，获取分享奖励
export const prizeShare = () => fetch('/match/index.php?c=prize&f=share');
//完成任务，获取在线10分钟奖励
export const prizeTenminute = () => fetch('/match/index.php?c=prize&f=tenminute');
//完成任务，获取在线30分钟奖励 
export const prizeThirtyminute = () => fetch('/match/index.php?c=prize&f=thirtyminute');
//完成分享任务的回调   
export const finishshare = () => fetch('/match/index.php?c=prize&f=finishshare');

//获取领奖记录 
export const prizeList = () => fetch('/match/index.php?c=prize&f=list');

//轮播图 
export const newsBanner = () => fetch('/match/index.php?c=banner&f=newsbanner');

//赛事 ，标题，后续几个都依赖这个数据
export const matchList = () => fetch('/match/index.php?c=match&f=list');

//获取新闻资讯列表  
export const newsList = (page) => fetch('/match/index.php?c=news&f=list&page=' + page);

//获取新闻详细   
export const newsDetail = (nid) => fetch('/match/index.php?c=news&f=detail&id=' + nid);

//赛程图列表    
export const competitionImg = (mid) => fetch('/match/index.php?c=competition&f=img&matchid=' + mid);

//获取视频列表    
export const videosList = (mid, page) => fetch('/match/index.php?c=videos&f=list&matchid=' + mid + '&page=' + page);
//记录视频播放次数    
export const videosNum = (vid) => fetch('/match/index.php?c=videos&f=num&id=' + vid );

//获取战队列表     
export const teamList = (mid) => fetch('/match/index.php?c=team&f=list&matchid=' + mid );

//获取战队详细     
export const teamDetail = (mid) => fetch('/match/index.php?c=team&f=detail&id=' + mid );

//赛事介绍      
export const descInfo = (mid) => fetch('/match/index.php?c=desc&f=info&matchid=' + mid );





export const MFetch = (url, type, dataType, data,  errcallback) => {
	fetch(url, type, dataType, data,  errcallback);
}