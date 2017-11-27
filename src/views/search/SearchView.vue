<template>
  <div class="search-wrap">
    <div class="search-content">
      <div class="search-loading" v-show="sloading">
        <span class="sloading">加载中...</span>
      </div>
      <div class="search-header">
        <form class="search-form">
          <div class="search-input">
            <label for=""></label>
            <input v-model="key" type="text" placeholder="搜索帖子、用户...">
            <i class="clear" v-show="searchString !== ''" @click="clear"></i>
          </div>
          <button @click.prevent="search" v-if="key" :class="{'is-active': searchString !== ''}">搜索</button>
          <button @click.prevent="goBack" v-else :class="{'is-active': searchString !== ''}">取消</button>
        </form>
        <mz-shadowbar></mz-shadowbar>
        <p class="info">{{info}}</p>
      </div>
      <div class="result" ref="wrapper" :style="{height: wrapperHeight + 'px'}">
        <div class="hot-search" v-show="showHot">
          <span v-for="(item, index) in hotlist"
            v-if="item.keyword"
            :key="index"
            :class="{recommend: item.recommend}"
            @click="clickHot(item)"
            >{{item.keyword}}</span>
        </div>
        <ul v-show="!showHot"
          class="list">
            <li v-for="(item,index) in results" :key="index"  class="list-item">
              <a :href="item.href">
                <h1>{{item.subject}}</h1>
                <div class="thread-info clearfix">
                  <span class="author">作者： {{item.author}}</span>
                  <span class="view">阅读{{item.views}} / 评论{{item.replies}} / {{formatDate(item) | timeFormat(15)}}</span>
                </div>
                <div class="desc">
                  {{item.message}}
                </div>
              </a>
            </li>
        </ul>
        <p v-show="isLoading" class="page-infinite-loading">
          加载中...
        </p>
        <p v-show="!showHot&&last_page" class="no-more">已无更多数据</p>
      </div>
    </div>
    <div class="sticky-footer" v-show="showHot" ref="footer">
      <mz-footer></mz-footer>
    </div>
  </div>
</template>

<script>
import { Search, Toast, Indicator } from "mint-ui";
import axios from "axios";
import MzShadowbar from "components/shadowbar/MzShadowbar";
import MzFooter from "components/footer/MzFooter";
export default {
  components: {
    "mt-search": Search,
    MzShadowbar,
    MzFooter
  },
  data() {
    return {
      key: "",
      results: [],
      hotlist: [],
      timer:null,
      isLoading: false,
      sloading: false,
      showHot: true,
      count: 0,
      page: 1,
      last_page: false,
      wrapperHeight: 0,
      stop: false
    };
  },
  computed: {
    searchString: function() {
      return this.key.trim();
    },
    info: function() {
      return this.showHot ? "热门搜索" : `共有${this.count}条帖子`;
    }
  },
  // beforeDestroy(){
  //    this.$refs.wrapper.removeEventListener("scroll", this.handleScroll);
  // },
  mounted: function() {
  },
  methods: {
    handleScroll() {
      let container = this.$refs.wrapper
      let scrollTop = container.scrollTop
      let offsetHeight = container.offsetHeight
      let scrollHeight = container.scrollHeight

      if (scrollTop + offsetHeight + 20 > scrollHeight) {
        this.getMore();
      }
    },
    clickHot: function(item) {
      this.key = item.keyword;
      this.search();
    },
    goBack: function() {
      this.$router.go(-1);
    },
    search: function() {
      if (this.searchString === "") {
        Toast({
          message: "请输入查询字串",
          duration: 2000
        });
        return;
      }
      this.showHot = false;
      this.sloading = true;
    },
    clear: function() {
      this.key = "";
      this.page = 1;
      this.results = [];
      this.showHot = true;
    },
    formatDate: function(item) {
      return item.dateline.length === 10
        ? parseInt(item.dateline + "000")
        : parseInt(item.dateline);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.showHot) {
      this.clear();
      next(false);
    } else {
      next();
    }
  }
};
</script>

<style lang="less">
@import "../../assets/css/var.less";

