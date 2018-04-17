<template>
  <div class="musicvideo" ref="scroll">
    <div v-if="mvList.length>0" class="slider" >
      <div class="scroll-content">
        <div class="v-wrap" v-for="item in mvList">
        <div class="v-content">
          <div class="h5_pre" v-show="!item.isShow" @click="opeMv(item,$event)">
            <img v-lazy="item.cover" alt="">
            <i class="i-btn iconfont icon-bofang1"></i>
          </div>
          <div class="h5_disp" @click="tooglePlay()"  v-show="item.isShow">
            <video  @timeupdate="updateTime" ref="videos"  v-if="item.mv" :data-orgin="'http://musicapi.leanapp.cn/mv/url?url='+item.mv.brs['480']"  :src="'http://musicapi.leanapp.cn/mv/url?url='+item.mv.brs['480']">
            </video>
            <!--提示总时间-->
            <div class="v-dtime">{{zeroDtime}}</div>
            <!--进度条-->
            <div class="bar-wrap">
                <div class="bar" :style="{width:calcBar+'px'}"></div>
            </div>
            <!--操作按钮-->
            <div class="v-btn iconfont" v-show="isBtnShow" :class="play?'icon-bofang':'icon-bofang1'"></div>
          </div>
        </div>
        <div class="text">
          <div class="play-count iconfont icon-icon-1">{{item.playCount}}次播放</div>
          <p class="brief-desc">{{item.name}}-{{item.briefDesc}}</p>
        </div>
      </div>
        <transition  name="fade">
          <div class="pullup-wrapper" v-show="!isPullUp">
            <span>在下加载中...</span>
          </div>
        </transition>
      </div>
    </div>
    <div  v-else class="loading">
      <Loading ></Loading>
    </div>
  </div>
</template>

<script>
  import {getRmv,getDetailedsMv} from 'api/mv'
  import {ERR_OK} from 'api/config'
  import BScroll from 'better-scroll'
  import {zero} from 'common/js/zero'
  import Loading from 'components/loading'

  const barWidth = window.screen.width;

  export default {
    components:{
      Loading
    },
     data(){
       return {
         mvList:[],
         dtdMv:{},
         status:false,
         play:false,
         isBtnShow:false,
         currentTime:0,
         duration:0,
         page:10,
         isPullUp:true
       }
     },
    activated(){
       this._getRmv(this.page);
     },
    deactivated(){
      this.mvList = [];
    },
    mounted(){
      this.initScroll()
    },
    watch:{
      mvList(){
        setTimeout(() => {
          this.Bscroll.refresh();
        },20)
      }
    },
    computed:{
       calcBar(){
         return barWidth * this.currentTime / this.duration;
       },
       zeroDtime(){
        return zero(this.duration);
       }
    },
     methods:{
       updateTime(e){
         //监听视频播放
         this.currentTime = e.target.currentTime;
         this.duration = e.target.duration;
       },
       initScroll(){
         this.Bscroll = new BScroll(this.$refs.scroll,{
           scrollY:true,
           click:true,
           // pullDownRefresh: {
           //   threshold: 50,
           //   stop: 40
           // },
           pullUpLoad: {
             threshold: -40
           }
         });

         /*下拉事件*/
         // this.Bscroll.on('pullingDown',() => {
         //   console.log("下拉刷新")
         // });

         /*上拉事件*/
         this.Bscroll.on('pullingUp',() =>{
           if(!this.isPullUp) return;
           console.log("上啦加载");
           this.isPullUp = false;
           this.page += 10;

           this._getRmv(this.page).then( () => {
                  this.isPullUp = true;
                  // 通知better-scroll事件完成。
                  this.Bscroll.finishPullUp()
           })
         });
       },
       _getRmv(page,callback){
          return new Promise((resolve,reject) => {
            getRmv(page).then(res => {
              if(res.code == ERR_OK){

                //这里初始化需要放在赋值的前面,否则会失效
                res.data.forEach((item,index) => {
                  item.isShow = false;
                  item.mv = '';
                });

                this.mvList = res.data;
                setTimeout(() => {
                  resolve();
                },1000)

              }
            })
          })
       },
       tooglePlay(){
         if(this.play){
           this.pauseVideo();
         }else {
           this.playVideo();
         }
       },
       playVideo(){
         this.$refs.videos[0].play();
         this.play = true;
         this.timingPlay();
       },
       pauseVideo(){
         this.play = false;
         this.$refs.videos[0].pause();
         this.timingPlay();
       },
       timingPlay(){
          setTimeout(() => {
            this.isBtnShow = !this.isBtnShow;
          },600)
       },
       passMv(item){
         // item.isShow  = false;
       },
       opeMv(item,event){

         if(item.mv){
           item.isShow = true;
         }else{
           getDetailedsMv(item.id).then(res => {
             if(res.code == ERR_OK){
               this.mvList.forEach( value => {
                 value.mv = null;
                 value.isShow = false;
               });
               //这里使用定时器的原因,因为src被清除后,并没有立马发生变化,猜测原因可能是因为因为移除节点,需要时间
               setTimeout(() => {
                 this.currentTime = 0;
                 this.playVideo();
               },22)
               item.mv = res.data;
               item.isShow = true;
               this.isBtnShow = true;
               this.play = false;
             }
           })
         }
       }
     }
  }
</script>

<style scoped lang="less"  rel="stylesheet/less">
  @import "~common/less/base";

  /*.fade-enter-active, .fade-leave-active{*/
    /*transition: all 0.4s;*/
    /*opacity: 1;*/
  /*}*/
  /*.fade-enter, .fade-leave-to{*/
    /*opacity: 0;*/
  /*}*/

  .pullup-wrapper{
    min-height:40px;
    text-align: center;
    background: #fff;
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
  }
  .loading {
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .musicvideo{
    position: absolute;
    left:0;
    top:38px;
    bottom:0;
    right:0;
    background:white;
    overflow: hidden;
    .v-wrap{
      .v-content{
        position: relative;
        height:200px;
        .h5_pre{
          height:100%;
          img{
            width:100%;
            height:100%;
          }
          .i-btn{
            position: absolute;
            margin: auto;
            left:0;
            right:0;
            top:0;
            bottom:0;
            width:38px;
            height:38px;
            font-size: 38px;
            color:white;
          }
        }
        .h5_disp{
          position: relative;
          height:100%;
          background: #000;
          video{
            width:100%;
            height:100%;
          }
          .v-btn{
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);
            color: #fff;
            font-size: 32px;
          }
          .v-dtime{
            position: absolute;
            right:5px;
            bottom:20px;
            color:white;
            font-size:12px;
          }
          .bar-wrap{
            position: absolute;
            left:0;
            bottom:0;
            height:6px;
            width:100%;
            background: #ccc;
            .bar{
              width:0;
              height:100%;
              background: @color;
            }
          }
        }
      }
      .text{
        padding: 0 10px;
        background: white;
        line-height: 24px;
        .play-count{
          font-size:12px;
        }
      }

    }
  }
</style>
