import Vue from 'vue';
import Vuex from 'vuex';
import home from './home';
import common from '../common/common.js';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    home,
    common
  }
});
