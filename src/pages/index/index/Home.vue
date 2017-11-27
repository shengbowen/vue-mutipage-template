<template>
  <div class="home-wrap" style="-webkit-overflow-scrolling: touch;">
    hello
  </div>
</template>

<script>
import store from 'store/home/index.js';
import { actions } from 'store/home/home.js';
import { mapState } from 'vuex';

import { Button } from 'mint-ui';

let lastScroll = 0; // 记录上一次的scrollTop，用来判断向上或向下滚动
let topHeaderHeight; // header 的高度

export default {
  data () {
    return {
    };
  },

  methods: {

  },
  created: function() {

  },
  beforeDestory(){

  },
  mounted: function() {

  }
};
</script>

<style lang="less">
  @import '../../../assets/css/var.less';

  .home-wrap {
    overflow: hidden;
  }

  .header-wrap {
    position: fixed;
    width: 100%;
    top: 0;
    transition: top 0.2s ease-in-out;
    z-index: 100;
  }

  .header-hide {
    top: -50rem / @rem-unit;
  }

  .content {
    height: 100%;
    padding-top: 87rem / @rem-unit;
    box-sizing: border-box;
    overflow: auto;
  }
</style>
