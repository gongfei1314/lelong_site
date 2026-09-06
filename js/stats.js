/* ============================================================
 * 51LA 网站访问统计（V6，LA.init 方式）
 * 使用方法：
 *   1. 到 https://v6.51.la 注册并登录（免费）
 *   2. 应用管理 → 添加应用，域名填 lerongjc.com
 *   3. 选择「普通安装」，复制生成的代码，把其中
 *      id:"xxxx" 和 ck:"xxxx" 两个值填到下面
 *   4. 发布即可，后台「配置检查」可验证是否生效
 * 未配置时本脚本不加载任何第三方资源，页面零影响。
 * ============================================================ */
(function () {
  var LA_ID = '3R7ALfEnVzKgbBhF'; /* 51LA 统计 ID */
  var LA_CK = '3R7ALfEnVzKgbBhF'; /* 51LA 掩码 CK */

  if (LA_ID.indexOf('HERE_') === 0) return;

  var s = document.createElement('script');
  s.charset = 'UTF-8';
  s.id = 'LA_COLLECT';
  s.src = 'https://sdk.51.la/js-sdk-pro.min.js';
  s.async = true;
  s.onload = function () {
    if (window.LA && typeof window.LA.init === 'function') {
      window.LA.init({ id: LA_ID, ck: LA_CK, autoTrack: true, hashMode: true });
    }
  };
  document.head.appendChild(s);
})();
