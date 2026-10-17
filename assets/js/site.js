// 壹點學園 · 站点交互：二级大菜单 + 移动端汉堡菜单 + 站内搜索
// 大菜单内容集中在 MEGA 数据表——想改二级菜单，只改这张表，全站自动同步。
(function () {
  'use strict';

  /* ============ 二级大菜单数据表（label, href） ============ */
  var MEGA = {
    'about.html': [
      { head: '探索 2048', items: [
        ['缘起与初心', '/about.html'],
        ['主理人崔老师', '/about.html'],
        ['我们在做什么', '/about.html']
      ]},
      { head: '加入我们', items: [
        ['成为会员', '/login.html'],
        ['联系小管家', '/about.html']
      ]}
    ],
    'library.html': [
      { head: '馆藏', items: [
        ['精读讲义', '/library.html'],
        ['双语电子书', '/library.html'],
        ['教练大咖精读', '/library.html']
      ]},
      { head: '延伸', items: [
        ['讲书播客', '/library.html'],
        ['术语研究', '/library.html']
      ]}
    ],
    'marathon.html': [
      { head: '早课马拉松', items: [
        ['与家庭一起改变', '/marathon/family.html'],
        ['没有疆界', '/marathon/boundary.html'],
        ['神奇的结构 2', '/marathon/structure2.html'],
        ['思考如何思考', '/marathon/thinking.html']
      ]}
    ],
    'coaching.html': [
      { head: '教练服务', items: [
        ['一对一教练', '/coaching.html'],
        ['团队陪跑', '/coaching.html']
      ]},
      { head: '专业研究', items: [
        ['MCC 研究中心', '/coaching.html'],
        ['核心胜任力', '/coaching.html'],
        ['PCC Marker 中译', '/coaching.html']
      ]}
    ],
    'business.html': [
      { head: '课程', items: [
        ['如何设计我们的产品逻辑', '/business.html'],
        ['决策沙盘工作坊', '/business.html']
      ]},
      { head: '学员成果', items: [
        ['MVP 作品集', '/business.html'],
        ['生命平衡轮仪表盘', '/business.html']
      ]}
    ],
    'ai.html': [
      { head: '人工智能', items: [
        ['Vibe Coding 课', '/ai.html'],
        ['AI 学习 wiki', '/ai.html']
      ]},
      { head: '共创', items: [
        ['AI 仪表盘', '/ai.html'],
        ['用 AI 做一本书', '/ai.html']
      ]}
    ],
    'art.html': [
      { head: '艺术鉴赏', items: [
        ['名画每日一读', '/art.html'],
        ['小楷与书法', '/art.html']
      ]},
      { head: '生活之美', items: [
        ['音乐与诵读', '/art.html'],
        ['器物之美', '/art.html']
      ]}
    ],
    'philosophy.html': [
      { head: '哲学思考', items: [
        ['说文解字', '/philosophy.html'],
        ['哲学精读', '/philosophy.html']
      ]},
      { head: '追问', items: [
        ['探寻纯粹的纯粹', '/philosophy.html'],
        ['每日一问', '/philosophy.html']
      ]}
    ],
    'cuisine.html': [
      { head: '私房菜', items: [
        ['崔老师食谱', '/cuisine.html'],
        ['饮食与健康', '/cuisine.html']
      ]},
      { head: '雅集', items: [
        ['私宴预约', '/cuisine.html'],
        ['节气饮食', '/cuisine.html']
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
      var key = (a.getAttribute('href') || '').split('/').pop();
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
    'marathon.html': '早课马拉松',
    'coaching.html': '教练',
    'business.html': '商学院',
    'ai.html': '人工智能',
    'art.html': '艺术鉴赏',
    'philosophy.html': '哲学思考',
    'cuisine.html': '私房菜'
  };

  /* 艺术鉴赏 · 名画每日一读各期（三级页面） */
  var ART_ISSUES = [
    { title: '千里江山图 · 名画每日一读 001', path: '/art/qianli-jiangshan.html', kw: '王希孟 北宋 青绿山水 千里江山 蔡京 传神' },
    { title: '洛神赋图 · 名画每日一读 002', path: '/art/luoshen-futu.html', kw: '顾恺之 洛神赋 东晋 摹本 传神写照 曹植' },
    { title: '步辇图 · 名画每日一读 003', path: '/art/bunian.html', kw: '阎立本 唐 步辇图 吐蕃 松赞干布 文成公主' },
    { title: '韩熙载夜宴图 · 名画每日一读 004', path: '/art/hanxizai.html', kw: '顾闳中 南唐 五代 韩熙载 夜宴 家具 服饰 断代' },
    { title: '清明上河图 · 名画每日一读 005', path: '/art/qingming-shanghe.html', kw: '张择端 北宋 清明上河图 开封 汴京 虹桥 界画 仇英 苏州片 宣和画谱' },
    { title: '溪山行旅图 · 名画每日一读 006', path: '/art/xishan-xinglv.html', kw: '范宽 北宋 溪山行旅图 雨点皴 巨碑式 董其昌 题跋 台北故宫 李霖灿 签名 米芾 画史 石渠宝笈' },
    { title: '雪江归棹图 · 名画每日一读 007', path: '/art/xuejiang-guizhao.html', kw: '宋徽宗 赵佶 雪江归棹图 代笔 蔡京 蔡絛 铁围山丛谈 董其昌 王维 吴其贞 徐邦达 古书画伪讹考辨 宣和画院 瘦金书 天下一人 李郭派 王诜 渔村小雪图 荆浩 石渠宝笈续编'},
    { title: '芙蓉锦鸡图 · 名画每日一读 008', path: '/art/furong-jinji.html', kw: '宋徽宗 赵佶 芙蓉锦鸡图 代笔 御题画 南宋馆阁续录 徐邦达 谢稚柳 傅熹年 余辉 显微检验 绢密度 经密 纬密 韩诗外传 五德 拒霜 凫鹥 宣和殿御制并书 天下一人 瘦金体 花押 画继 三舍 画院考试 蔡京 艾略特 Ibis 彭旻晟 张亚平 红腹锦鸡 白腹锦鸡 杂交 雉类图鉴 图画见闻志 宣和睿览册' },
    { title: '富春山居图 · 名画每日一读 009', path: '/art/fuchun-shanju.html', kw: '黄公望 富春山居图 元四家 大痴 子久 一峰道人 无用师 无用师卷 剩山图 子明卷 郑樗 金蓬头 全真教 道教 徐邦达 真伪本考辨 故宫博物院院刊 徐复观 明报月刊 翁同文 张光宾 傅申 王伯敏 单国强 许洪流 余辉 石渠宝笈三编 胡敬 乾隆 弘历 沈德潜 梁诗正 沈周 董其昌 邹之麟 刘珏 孔谔 吴之矩 吴洪裕 吴静庵 火殉 平沙五尺 骑缝印 至正七年 三远 披麻皴 逐渐填札 复笔 改笔 画中之兰亭 唐宇昭 油素本 王翚 启功 吴湖帆 冯翰林 富春山在桐庐 桐庐县 富阳县 知止堂 夏世泽 李日华 六研斋笔记 杨维桢 东维子集' },
    { title: '六君子图 · 名画每日一读 010', path: '/art/liujunzi.html', kw: '倪瓒 倪云林 六君子图 元四家 无锡 至正五年 1345 卢山甫 卢楞伽 白石先生 妙香道者 弓河 黄公望 大痴 黄子久 正直特立 居然相对 松 柏 樟 楠 槐 榆 鲁仲连 孔北海 庞德公 稽叔夜 陶元亮 王无功 李日华 君实 尚宝 竹懒画媵 汪砢玉 珊瑚网 孙承泽 庚子消夏录 北海 庞莱臣 虚斋名画录 味水轩日记 董其昌 玄赏斋 壬寅 王铎 崇祯十三年 成亲王 永瑆 许乃普 滇生过眼 周寿昌 荇农 王懿荣 正孺 陈鑅 安岐 仪周 刘靖基 上海博物馆 老陈 辨伪 皇帝的新装 四版本 伪作 临仿特征 三角形苔点 折带皴 叠糕坡 逸笔草草 不求形似 答张藻仲书 骊黄牝牡 聊以自娱 清閟阁集 何良俊 四友斋丛说 戒庵老人漫笔 清贤纪 黄苗子 倪瓒年谱 白冰 海德堡 祛魅 隐逸 雅集 三段式 一河两岸 渔庄秋霁 岸南双树 普林斯顿 陈传席 美术史论 谈福兴 生年 1306 1301 周南 墓志铭 赵淑 彦常 张雨 句曲外史 董源 米芾 米痴后一人 弧线 松林亭子图 容膝斋图'},
    { title: '鹊华秋色图 · 名画每日一读 011', path: '/art/quehua-qiuse.html', kw: '鹊华秋色图 赵孟頫 赵子昂 吴兴 松雪道人 元贞元年 1295 元代 山水 青绿 淡设色 平远 三段式 纸本 28.4 93.2 90.2 台北故宫 国立故宫博物院 故画001011N000000000 石渠宝笈 周密 公谨 弁阳老人 华不注山人 草窗 齐人 济南 齐州 济南路总管府事 趵突泉 大明湖 鹊山 华不注山 华不注 左氏 左传 峻峭特立 有足奇者 其东则鹊山也 命之曰鹊华秋色云 吴兴赵孟頫制 元贞元年十有十二月 董其昌 乙巳 万历三十三年 1605 武昌公廨 兼右丞北苑二家画法 有唐人之致去其纤 有北宋之雄去其犷 师法舍短 以肖似似古人不能变体为书奴 壬寅除夕 1602 项元汴 项墨林 项晦伯 项圣谟 戏鸿阁 莲社图 伯时 延津之剑 崇祯二年 1629 惠生 张雨 乾隆 爱新觉罗弘历 东华西鹊 乾隆十三年 1748 1749 东巡齐州 三希堂御笔 石渠宝笈初编 打入冷宫 大明岂是银河畔 何事居然架鹊桥 李杜诗情天水画 岂一时笔误欤 曹溶 纳兰明珠 纳兰性德 梁清标 蕉林 胶州 张若麒 张应甲 宋荦 欧阳玄 虞集 范梈 范杼 杨载 元诗四大家 君锡 崇古斋 蚤岁戏墨 百世后可为一代规式 书法晋画师唐 非贵其名而以其实也 殊胜于别作 一洗工气 李铸晋 高居翰 隔江山色 古怪得扣人心弦 丁羲元 徐小虎 伪托本 张恒奎 主体真两处题跋假 鄺若銘 造形藝術學刊 元人題跋分析與考證 元贞二年 1296 云烟过眼录 志雅堂杂钞 并非著录 澎湃 视角 由南朝北 左西右东 记忆转换 视觉经验 北京青年报 李白 陪从祖济南太守泛鹊山湖三首 遥看鹊山转 却似送人来 水经注 单椒秀泽 不连丘陵以自高 披麻皴 荷叶皴 解索皴 篆籀 书画同源 破墨 石如飞白木如籀 写竹还于八法通 点叶法 介字 垂头 胡椒 芝麻 小圆 半圈 高粱 乃孟頫独创 平远法 郭熙 方闻 虚实关系 地平线 南宋画法 深刻影响 高克恭 钱选 王维 辋川图 兰亭序 董源 巨然 寒林重汀图 范宽 溪山行旅图 花青 石青 石绿 植物颜料 董其昌对晚明青绿山水画发展大转变的作用 拖尾 320.2 引首 隔水 绫 装裱 末次装裱 不晚于万历元年 1573 文彭 印章 开放数据 CC BY 4.0 高清图档' },
  ];

  /* ============ 站内搜索（导航放大镜） ============ */
  function initSearch() {
    var sPanel = document.getElementById('search-panel');
    var sToggle = document.getElementById('search-toggle');
    var sInput = document.getElementById('search-input');
    var sClose = document.getElementById('search-close');
    var sResults = document.getElementById('search-results');
    if (!sPanel || !sToggle) return;

    var PAGES = Object.keys(NAV_LABELS).map(function (k) {
      return { title: NAV_LABELS[k], path: '/' + k, kw: '' };
    }).concat(ART_ISSUES);

    function openPanel() { sPanel.classList.add('open'); if (sInput) sInput.focus(); }
    function closePanel() { sPanel.classList.remove('open'); }
    function render(q) {
      if (!sResults) return;
      var kw = (q || '').trim();
      if (!kw) {
        sResults.innerHTML = '<li class="search-hint">输入关键词，搜索壹點學園的内容</li>';
        return;
      }
      var hits = PAGES.filter(function (p) {
        var hay = p.title + ' ' + (p.kw || '');
        return hay.toLowerCase().indexOf(kw.toLowerCase()) >= 0;
      });
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
