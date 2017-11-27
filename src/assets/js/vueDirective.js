import Vue from 'vue';


// 聚焦元素
  /*======== 图片按需加载 ========*/
function PicLazyLoad(el) {
    this.imgsArr = null;
    this.el = el;
}

PicLazyLoad.prototype.init = function() {
    var _this = this;
    setTimeout(function() {
      _this.imgsArr = [].slice.apply(_this.el.querySelectorAll('.view-image-wrap'));
    }, 50);
    this.check(_this.imgsArr);

    this.el.addEventListener('scroll', function() {
        _this.check(_this.imgsArr);
    })
    this.el.querySelectorAll('.view-image-wrap:not(.lazy-changed)').forEach(function(item) {
      item.querySelector('.view-image-placeholder p').innerText = '正在加载图片..';
    });
}

function displayInWindow(el) {
    var top = el.getBoundingClientRect().top;
    var clientHeight = document.documentElement.clientHeight;
    if (top >= -50 && top <= clientHeight) {
        return true;
    } else return false;
}

PicLazyLoad.prototype.check = function() {
    var self = this;
    setTimeout(function() {
      self.imgsArr && self.imgsArr.forEach(function(item, index) {
        if(item && displayInWindow(item) && !item.classList.contains('lazy-changed')) {
          item.classList.add('lazy-changed');
          var img = item.querySelector('.view-image');
          if (img) {
            img.src = img.dataset.src;
            delete self.imgsArr[index];
          }
          // debugger;
        }
      });
    }, 100);
}


const Lazyload =  {
  update: function (el) {
    var picLazyLoad = new PicLazyLoad(el);
    picLazyLoad.init();
  }
}

const install = function(Vue) {
  Vue.directive('lazyload', Lazyload);
}

Lazyload.install = install;

export default Lazyload
