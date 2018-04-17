<template>
  <div class="music" ref="move">
    <div class="slide" v-show="mshow" ref="msilder">
      <div class="banner" ref="slider">
        <ul ref="slideGroup">
          <li class="item" v-for="item in banners">
            <a :href="item.url"><img :src="item.pic"></a>
            <span :class="item.typeTitle == '广告'? 'active':''">{{item.typeTitle}}</span>
          </li>
        </ul>
        <div class="distPoint" >
          <span v-for="(item,index) in banners" @click.stop="point(index)" :class="(currentPageIndex == index) ?'active':''">{{index}}</span>
        </div>
      </div>
      <Nav></Nav>
      <recList @select-type="onSelectType"></recList>
    </div>
    <router-view @mshow="onSelectType"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {getBanner} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import Nav from 'components/nav'
  import RecList from 'components/recommendList.vue'
  import {mapState} from 'vuex'
  import {mixinsSong} from 'components/mixins/song'

  export default {
      mixins:[mixinsSong],
      components:{
        Nav,
        RecList
      },
      data(){
        return {
          banners:[],
          currentPageIndex:0,
          mshow:true
        }
      },
      created() {
        this._getBanner()
      },
      activated(){
        //解决了keep-alive带来的弊端
        if(this.scroll){
          this._refresh()
          this.scroll.goToPage(0,0,0,"easing")
          this.play();
        }
      },
      deactivated() {
        clearInterval(this.timer);   //页面离开后手动停止计时器
      },
      watch: {
        banners() {
          setTimeout(() => {
            this.setSliderWidth();
            this.minitBScroll();
          },20)

        },
        mshow() {
          this.$nextTick(() => {
            this._refresh();
          })
        }
      },
       computed: {
        ...mapState([
          'song'
        ])
      },
      methods:{
        onSelectType(){
          this.mshow = !this.mshow;
        },
        minitBScroll() {
          this.Bscroll = new BScroll(this.$refs.move,{
            scrollY:true,
            click:true
          })
        },
        _refresh(){
          this.scroll.refresh();
          this.Bscroll.refresh();
        },
        _getBanner() {
          getBanner().then(res => {
            if(res.code == ERR_OK) {
              this.banners = res.banners;
            }
          });
        },
        setSliderWidth() {  //设置ul的宽度
          this.children = this.$refs.slideGroup.children;
          this.dots = new Array(this.children.length)
          let width =0;
          let sliderWidth = this.$refs.slider.clientWidth;
          for(let i = 0;i<this.children.length;i++){
            this.children[i].children[0].children[0].style.width = sliderWidth + "px";  //设置图片的宽度
            width += sliderWidth;
          }
          width += 2*sliderWidth;
          this.$refs.slideGroup.style.width = width + 'px';

          //设置容器高度
          let image = new Image();
          image.src = this.banners[0].pic;
          let that = this;
          image.onload = function () {
            let maxHeight =image.height * sliderWidth/ image.width;
            that.$refs.slider.style.height = maxHeight + "px";
            //初始化轮播图
            that.init();
            that.play();
          }

        },
        init() {

           if(!this.scroll){
             this.scroll = new BScroll(this.$refs.slider,{
               click: true,
               scrollX: true,
               scrollY: false,
               momentum: false,
               autoPlay:true,
               snap: {
                 loop: true,
                 threshold: 0.3,
                 speed: 400
               }
             });
             this.scroll.on("beforeScrollStart",() => {
               clearInterval(this.timer)
             });
             this.scroll.on("touchEnd",() => {
               setTimeout(() =>{
                 this.play()
               },200);
               this.scroll.once("scrollEnd",() => {
                 this.currentPageIndex = this.scroll.getCurrentPage().pageX
                 if(this.currentPageIndex == 6) {
                   this.currentPageIndex = 0;
                 }
               })
             })
           }
        },
        play() {
          clearInterval(this.timer);

          this.timer = setInterval(() => {
            this.scroll.next(1000)
            this.currentPageIndex = this.scroll.getCurrentPage().pageX;
            if(this.currentPageIndex == 6) {
              this.currentPageIndex = 0;
            }
          },1400)
        },
        point(index) {
          clearInterval(this.timer);
          this.scroll.goToPage(index, 0, 0, "easing");
          this.currentPageIndex = index;
        }
      }
  }
</script>

<style scoped lang="less"  rel="stylesheet/less">
  @import "~common/less/base";
  .music{
    position: absolute;
    left:0;
    top:38px;
    bottom:0;
    right:0;
    background:white;
    overflow: hidden;
    .banner{
      position: relative;
      width:100%;
      overflow: hidden;
      ul{
        position: absolute;
        left:0;
        top:0;
        .item{
          float: left;
          position:relative;
          span{
            position:absolute;
            right:0;
            bottom:4px;
            width:34px;
            height:20px;
            border-radius: 6px 0 0 6px;
            background:@color;
            line-height: 20px;
            font-size:12px;
            text-align: center;
            color:white;
            overflow: hidden;
          }
          span.active{
            background:deepskyblue;
          }
        };
      }
      .distPoint{
        position: absolute;
        left:50%;
        bottom:10px;
        transform: translateX(-50%);
        font-size:0;
        span{
          width:6px;
          height:6px;
          display: inline-block;
          background: #7e8c8d;
          border-radius: 50%;
          margin-left:10px;
        }
        span.active{
          background: @color;
        }
      }
    }
  }
</style>
