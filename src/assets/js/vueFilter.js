/* eslint-disable */
/*
 * vuejs 	过滤器
 * time 	2017年1月18日 18:46:54
 */

import Vue from 'vue';
import { renderDateString, formatDate as f } from './util.js';

/**
  * 格式化时间
  * @param value 		传进来的时间戳
  * @param nday     表示nday+1 天前的数据，以年月日的方式显示
  * @param return
*/
Vue.filter('timeFormat', function (value, nday) {
  return renderDateString(value, nday);
});

Vue.filter('formatDate', function (value, split) {
  return f(value, split);
});

Vue.filter('displayLargeNumber', function (value) {
  if (value === 0) return 0;
  if (value && value.toString().length > 5) {
    return parseInt(value / 10000, 10) + '万+';
  }
  return value;
});