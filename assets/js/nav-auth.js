/* ============================================================
   壹點學園 · 全站导航登录态（nav-auth.js）
   作用：任何页面引入后，若检测到有效登录会话，
   把导航里的「登录」链接替换为「头像 + 昵称」，点击进个人中心。
   会话格式校验：缺 user 或 tags 非数组 → 视为无效，保持「登录」。
   ============================================================ */
(function () {
  'use strict';
  var sess = null;
  try { sess = JSON.parse(localStorage.getItem('oneness_login') || 'null'); } catch (e) { return; }
  if (!sess || !sess.user || !Array.isArray(sess.tags)) return;

  // 找导航里指向 login.html 的链接（兼容子目录相对路径 ../login.html）
  var link = document.querySelector('a[href$="login.html"]');
  if (!link) return;

  var name = sess.name || sess.user;
  var initial = name.charAt(0);
  var homeHref = link.getAttribute('href').replace(/login\.html$/, 'member-home.html');

  var wrap = document.createElement('a');
  wrap.href = homeHref;
  wrap.className = 'nav-member-link';
  wrap.title = '进入个人中心';
  wrap.innerHTML = '<span class="nav-avatar" aria-hidden="true">' + initial + '</span>' +
                   '<span class="nav-member-name">' + name + '</span>';
  link.parentNode.replaceChild(wrap, link);
})();
