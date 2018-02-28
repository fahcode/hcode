<template>
<div class="view News">
	<div class="box infinite-scroll"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="30"
        infinite-scroll-immediate-check="false"
    >
		<ul>
			<li v-for="item in newsList" :key="item.id">
				<div class="img"><img :src="item.img" :alt="item.title"></div>
				<div class="if">
					<p class="ti" v-text="item.title"></p>
					<span class="tm" v-text="item.publishdate"></span>
					<span class="xin"><i class="ic xin_ic"></i>{{item.clicknum}}</span>
				</div>
				<buttom :to="'/ndetail/'+ item.id" class="link" @click="detail(item.id)"></buttom>
			</li>
		</ul>
        <p class="page-infinite-loading" v-show="loading">
            <span><mt-spinner type="fading-circle" color="#26a2ff" size="16" class="icon"></mt-spinner></span>
            <span>加载中...</span>
        </p>
	</div>
    <transition name="fadeBigInLeftOut">
    <view-pop v-if="ndetail_active" :ndata="ndata"/>
    </transition>
</div>

</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { Indicator } from 'mint-ui';

import { newsList, newsDetail } from '../service/getData'
import viewPop from '../components/viewPop.vue'
import CONFIG from '../config/config'
import wsConnection from '../assets/js/WebSocket'
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);

export default {
  	name: 'News',
  	data(){
  		return {
  			loading: false,
  			newsList: [],
            page: 1,
            //无更多 或者清楚错误后的锁
            lock: false,
            ndata: {}
  		}
  	},
    computed: {
        ...mapState(['ndetail_active'])
    },
  	methods: {
  		loadMore: function(){
            //显示加载的动画
  			this.loading = true;

            if(!this.lock){
                this.page++;
                this.getNewsList(this.page);
            }
  		},
  		detail: function(id){
            /////请求内容
            Indicator.open('Loading...');
            //获取轮播图
            newsDetail(id).then(res =>{
                if(res.ret == 1){
                    let data = res.data;
                    this.ndata = data;
                }else{
                    this.lock = true;
                    alert(res.msg);
                };
            })
  			//显示弹窗页面
            this._toggle({
                key: 'newsDetail',
                val: true
            })
  		},
        getNewsList(page){
            let _page = !!page? page: 1;
            //获取轮播图
            newsList(_page).then(res =>{
                if(res.ret == 1){
                    let data = res.data;
                    this.newsList = this.newsList.concat(data);
                }else{
                    this.lock = true;
                    alert(res.msg);
                };

                this.loading = false;
            })
        },
  		...mapActions(['_toggle'])
  	},
  	created: function () {
        this.getNewsList();
    },
    mounted: function(){
        //连接Socket
        connectWS();
        function connectWS(){
            try{
                wsConnection(CONFIG.WebSocketUrl).then(wsSocket =>{
                    wsSocket.onerror = wsError;
                    function wsError(event) {
                        console.log(event)
                        //重新连接
                        connectWS();
                    }
                })
            }catch(msg){
                console.log(msg)
            }
        }
    },
    //引入的模块
    components: {
        viewPop: viewPop
    },
}
</script>