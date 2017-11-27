<template>
  <div class="mz-footer">
    <a :href="mobileurl">触屏版</a>
    <span class="splitter"></span>
    <a :href="pcurl">PC版</a>
    <span class="splitter"></span>
    <a :href="appurl">APP版<img class="hot" src="./assets/hot.png" alt=""></a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobileurl: '',
      pcurl: '',
      appurl: 'https://bbs2.res.meizu.com/about/download/index.html'
    };
  },
  mounted() {
    const mobileurl = window.location.href;
    this.mobileurl = mobileurl;
    if (window.data_pc_link) {
      this.pcurl = window.data_pc_link;
    } else {
      this.pcurl = '//bbs.meizu.cn/index.php?mobile=no';
    }
  }
};
</script>

<style lang="less">
  @import '../../assets/css/var.less';
  .mz-footer {
    padding: 20px 0 30px;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    a {
      font-size: 14rem / @rem-unit;
      color: #A1A1A1;
    }
    .splitter {
      margin: 0 10px;
      display: inline-block;
      height: 18px;
      width: 1px;
      background: #A1A1A1;
    }
    .hot {
      margin-left: 2px;
      height: 10px;
      vertical-align: top;
    }
  }
</style>