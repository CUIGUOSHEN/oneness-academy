// 壹點學園 · 站内搜索交互（导航放大镜）
(function () {
  var panel = document.getElementById('search-panel');
  var toggle = document.getElementById('search-toggle');
  var input = document.getElementById('search-input');
  var closeBtn = document.getElementById('search-close');
  var results = document.getElementById('search-results');
  if (!panel || !toggle) return;

  var PAGES = [
    { title: '2048', path: 'about.html' },
    { title: '图书馆', path: 'library.html' },
    { title: '教练', path: 'coaching.html' },
    { title: '商学院', path: 'business.html' },
    { title: '人工智能', path: 'ai.html' },
    { title: '艺术鉴赏', path: 'art.html' },
    { title: '哲学思考', path: 'philosophy.html' },
    { title: '私房菜', path: 'cuisine.html' }
  ];

  function openPanel() {
    panel.classList.add('open');
    if (input) input.focus();
  }
  function closePanel() {
    panel.classList.remove('open');
  }
  function render(q) {
    if (!results) return;
    var kw = (q || '').trim();
    if (!kw) {
      results.innerHTML = '<li class="search-hint">输入关键词，搜索壹點學園的内容</li>';
      return;
    }
    var hits = PAGES.filter(function (p) { return p.title.indexOf(kw) >= 0; });
    if (!hits.length) {
      results.innerHTML = '<li class="search-hint">未找到与「' + kw + '」相关的页面</li>';
      return;
    }
    results.innerHTML = hits.map(function (p) {
      return '<li><a href="' + p.path + '">' + p.title + '</a></li>';
    }).join('');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (panel.classList.contains('open')) { closePanel(); } else { openPanel(); }
  });
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (input) input.addEventListener('input', function () { render(input.value); });
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== toggle) closePanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });
})();
