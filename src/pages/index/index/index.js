import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App';
import store from 'store/home/index.js';
import { actions } from 'store/common/common.js';

import routes from 'config/router/index/index.js';
import 'assets/js/vueFilter.js';
import 'assets/css/reset.css';
import { InfiniteScroll } from 'mint-ui';
import VueCookie from 'vue-cookie';
import VueLazyload from 'vue-lazyload';

Vue.use(InfiniteScroll);
Vue.use(VueRouter);
Vue.use(VueCookie);
Vue.use(VueLazyload);

let loginInfo = VueCookie.get('MZBBSUC_2132_loginmember');
try {
  loginInfo = JSON.parse(loginInfo);
} catch (e) {
  console.error(e);
}
if (loginInfo && loginInfo.uid) {
  store.commit(actions.LOGIN, loginInfo);
}

const router = new VueRouter({
  routes: routes
});

// a simple history manage
let history = window.sessionStorage;

history.clear();
let historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);

router.beforeEach((to, from, next) => {
  // 异步加载js文件时的 loading状态
  store.commit(actions.UPDATE_LOADING, {isLoading: true});

  const toIndex = history.getItem(to.path);
  const fromIndex = history.getItem(from.path);

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || toIndex === '0' && fromIndex === '0') {
      store.commit(actions.UPDATE_DIRECTION, 'forward');
    } else {
      store.commit(actions.UPDATE_DIRECTION, 'backward');
    }
  } else {
    ++historyCount;
    history.setItem('count', historyCount);
    to.path !== '/' && history.setItem(to.path, historyCount);
    store.commit(actions.UPDATE_DIRECTION, 'forward');
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1];
    window.location.href = `http${url}`;
  } else if (to.meta.requiresAuth) {
    if (loginInfo && loginInfo.uid) {
      next();
    } else {
      window.location.href = `/member/login`;
    }
  } else {
    next();
  }
});

router.afterEach((to, from, next) => {
  store.commit(actions.UPDATE_LOADING, {isLoading: false});
});

new Vue({
  store,
  router: router,
  render: h => h(App)
}).$mount('#app');
