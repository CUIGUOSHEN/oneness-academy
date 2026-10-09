// 壹點學園 · 站点交互：二级大菜单 + 移动端汉堡菜单 + 站内搜索
// 大菜单内容集中在 MEGA 数据表——想改二级菜单，只改这张表，全站自动同步。
(function () {
  'use strict';

  /* ============ 二级大菜单数据表（label, href） ============ */
  var MEGA = {
    'about.html': [
      { head: '探索 2048', items: [
        ['缘起与初心', 'about.html'],
        ['主理人崔老师', 'about.html'],
        ['我们在做什么', 'about.html']
      ]},
      { head: '加入我们', items: [
        ['成为会员', 'login.html'],
        ['联系小管家', 'about.html']
      ]}
    ],
    'library.html': [
      { head: '馆藏', items: [
        ['精读讲义', 'library.html'],
        ['双语电子书', 'library.html'],
        ['教练大咖精读', 'library.html']
      ]},
      { head: '延伸', items: [
        ['讲书播客', 'library.html'],
        ['术语研究', 'library.html']
      ]}
    ],
    'coaching.html': [
      { head: '教练服务', items: [
        ['一对一教练', 'coaching.html'],
        ['团队陪跑', 'coaching.html']
      ]},
      { head: '专业研究', items: [
        ['MCC 研究中心', 'coaching.html'],
        ['核心胜任力', 'coaching.html'],
        ['PCC Marker 中译', 'coaching.html']
      ]}
    ],
    'business.html': [
      { head: '课程', items: [
        ['如何设计我们的产品逻辑', 'business.html'],
        ['决策沙盘工作坊', 'business.html']
      ]},
      { head: '学员成果', items: [
        ['MVP 作品集', 'business.html'],
        ['生命平衡轮仪表盘', 'business.html']
      ]}
    ],
    'ai.html': [
      { head: '人工智能', items: [
        ['Vibe Coding 课', 'ai.html'],
        ['AI 学习 wiki', 'ai.html']
      ]},
      { head: '共创', items: [
        ['AI 仪表盘', 'ai.html'],
        ['用 AI 做一本书', 'ai.html']
      ]}
    ],
    'art.html': [
      { head: '艺术鉴赏', items: [
        ['名画每日一读', 'art.html'],
        ['小楷与书法', 'art.html']
      ]},
      { head: '生活之美', items: [
        ['音乐与诵读', 'art.html'],
        ['器物之美', 'art.html']
      ]}
    ],
    'philosophy.html': [
      { head: '哲学思考', items: [
        ['说文解字', 'philosophy.html'],
        ['哲学精读', 'philosophy.html']
      ]},
      { head: '追问', items: [
        ['探寻纯粹的纯粹', 'philosophy.html'],
        ['每日一问', 'philosophy.html']
      ]}
    ],
    'cuisine.html': [
      { head: '私房菜', items: [
        ['崔老师食谱', 'cuisine.html'],
        ['饮食与健康', 'cuisine.html']
      ]},
      { head: '雅集', items: [
        ['私宴预约', 'cuisine.html'],
        ['节气饮食', 'cuisine.html']
      ]}
    ]
  };

  /* ============ 工具 ============ */
  var nav = document.querySelector('.globalnav');
  if (!nav) return;
  var isMobile = function () { return window.matchMedia('(max-width: 834px)').matches; };

  /* ============ 二级大菜单（桌面端 hover 展开） ============ */
  var panel = null;
  var overlay = null;

  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'mega-panel';
    nav.appendChild(panel);
    overlay = document.createElement('div');
    overlay.className = 'dim-overlay';
    document.body.appendChild(overlay);
  }

  function renderPanel(key) {
    var cols = MEGA[key];
    if (!cols) return false;
    panel.innerHTML = cols.map(function (col, i) {
      return '<div class="mega-col">' +
        '<div class="mega-col-head">' + col.head + '</div>' +
        col.items.map(function (it) {
          return '<a href="' + it[1] + '"' + (i > 0 ? ' class="mega-soft"' : '') + '>' + it[0] + '</a>';
        }).join('') +
        '</div>';
    }).join('');
    return true;
  }

  function openMega(key) {
    if (!renderPanel(key)) return;
    panel.classList.add('open');
    overlay.classList.add('show');
  }
  function closeMega() {
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  }

  function initMega() {
    buildPanel();
    var menuLinks = nav.querySelectorAll('.nav-menu a');
    menuLinks.forEach(function (a) {
      var key = a.getAttribute('href');
      a.addEventListener('mouseenter', function () {
        if (!isMobile()) openMega(key);
      });
    });
    nav.addEventListener('mouseleave', closeMega);
    nav.addEventListener('mouseenter', function () {
      // 移回导航条（未悬停具体项）时保持面板，不额外处理
    });
    window.addEventListener('scroll', closeMega, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMega();
    });
  }

  /* ============ 移动端汉堡菜单（手风琴） ============ */
  function buildMobile() {
    var burger = document.createElement('button');
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', '打开菜单');
    burger.innerHTML = '<span></span><span></span>';
    nav.querySelector('.globalnav-content').appendChild(burger);

    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.innerHTML = Object.keys(MEGA).map(function (key) {
      var group = MEGA[key][0];
      var label = group.items[0][0] && NAV_LABELS[key] ? NAV_LABELS[key] : key;
      var subs = [];
      MEGA[key].forEach(function (col) {
        subs.push('<div class="mega-col-head">' + col.head + '</div>');
        col.items.forEach(function (it) {
          subs.push('<a href="' + it[1] + '">' + it[0] + '</a>');
        });
      });
      return '<div class="mm-group">' +
        '<button class="mm-head" data-href="' + key + '"><span>' + label + '</span><i class="mm-chevron"></i></button>' +
        '<div class="mm-sub">' + subs.join('') + '</div>' +
        '</div>';
    }).join('');
    document.body.appendChild(menu);

    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('mobile-open');
      burger.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });
    menu.addEventListener('click', function (e) {
      var head = e.target.closest('.mm-head');
      if (head) {
        var g = head.parentElement;
        var wasOpen = g.classList.contains('open');
        menu.querySelectorAll('.mm-group.open').forEach(function (x) { x.classList.remove('open'); });
        if (!wasOpen) g.classList.add('open');
      }
    });
    window.addEventListener('resize', function () {
      if (!isMobile() && document.body.classList.contains('mobile-open')) {
        document.body.classList.remove('mobile-open');
      }
    });
  }

  var NAV_LABELS = {
    'about.html': '2048',
    'library.html': '图书馆',
    'coaching.html': '教练',
    'business.html': '商学院',
    'ai.html': '人工智能',
    'art.html': '艺术鉴赏',
    'philosophy.html': '哲学思考',
    'cuisine.html': '私房菜'
  };

  /* ============ 站内搜索（导航放大镜） ============ */
  function initSearch() {
    var sPanel = document.getElementById('search-panel');
    var sToggle = document.getElementById('search-toggle');
    var sInput = document.getElementById('search-input');
    var sClose = document.getElementById('search-close');
    var sResults = document.getElementById('search-results');
    if (!sPanel || !sToggle) return;

    var PAGES = Object.keys(NAV_LABELS).map(function (k) {
      return { title: NAV_LABELS[k], path: k };
    });

    function openPanel() { sPanel.classList.add('open'); if (sInput) sInput.focus(); }
    function closePanel() { sPanel.classList.remove('open'); }
    function render(q) {
      if (!sResults) return;
      var kw = (q || '').trim();
      if (!kw) {
        sResults.innerHTML = '<li class="search-hint">输入关键词，搜索壹點學園的内容</li>';
        return;
      }
      var hits = PAGES.filter(function (p) { return p.title.indexOf(kw) >= 0; });
      if (!hits.length) {
        sResults.innerHTML = '<li class="search-hint">未找到与「' + kw + '」相关的页面</li>';
        return;
      }
      sResults.innerHTML = hits.map(function (p) {
        return '<li><a href="' + p.path + '">' + p.title + '</a></li>';
      }).join('');
    }

    sToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (sPanel.classList.contains('open')) closePanel(); else openPanel();
    });
    if (sClose) sClose.addEventListener('click', closePanel);
    if (sInput) sInput.addEventListener('input', function () { render(sInput.value); });
    document.addEventListener('click', function (e) {
      if (!sPanel.contains(e.target) && e.target !== sToggle) closePanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });
  }

  /* ============ 启动 ============ */
  initMega();
  buildMobile();
  initSearch();
})();
