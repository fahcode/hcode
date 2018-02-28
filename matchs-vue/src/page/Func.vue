<template>
<div class="view func" >
    <ul class="fc_btns">
        <li v-for="item in menu" ><a href="javascript:;" @click="goRouter(item.link, item.state)">
            <p class="img"><img :src="item.img" :alt="item.title"></p>
            <p>{{item.title}}</p>
        </a></li>
    </ul>
    <div class="fc_content">
        <div class="hbox">
            <transition name="moveRightIn">
            <div class="fc_task" v-show="content_active=='task'">
                <img v-show="false" :src="giftImg" alt="" class="mapimg">
                <p class="ti">任务进度</p>
                <div class="plan"><p :style="{'width': taskplan + '%'}"></p></div>
                <div class="fc_box">
                    <ul>
                        <li v-for="item in giftList">
                            <p v-text="item.title"></p>
                            <span v-text="item.desc"></span>
                            <button :class="init_taskState(item.state, item.type).class" @click="getGift(item.type, init_taskState(item.state, item.type).class)">{{init_taskState(item.state, item.type).text}}</button>
                        </li>
                    </ul>
                </div>
            </div>
            </transition>

            <transition name="moveRightIn">
            <div class="fc_logs" v-show="content_active=='logs'">
                <p class="ti">领奖记录</p>
                <ul class="ft_list_tits">
                    <li class="w1">日期</li>
                    <li class="w2">礼包类型</li>
                    <li class="w3">礼包兑换码</li>
                </ul>
                <div class="ft_list">
                    <table>
                        <tr v-for="item in logs">
                            <td class="w1"><span v-text="item.datetime"></span></td>
                            <td class="w2"><span v-text="item.type"></span></td>
                            <td class="w3"><span v-text="item.card"></span></td>
                        </tr>
                        
                    </table>
                </div>
            </div>
            </transition>
        </div>
        <div class="fc_tag_btns" v-show="false">
        <!-- <div class="fc_tag_btns" v-show="giftList.length>0"> -->
            <button class="fc_taskbtn" :class="{'on': content_active=='task'}" @click="toggle(1)">观赛有礼</button>
            <button class="fc_logbtn" :class="{'on': content_active=='logs'}" @click="toggle(2)">领奖记录</button>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { MFetch, menuList, prizeState, prizeShare, prizeTenminute, prizeThirtyminute, prizeList } from '../service/getData'

export default {
  	name: 'Func',
  	data(){
    	return {
            dfmatch: {},
            content_active: 'logs',
            menu: [],

            giftImg: "",
            giftList: [],
            taskState1: {},
            taskState2: {},
            taskState3: {},
            taskplan: 0,
            logs: []
        }
  	},
    computed: {
        ...mapState(['matchs'])
    },
  	methods: {
        defaultMatch: function(){
            this.dfmatch = this.matchs.length>0? this.matchs[0]: {};
        },
        toggle: function(type){
            this.content_active = type == 1? "task": "logs";
        },
        //领取奖励
        getGift(type, state){
            var self = this;

            if(state == 'end'){alert('礼包已经领取了！'); return false;}
            if(state == 'off'){alert('未完成，赶紧去完成任务吧！'); return false;}
            if(state == 'fx'){
                //显示分享
                this._toggle({
                    key: 'funcPops',
                    val: {sharePop: true}
                })
                return false;
            }
            if(type == 'ten'){
                //获取奖励
                prizeTenminute().then(res =>{
                    if(res.ret == 1){
                        this._toggle({
                            key: 'funcPops',
                            val: {giftPop: true, card: res.data.card}
                        });
                        self.getPrizeState();
                    }else{
                        alert(res.msg)
                    }
                })
            }else if(type == 'thirty'){
                //获取奖励
                prizeThirtyminute().then(res =>{
                    if(res.ret == 1){
                        this._toggle({
                            key: 'funcPops',
                            val: {giftPop: true, card: res.data.card}
                        });
                        self.getPrizeState();
                    }else{
                        alert(res.msg)
                    }
                })
            }else if(type == 'share'){
                //获取分享奖励
                prizeShare().then(res =>{
                    if(res.ret == 1){
                        this._toggle({
                            key: 'funcPops',
                            val: {giftPop: true, card: res.data.card}
                        });
                        self.getPrizeState();
                    }else{
                        alert(res.msg)
                    }
                })
            };

        },
        //处理按钮逻辑
        init_taskState(val, key){
            if(val == 0 && key=='share'){
                return {class: 'fx', text: '分享'}
            }else if(val == 2){
                return {class: 'end', text: '已领取'}
            }else if(val == 1){
                return {class: 'on', text: '未领取'}
            }else{
                return {class: 'off', text: '未完成'}
            }
        },
        goRouter: function(link, txt){
            if(link == 'javascript' && txt!=''){
                alert(txt);
                
                return false;
            };
            /////控制跳转的路由
            let _link = link.replace(/\/id/g, '/' + this.dfmatch.id);
            this.$router.push(_link);

            this._toggle({
                key: 'func',
                val: 'moveRightIn'
            })
        },
        //////获取个人每日奖励状态
        getPrizeState: function(){
            var self = this;
            //获取个人每日奖励状态
            prizeState().then(res =>{
                if(res.ret == 1){
                    let data = res.data,
                        list = !!data.list? data.list: [],
                        img = !!data.img? data.img.img: "",
                        plan = 0;
                    this.giftList = list;
                    this.giftImg = img;

                    /*self.taskState1 = this.init_taskState(data.tenMinuteState, 'tenMinuteState');
                    self.taskState2 = this.init_taskState(data.thirtyMinuteState, 'thirtyMinuteState');
                    self.taskState3 = this.init_taskState(data.shareLogState, 'shareLogState');*/
                    ////////判断进度
                    for(let x in list){
                        if(list[x].state != 0) plan++;
                    }
                    this.taskplan = plan/(list.length) * 100;
                }else{
                    alert(res.msg)
                }
            });
            //获取领奖记录 
            prizeList().then(res =>{
                if(res.ret == 1){
                    let data = res.data;
                    this.logs = data;
                }else{
                    alert(res.msg)
                }
            });
        },
        ...mapActions(['_toggle'])
    },
    props: ['state'],
    //mounted(){
    created(){
        var self = this;
        this.defaultMatch();
        /////获取菜单
        menuList().then(res =>{
            if(res.ret == 1){
                self.menu = res.data;
            }else{
                alert(res.msg)
            }
        })
        //获取个人每日奖励状态
        self.getPrizeState();
        
    },
    watch: {
        'matchs': ['defaultMatch']
    }
}
</script>