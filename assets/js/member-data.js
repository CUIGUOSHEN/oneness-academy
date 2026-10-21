// ============================================================
// 壹點學園 · 会员客户界面 · 数据层（demo）
// 维护说明：
//   · MEMBERS  —— 客户表：账号 / 密码 / 姓名 / 标签（tags）/ 是否内容管理员
//   · TAGS     —— 标签字典（客户按标签看到对应课程）
//   · COURSES  —— 课程表：每课含课时列表；replay 为腾讯会议回放链接，
//                 留空表示待管理员在课程观看页「课程内容设置」中粘贴。
//   · 回放链接的本地覆盖存储：localStorage['oneness_replay_<课程id>_<课时序号>']
// ============================================================
window.ONENESS_DATA = {

  /* 标签字典：客户标签 → 显示名 */
  TAGS: {
    art: '艺术课',
    marathon: '早课',
    coaching: '教练进阶',
    vibe: 'Vibe Coding'
  },

  /* 未打标签学员的默认可见课程（默认全部；管理员在会员后台打标签后按标签分发） */
  DEFAULT_TAGS: ['art', 'marathon', 'coaching', 'vibe'],

  /* 客户表（云端标签优先；本表用于演示账号与老板权限兜底）
     cuiguoshen@pku.edu.cn —— 崔老师本人：强制全课程 + 课程内容设置权限 */
  MEMBERS: {
    test: {
      pass: '123456',
      name: '演示学员',
      tags: ['art', 'marathon'],   // test 客户：艺术课 + 早课
      joined: '2026-10-21',
      isAdmin: true                // 演示客户同时具备「课程内容设置」权限，方便演示粘贴回放链接
    },
    'cuiguoshen@pku.edu.cn': {
      pass: null,                  // 走云端邮箱+密码登录，本地不存密码
      name: '崔国申',
      tags: ['art', 'marathon', 'coaching', 'vibe'],  // 所有课程
      joined: '2026-10-11',
      isAdmin: true
    }
  },

  /* 课程表 */
  COURSES: [
    {
      id: 'art-daily',
      tag: 'art',
      mark: '美',
      color: '#c14b63',
      title: '艺术鉴赏 · 名画每日一读',
      en: 'Daily Art Reading',
      desc: '每期一幅名画，深度读解——在美之中，安顿心灵。',
      lessons: [
        { no: '01', title: '千里江山图',   page: 'art/qianli-jiangshan.html',  replay: '' },
        { no: '02', title: '洛神赋图',     page: 'art/luoshen-futu.html',      replay: '' },
        { no: '03', title: '步辇图',       page: 'art/bunian.html',            replay: '' },
        { no: '04', title: '韩熙载夜宴图', page: 'art/hanxizai.html',          replay: '' },
        { no: '05', title: '清明上河图',   page: 'art/qingming-shanghe.html',  replay: '' },
        { no: '06', title: '富春山居图',   page: 'art/fuchun-shanju.html',     replay: '' },
        { no: '07', title: '溪山行旅图',   page: 'art/xishan-xinglv.html',     replay: '' },
        { no: '08', title: '鹊华秋色图',   page: 'art/quehua-qiuse.html',      replay: '' },
        { no: '09', title: '芙蓉锦鸡图',   page: 'art/furong-jinji.html',      replay: '' },
        { no: '10', title: '六君子图',     page: 'art/liujunzi.html',          replay: '' },
        { no: '11', title: '秋山问道图',   page: 'art/qiushan-wendao.html',    replay: '' },
        { no: '12', title: '雪江归棹图',   page: 'art/xuejiang-guizhao.html',  replay: '' }
      ]
    },
    {
      id: 'marathon',
      tag: 'marathon',
      mark: '晨',
      color: '#cf7a2a',
      title: '早课马拉松',
      en: 'Morning Marathon',
      desc: '一日一课一论文，把读过的书沉淀成思想。',
      lessons: [
        { no: '01', title: '思考如何思考', page: 'marathon/thinking.html',   replay: '' },
        { no: '02', title: '没有疆界',     page: 'marathon/boundary.html',   replay: '' },
        { no: '03', title: '与家庭一起改变', page: 'marathon/family.html',   replay: '' },
        { no: '04', title: '神奇的结构 2', page: 'marathon/structure2.html', replay: '' }
      ]
    }
  ]
};