.search-wrap {
  background: #fff;
  .search-form {
    width: 100%;
    height: 40rem / @rem-unit;
    line-height: 40rem / @rem-unit;
    background: #fff;
    padding: 0 0 0 16rem / @rem-unit;
    box-sizing: border-box;

    button {
      font: bold (14rem / @rem-unit) (@font-medium);
      color: #777;
      padding: 0 0 0 10rem / @rem-unit;
      background: transparent;
      border: 0 none;
      outline: none;
      &.is-active {
        color: @blue1;
      }
    }
  }
  .search-input {
    position: relative;
    display: inline-block;
    width: 285rem / @rem-unit;
    height: 26rem / @rem-unit;
    padding: 0 10rem / @rem-unit 0 33rem / @rem-unit;
    line-height: 26rem / @rem-unit;
    background: #f0f0f0;
    border-radius: 30rem / @rem-unit;
    border: 1px solid #a1a1a1;
    box-sizing: border-box;
    font-size: 0;

    input {
      width: 90%;
      height: 24rem / @rem-unit;
      line-height: 24rem / @rem-unit;
      font-size: 14rem / @rem-unit;
      background: inherit;
      font: normal (14rem / @rem-unit) (@font-regular);
      color: #777;
    }

    label {
      position: absolute;
      left: 10rem / @rem-unit;
      top: 6rem / @rem-unit;
      width: 12rem / @rem-unit;
      height: 12rem / @rem-unit;
      background: url("./assets/search.png");
      background-size: cover;
    }

    i {
      position: absolute;
      right: 6rem / @rem-unit;
      top: 6rem / @rem-unit;
      width: 12rem / @rem-unit;
      height: 12rem / @rem-unit;
      background: url("./assets/clear.png");
      background-size: cover;
    }
  }
  .search-loading {
    position: fixed;
    z-index: 9;
    width: 100%;
    height: 100%;
    background-color: rgba(234, 234, 234, 0.29);
    .sloading {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -40px;
      margin-top: -25px;
      width: 80px;
      height: 50px;
      text-align: center;
    }
  }
  .search-header {
    position: fixed;
    background: #fff;
    top: 0;
    width: 100%;
    .info {
      height: 24rem / @rem-unit;
      line-height: 24rem / @rem-unit;
      padding-left: 16rem / @rem-unit;
      font: normal (12rem / @rem-unit) (@font-regular);
      color: #a1a1a1;
      border-bottom: 1px solid #d8d8d8;
    }
  }

  .search-content {
    background: #fff;
    padding-top: 70rem / @rem-unit;
    min-height: 100%;
    // padding-bottom: 40rem / @rem-unit;
    box-sizing: border-box;
  }
  .mz-footer {
    padding-bottom: 0;
  }

  .sticky-footer {
    margin-top: -54rem / @rem-unit;
    height: 40rem / @rem-unit;
  }

  .result {
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    .hot-search {
      padding: 13rem / @rem-unit 16rem / @rem-unit 0;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      span {
        padding: 3rem / @rem-unit 10rem / @rem-unit;
        font: normal (12rem / @rem-unit) (@font-regular);
        color: #777;
        box-sizing: border-box;
        border: 1px solid #777;
        border-radius: 30rem / @rem-unit;
        margin: 0 5rem / @rem-unit 12rem / @rem-unit;

        &.recommend {
          border-color: @blue1;
          color: @blue1;
        }
      }
    }

    .page-infinite-loading {
      text-align: center;
      height: 50px;
      line-height: 50px;
      div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
      color: #a1a1a1;
    }

    .list {
      padding: 0 16rem / @rem-unit 0;
      .list-item {
        padding: 13rem / @rem-unit 0 17rem / @rem-unit 0;
        border-bottom: 1px solid #d8d8d8;
        h1 {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font: bold (16rem / @rem-unit) (@font-medium);
          color: #777;
        }
      }

      .desc {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        font: normal (12rem / @rem-unit) (@font-regular);
        color: #a1a1a1;
      }
    }

    .thread-info {
      font: normal (10rem / @rem-unit) (@font-regular);
      color: #a1a1a1;
      margin: 10rem / @rem-unit 0 8rem / @rem-unit 0;
      overflow: hidden;
      .author {
        float: left;
        max-width: 120rem / @rem-unit;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .view {
        float: right;
      }
    }

    .no-more {
      height: 40rem / @rem-unit;
      font: normal (12rem / @rem-unit) (@font-regular);
      line-height: 40rem / @rem-unit;
      text-align: center;
      color: #ccc;
    }
  }
}
</style>
