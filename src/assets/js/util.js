/**
   * @param date 时间戳
   * @return string 返回年月or月日
   */
export function formatDateString(date) {
  var date = new Date(date),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();

  if(year === new Date().getFullYear()) {
    return month + '月' + day + '日';
  }else {
    return year + '年' + month + '月';
  }
}

/**
   * @param diff 时间差 毫秒级
   * @return String  返回入参的时间 与当前时间的 时间差，最大时间单位是天，及多少天前
   */
  export function getDateDiffFromNow(diff) {

    var minute = 1000 * 60,
        hour = minute * 60,
        day = hour * 24;

    if(diff < 0) return;

    var dayCount = parseInt(diff / day),
        hourCount = parseInt(diff / hour),
        minuteCount = Math.floor(diff / minute);

    if(dayCount >= 1) {
      return dayCount + '天前';
    }else if(hourCount >= 1) {
      return hourCount + '小时前';
    }else if(minuteCount >= 30) {
      return '半小时前'
    }else if(minuteCount >= 1) {
      return minuteCount + '分钟前'
    }else {
      return '刚刚';
    }
  }

  /**
   * @param date 时间戳，或者标准时间字符串
   * @param nDay(int) 表示nDay + 1天前的数据，已年月日的方式显示
   * @return String 返回格式化的时间差，最多显示n天前，再之前的时间，本年度以 **月**日表示， 其他以**年**月显示
   */
  export function renderDateString(date, nDay) {
    if(!date) return '';
    if(typeof date == 'string'){
      date = date.replace(/-/g, '/').replace(/\.\d+Z|T/g, ' ').trim(); //兼容ie8
      date = date.replace(/([0-9]{2})(\:)([0-9]{2})/, ' UTC\$1:\$3'); // change utc string
    }
    var timeStamp = new Date(date).getTime();
    if(!timeStamp) return ''; //时间戳有误则返回

    var day = 1000 * 60 * 60 * 24,
        now = new Date().getTime(),
        diff = now - timeStamp;

    nDay = typeof nDay !== 'number' ? 0 : nDay;

    if(diff > (day * (nDay+1))) {
      return formatDateString(date);
    }else {
      return getDateDiffFromNow(diff);
    }
  }


export const restoreSelection = (function() {
		if (window.getSelection) {
			return function(savedSelection) {
				var sel = window.getSelection();
				sel.removeAllRanges();
				for (var i = 0, len = savedSelection.length; i < len; ++i) {
					sel.addRange(savedSelection[i]);
				}
			};
		} else if (document.selection && document.selection.createRange) {
			return function(savedSelection) {
				if (savedSelection) {
					savedSelection.select();
				}
			};
		}
	})();

	export const saveSelection = (function() {
		if (window.getSelection) {
			return function() {
				var sel = window.getSelection(), ranges = [];
				if (sel.rangeCount) {
					for (var i = 0, len = sel.rangeCount; i < len; ++i) {
						ranges.push(sel.getRangeAt(i));
					}
				}
				return ranges;
			};
		} else if (document.selection && document.selection.createRange) {
			return function() {
				var sel = document.selection;
				return (sel.type.toLowerCase() !== 'none') ? sel.createRange() : null;
			};
		}
	})();

