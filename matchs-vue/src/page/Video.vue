<template>
<div class="view Video">
	<div class="box infinite-scroll"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="30"
        infinite-scroll-immediate-check="false"
    >
		<ul>
			<li v-for="item in videoList" :key="item.id">
				<div class="img"><img :src="item.img" :alt="item.title"></div>
				<div class="if">
					<p class="ti" v-text="item.title"></p>
					<span class="tm" v-text="item.datetime"></span>
					<span class="num"><i class="ic video_ic2"></i>{{item.clicknum}}</span>
				</div>
				<a href="javascript:;" class="link" @click="openVideo(item.link, item.id)"></a>
			</li>
		</ul>
        <p class="page-infinite-loading" v-show="loading">
            <span><mt-spinner type="fading-circle" color="#26a2ff" size="16" class="icon"></mt-spinner></span>
            <span>加载中...</span>
        </p>
	</div>
    <transition name="fadeShrinkIn">
    <video-pop v-if="video_active" :vdata="vdata"/>
    </transition>
</div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { videosList, videosNum } from '../service/getData'
import videoPop from '../components/videoPop.vue'
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);

export default {
  	name: 'Video',
  	data(){
  		return {
            mid: 0,
  			loading: false,
  			videoList: [],
            page: 1,
            //无更多 或者清楚错误后的锁
            lock: false,

            vdata: ''
  		}
  	},
    computed: {
        ...mapState(['video_active'])
    },
  	methods: {
  		loadMore(){
            //显示加载的动画
            this.loading = true;

            if(!this.lock){
                this.page++;
                this.getVideoList(this.page, true);
            }
        },
        getVideoList(page, nocler){
            let mid = this.mid = this.$route.params.mid;
            let _page = !!page? page: 1;

            //只有滚动加载才会不清空
            if(typeof nocler != 'boolean') self.videoList = [];
            //获取轮播图
            videosList(mid, _page).then(res =>{
                if(res.ret == 1){
                    let data = res.data;
                    this.videoList = this.videoList.concat(data);
                }else{
                    this.lock = true;
                    alert(res.msg);
                };

                this.loading = false;
            })
        },
        openVideo(link, id){
            //播放视频
            this.vdata = link;
            this._toggle({
                key: 'video',
                val: true
            })
            //记录视频播放次数
            videosNum(id).then(function(res){
                console.log(res)
            },function(msg){
                alert(res.msg);
            })
        },
  		...mapActions(['_toggle'])
  	},
  	created: function () {
        this.mid = this.$route.params.mid;

        this.getVideoList();
    },
    destroyed: function(){
        this._toggle({
            key: 'video',
            val: false
        })
    },
    watch: {
        '$route': ['getVideoList']
    },
    //引入的模块
    components: {
        videoPop: videoPop
    }
}
</script>