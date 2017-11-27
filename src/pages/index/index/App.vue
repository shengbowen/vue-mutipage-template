<template>
  <div style="height: 100%;">

    <transition :name="'vux-pop-' + (direction == 'forward' ? 'in' : 'out')">
      <keep-alive>
        <router-view style="height: 100%; width: 100%;"></router-view>
      </keep-alive>
    </transition>

  </div>
</template>

<script>
import { Indicator } from 'mint-ui';
import { mapState } from 'vuex';

export default {

  components: {
    Indicator
  },

  computed: mapState({
    isLoading: state => state.common.isLoading,
    direction: state => state.common.direction
  }),

  methods: {
    handle() {
      console.log(this.isLoading);
    }
  },

  watch: {
    isLoading: function(val) {
      if (val) {
        Indicator.open();
      } else {
        Indicator.close();
      }
    }
  }

};

</script>

<style lang="less">

body {
  background-color: #f1f1f1;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

  .vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
