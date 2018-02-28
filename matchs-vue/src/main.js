// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './vuex'

//import './config/rem'
import './assets/js/main'
/////公共依赖
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(Mint);
//样式
import './assets/css/index.scss'

//////自定义的页面模块
import App from './App.vue'

Vue.config.productionTip = false

window.alert = function(msg){
	Mint.MessageBox(msg);
}
window.isdev = false;
///////////判断coockie是否存在，不存在则跳转
if(!!!_Tool.selectCookie('jl_act_match_cookie_userinfo') && !window.isdev){
	window.location.href = 'http://act.jl.ztgame.com/match/indexforwechat.php';
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