export const replaceSelection = (function() {
		if (window.getSelection) {
			return function(content) {
				var range, sel = window.getSelection();
				var node = typeof content === 'string' ? document.createTextNode(content) : content;
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();
					range.insertNode(document.createTextNode(' '));
					range.insertNode(node);
					range.setStart(node, 0);

					window.setTimeout(function() {
						range = document.createRange();
						range.setStartAfter(node);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}, 0);
				}
			}
		} else if (document.selection && document.selection.createRange) {
			return function(content) {
				var range = document.selection.createRange();
				if (typeof content === 'string') {
					range.text = content;
				} else {
					range.pasteHTML(content.outerHTML);
				}
			}
		}
	})();

	/* 将contenteditable 的 commentbox的子节点，转换成对应的文本值 */
	export const getValueOfCommentBox = function(el) {
		var lines = [];
		var line  = [];

		var flush = function() {
			lines.push(line.join(''));
			line = [];
		};

		var sanitizeNode = function(node) {
			const ELEMENT_NODE = 1;
			const TEXT_NODE = 3;
			const TAGS_BLOCK = ['p', 'div', 'pre', 'form'];
			if (node.nodeType === TEXT_NODE) {
				line.push(node.nodeValue);
			} else if (node.nodeType === ELEMENT_NODE) {
				var tagName = node.tagName.toLowerCase();
				var isBlock = TAGS_BLOCK.indexOf(tagName) !== -1;

				if (isBlock && line.length) flush();

				if (tagName === 'img') {
					var title = node.getAttribute('title') || '';
					if (title) line.push(title);
					return;
				} else if (tagName === 'br') {
					flush();
				}

				var children = node.childNodes;
				for (var i = 0; i < children.length; i++) {
					sanitizeNode(children[i]);
				}

				if (isBlock && line.length) flush();
			}
		};

		var children = el.childNodes;
		for (var i = 0; i < children.length; i++) {
			sanitizeNode(children[i]);
		}

		if (line.length) flush();

		return lines.join('\n');
	}

	/**转换exif 信息 为制定格式
	 * params: https://github.com/exif-js/exif-js/blob/master/exif.js 生成的exifdata 对象
	 */
	export function getExifInfo(exifdata) {
		let results = {};

		const tagsMap = {
			Make: 'make',
			DateTime: 'datetime',
			ExposureTime: 'exposure_time',
			Model: 'model',
			Flash: 'flash',
			FocalLength: 'focal_length',
			ISOSpeedRatings: 'iso',
			FNumber: 'aperture'
		};

		for (let a in exifdata) {
			if (exifdata.hasOwnProperty(a)) {
				if (typeof tagsMap[a] === 'undefined') continue;
				if (exifdata[a] instanceof Number) {
					results[tagsMap[a]] = `${exifdata[a].toFixed(3)} [${exifdata[a].numerator} / ${exifdata[a].denominator}]`;
				} else if (a === 'Flash') {
					results[tagsMap[a]] = (exifdata[a].indexOf('not') !== -1) ? 0 : 1;
				} else {
					results[tagsMap[a]] = exifdata[a];
				}
			}
		}
		return results;
	}

export function formatDate(date, split) {
	let d = new Date(date * 1000);
	let y = d.getFullYear();
	let m = d.getMonth() + 1;
	let dd = d.getDate();
	let h = d.getHours();
	let mm = d.getMinutes();
	dd = dd > 9 ? dd : '0' + dd;
	m = m > 9 ? m : '0' + m;
	mm = mm > 9 ? mm : '0' + mm;
	return y + split + m + split + dd + ' ' + h + ':' + mm;
}

export function getAvatar(uid) {
	var pad = function (num, n) {
		return '' + num + Array(Math.pow(10,n)>num?(n-(''+num).length+1):0).join(0);
	};
	var tmp;
	var uc_api = 'https://img-res.mzres.com/img/download/uc/';
	tmp = pad(uid, 10);
	return uc_api + tmp.substr(0,2) + '/' + tmp.substr(2,2) + '/' + tmp.substr(4,2) + '/' + tmp.substr(6,2) + '/' + tmp.substr(8,2) + '/'  + uid + '/w100h100';
}

export function compress(img) {
	//    用于压缩图片的canvas
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');
  //    瓦片canvas
  var tCanvas = document.createElement("canvas");
  var tctx = tCanvas.getContext("2d");
	var initSize = img.src.length;
	var width = img.width;
	var height = img.height;

	//如果图片大于四百万像素，计算压缩比并将大小压至400万以下
	var ratio;
	if ((ratio = width * height / 4000000)>1) {
			ratio = Math.sqrt(ratio);
			width /= ratio;
			height /= ratio;
	}else {
			ratio = 1;
	}

	canvas.width = width;
	canvas.height = height;

	// 铺底色
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// 如果图片像素大于100万则使用瓦片绘制
	var count;
	if ((count = width * height / 1000000) > 1) {
			count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

	// 计算每块瓦片的宽和高
			var nw = ~~(width / count);
			var nh = ~~(height / count);

			tCanvas.width = nw;
			tCanvas.height = nh;

			for (var i = 0; i < count; i++) {
					for (var j = 0; j < count; j++) {
						tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
						ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
					}
			}
	} else {
			ctx.drawImage(img, 0, 0, width, height);
	}

	//进行最小压缩
	var ndata = canvas.toDataURL('image/jpeg', 0.5);

	console.log('压缩前：' + initSize);
	console.log('压缩后：' + ndata.length);
	console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

	tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

	return ndata;
}

export function getIndexBy(array, name, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][name] === value) {
     return i;
    }
  }
  return -1;
};