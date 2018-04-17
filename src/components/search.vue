<template>
  <div class="search">
    <div class="searchWrap">
      <i class="iconfont icon-sousuo icon_1"></i>
      <input type="search" class="text" placeholder="搜索歌曲,歌手,专辑" v-model.trim="speech">
      <i class="iconfont icon-shanchu icon_2" v-show="speech" @click="deleteData"></i>
    </div>
    <div class="sh_hot">
      <div class="title">热门搜索</div>
      <ul class="lexicon">
        <li v-for="item in hotkey" v-if="hotkey.length" @click="replace(item.k)">{{item.k}}</li>
      </ul>
    </div>
    <div class="search-list" v-show="speech" ref="silder">
      <ul ref="msilder">
        <li class="item" v-for="item in data" @click="onplay(item.id)">
          <i class="iconfont icon-icon_add"></i>
          <p>{{item.name}}</p>
        </li>
      </ul>
      <div class="mloading" v-show="loading">
        <Loading></Loading>
      </div>
    </div>
    <div class="history">
        <div class="clear-box">
          <span class="pull-left">搜索历史</span>
          <span class="iconfont icon-shanchu icon_2 allEmpty" @click="epthistory">清空历史</span>
        </div>
        <ul class="history-wrap">
          <li v-for="(item,index) in history" @click="replace(item)">
            <a href="javascript:;">{{item}}</a>
            <span class="iconfont icon-iconset0127 delete" @click.stop="delhistory(index)"></span>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
  import {getSearch, getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import BScroll from 'better-scroll'
  import {mapMutations} from 'vuex'
  import Loading from 'components/loading'
  import {mixinsSong} from 'components/mixins/song'
  import  {mapState} from 'vuex'
  import {addHistory,emptyHistory,deleteHistory,getHistory} from 'common/js/cache'

  export default {
    mixins:[mixinsSong],
    components: {
      Loading
    },
    data() {
      return {
        speech: "",
        data: [],
        hotkey: [],
        loading: false,
        history:[]
      }
    },
    watch: {
      speech() {
        this.loading = true;
        this._getSearch();
        if (this.Bscroll) {
          this.$nextTick(function () {
            this.Bscroll.refresh()
          })
        }

        if (!this.speech.length) {
          this.deleteData();
        }
      }
    },
    created() {
      this._getHotKey();
      this.history = getHistory();
    },
    mounted(){
      this.initBScroll();
    },
    computed:{
      ...mapState([
        'song'
      ])
    },
    methods: {
      epthistory(){
        this.history = emptyHistory();
      },
      delhistory(index){
        this.history = deleteHistory(index);
      },
      onplay(id) {
        //更改数据源
        this.setSource(id);
      },
      initBScroll() {
        this.Bscroll = new BScroll(this.$refs.silder, {
          scrollY: true,
          click: true
        })
      },
      _getSearch() {
        getSearch(this.speech).then(res => {
          if (res.code == ERR_OK) {
            this.data = res.result.songs;
            this.loading = false;

            //添加搜索历史记录
            this.history = addHistory(this.speech);
            //判断底部是否需要添加bottom
            this.BottomPd();
          }
        })
      },
      _getHotKey() {
        getHotKey().then(res => {
          this.hotkey = res.data.hotkey;
          this.hotkey.length = 10;
        })
      },
      replace(str) {
        //热词搜索替换到搜索框
        this.speech = str;
      },
      deleteData() {
        //清空搜索框
        this.data = [];
        this.speech = "";
      },
      ...mapMutations([
        'setSource'
      ])
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/base";

  .search {
    position: absolute;
    left: 0;
    top: 38px;
    bottom: 0;
    right: 0;
    background: #fcfcfd;
    .searchWrap {
      position: relative;
      padding: 10px;
      height: 40px;
      border-bottom: 1px solid @hui;
      .icon_1 {
        position: absolute;
        left: 8px;
        top: 14px;
        font-size: 28px;
      }
      .icon_2 {
        position: absolute;
        right: 16px;
        top: 16px;
        font-size: 20px;
      }
      .text {
        width: 100%;
        height: 34px;
        padding: 0 24px;
        background: #ebecec;
        box-sizing: border-box;
        border-radius: 12px;
        outline: none;
      }
      input[type=search]::-webkit-search-cancel-button{
        -webkit-appearance: none;//此处只是去掉默认的小×
      }
    }
    .sh_hot {
      padding: 0 10px;
      .title {
        padding: 10px 0;
        font-size: 12px;
        color: #666;
      }
      .lexicon {
          overflow: hidden;
          li {
            float: left;
            padding: 10px 16px;
            border-radius: 14px;
            background: white;
            border: 1px solid @hui;
            margin: 0 10px 10px 0;
            color: black;
          }
      }
    }
    .search-list {
      position: absolute;
      left: 0;
      top: 61px;
      bottom:0;
      right:0;
      background: #fcfcfd;
      overflow: hidden;
      .mloading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: white;
      }
      .item {
        height: 40px;
        padding: 0 10px;
        display: flex;
        border-bottom: 1px solid @hui;
        i {
          flex-basis: 30px;
          display: flex;
          align-items: center;
        }
        p {
          flex: 1;
          line-height: 40px;
          .htext;
        }
      }
    }
    .history{
      .clear-box{
        color:#666;
        overflow: hidden;
        font-size:14px;
        padding:0 0 6px 0;
        span:first-child{
          float: left;
        }
        span:last-child{
          float: right;
          font-size:14px;
        }
      }
      padding:10px;
      .history-wrap{
        >li {
          font-size:12px;
          border-bottom: 1px solid #ccc;
          padding:1px 0;
          height: 20px;
          line-height: 20px;
          >a{
            color:#666;
          }
          .delete{
            color:#666;
            float: right;
            padding-right:10px;
          }
        }
      }
    }

  }
</style>
