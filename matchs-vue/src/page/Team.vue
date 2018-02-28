<template>
<div class="view Team">
	<div class="box">
		<p class="tit">战队</p>
		<div class="wrap">
            <div class="box infinite-scroll">
    			<ul>
    				<li v-for="item in teamList">
    					<div class="img"><img :src="item.img" :alt="item.name"></div>
    					<p class="tx" v-text="item.name"></p>
    					<router-link class="link" :to="'/tdetail/'+mid+ '/' +item.id" />
    				</li>
    			</ul>
                <p class="page-infinite-loading" v-show="loading">
                    <span><mt-spinner type="fading-circle" color="#26a2ff" size="16" class="icon"></mt-spinner></span>
                    <span>加载中...</span>
                </p>
            </div>
		</div>
	</div>
</div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { teamList } from '../service/getData'
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);

export default {
  	name: 'Team',
  	data(){
      return {
            mid: 0,
            loading: false,
            teamList: [],
            page: 1,
            //无更多 或者清楚错误后的锁
            lock: false
      }
    },
    computed: {},
    methods: {
      loadMore: function(){
            //显示加载的动画
            this.loading = true;
            if(!this.lock){
                this.page++;
                this.getList(this.page, true);
            }
        },
        getList(page, nocler){
            var self = this;
            let id = this.mid = this.$route.params.mid;
            let _page = !!page? page: 1;
            //只有滚动加载才会不清空
            if(typeof nocler != 'boolean') self.teamList = [];
            //获取轮播图
            teamList(id, _page).then(res =>{
                if(res.ret == 1){
                    let data = res.data;
                    self.teamList = self.teamList.concat(data);
                }else{
                    self.lock = true;
                    alert(res.msg);
                };

                this.loading = false;
            })
        }
    },
    created: function () {
        this.mid = this.$route.params.mid;

        this.getList();
    },
    watch: {
        '$route': ['getList']
    },
}
</script>