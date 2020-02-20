var globalWidth = window.innerWidth
var radixNO = 100 / 750 * globalWidth
document.documentElement.style.fontSize = radixNO + 'px';
/* fit document fit the screen, get the radix */
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var globalWidth = window.innerWidth// for judge the screen ??
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
    }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
