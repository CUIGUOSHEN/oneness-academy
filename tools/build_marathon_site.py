#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成「早课马拉松」栏目页面，输出到官网 github-site：
  二级  marathon.html                         （课程列表，一行一行）
  三级  marathon/<slug>.html                  （课程内容 = 论文目录）
  四级  marathon/papers/<slug>/<date>_<DNN>.html （每日论文全文）

页面统一用根绝对路径（/assets/... /marathon/...），适配 GitHub Pages。
"""
import re
import os
import markdown

SRC = "/Users/cuiguoshenlucky/WorkBuddy/2048 网站/早课马拉松_论文源"
DST = "/Users/cuiguoshenlucky/WorkBuddy/2048 网站/site"

COURSES = [
    {
        "dir": "与家庭一起改变",
        "slug": "family",
        "name": "与家庭一起改变",
        "en": "Virginia Satir · 萨提亚家庭治疗",
        "accent": "#e8682a",
        "desc": "萨提亚家庭治疗的精读。4+1 应对姿态、倒奔驰模型（自己—他人—情境）、具身化——从家庭关系看清「人何以如此」。",
    },
    {
        "dir": "没有疆界",
        "slug": "boundary",
        "name": "没有疆界",
        "en": "Ken Wilber · No Boundary",
        "accent": "#3b5a7a",
        "desc": "肯·威尔伯《没有疆界》的心法精读。地图不是疆域、意识光谱、三层健康——把内心的容量从一杯水扩成大海。",
    },
    {
        "dir": "神奇的结构2",
        "slug": "structure2",
        "name": "神奇的结构 2",
        "en": "Bandler & Grinder · The Structure of Magic II",
        "accent": "#2f8c7c",
        "desc": "班德勒与葛瑞德《神奇的结构二》的语义学进阶。后设模式、表象系统、删减／扭曲／一般化——听出语言背后的深层结构。",
    },
    {
        "dir": "思考如何思考",
        "slug": "thinking",
        "name": "思考如何思考",
        "en": "Thinking About Thinking with NLP",
        "accent": "#c14b63",
        "desc": "以 NLP 之眼反观「思考」本身。分块、跟随、目标状态、顺势而用——把思考的技艺再想深一层。",
    },
]

MD = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists"])


def md_to_html(text):
    MD.reset()
    return MD.convert(text)


def parse_paper(path, course):
    """解析一篇论文，返回元数据 + 摘要/关键词/正文 HTML。"""
    with open(path, encoding="utf-8") as f:
        text = f.read()

    lines = text.split("\n")
    title_line = lines[0].strip()
    m = re.match(r"#\s*.*?·\s*(D\d+)\s*[:：]\s*(.*)", title_line)
    dnn = m.group(1)
    topic = m.group(2).strip()

    subtitle = ""
    for ln in lines[1:6]:
        sm = re.match(r"<!--\s*subtitle:\s*(.*?)\s*-->", ln)
        if sm:
            subtitle = sm.group(1).strip()
            break

    body = re.sub(r"^#\s*.*$", "", text, count=1, flags=re.M)
    body = re.sub(r"<!--\s*subtitle:.*?-->\s*", "", body, count=1)

    abstract = ""
    am = re.search(r"##\s*摘要\s*\n+(.*?)\n\*\*关键词\*\*", body, flags=re.S)
    if am:
        abstract = am.group(1).strip()

    keywords = ""
    km = re.search(r"\*\*关键词\*\*\s*[:：]\s*(.*)", body)
    if km:
        keywords = km.group(1).strip()

    body = re.sub(
        r"##\s*摘要\s*\n+.*?\*\*关键词\*\*\s*[:：]\s*.*?\n",
        "", body, count=1, flags=re.S,
    ).strip()

    date = os.path.basename(path).split("_")[0]

    return {
        "course": course,
        "dnn": dnn,
        "topic": topic,
        "subtitle": subtitle,
        "date": date,
        "abstract": abstract,
        "keywords": keywords,
        "body_html": md_to_html(body),
    }


# ---------------- 模板 ----------------

NAV_ABS = """<nav class="globalnav" aria-label="全局导航">
  <div class="globalnav-content">
    <a class="nav-logo" href="/index.html" aria-label="壹點學園首页">
      <img src="/assets/img/logo-red-128.png" alt="壹點學園" width="22" height="22">
    </a>
    <div class="nav-menu">
      <a href="/about.html">2048</a>
      <a href="/library.html">图书馆</a>
      <a href="/marathon.html">早课马拉松</a>
      <a href="/coaching.html">教练</a>
      <a href="/business.html">商学院</a>
      <a href="/ai.html">人工智能</a>
      <a href="/art.html">艺术鉴赏</a>
      <a href="/philosophy.html">哲学思考</a>
      <a href="/cuisine.html">私房菜</a>
    </div>
    <div class="nav-actions">
      <button class="nav-search" id="search-toggle" aria-label="搜索">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.5" y2="16.5"></line></svg>
      </button>
      <a class="nav-login" href="/login.html">登录</a>
    </div>
  </div>
  <div class="search-panel" id="search-panel">
    <div class="search-inner">
      <div class="search-box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.5" y2="16.5"></line></svg>
        <input type="text" id="search-input" placeholder="搜索壹點學園">
        <button class="search-close" id="search-close" aria-label="关闭搜索">&times;</button>
      </div>
      <ul class="search-results" id="search-results"></ul>
    </div>
  </div>
</nav>"""

FOOTER_ABS = """<footer class="footer">
  <div class="footer-content">
    <div class="footer-links">
      <a href="/about.html">关于我们</a>
      <a href="/about.html">主理人介绍</a>
      <a href="#">联系我们</a>
      <a href="#">招生咨询</a>
      <a href="#">合作洽谈</a>
      <a href="#">隐私政策</a>
      <a href="#">使用条款</a>
      <a href="#">网站地图</a>
    </div>
    <div class="footer-legal">
      <span>Copyright © 2026 壹點學園 Oneness Academy. 保留所有权利。</span>
      <span>京ICP备XXXXXXXX号-1（占位，替换为实际备案号）</span>
    </div>
    <div class="footer-brand">
      <img src="/assets/img/logo-red-128.png" alt="壹點學園" width="18" height="18">
      <span>壹點學園 · 学习型组织的入口</span>
    </div>
  </div>
</footer>"""


def page(title, desc, body_html):
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" type="image/png" href="/assets/img/logo-red-128.png">
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>

<div class="rainbow-bar" aria-hidden="true"></div>

{NAV_ABS}

{body_html}

{FOOTER_ABS}

<script src="/assets/js/site.js"></script>
</body>
</html>"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def course_row(c):
    return f"""<a class="course-row" style="--accent:{c['accent']}" href="/marathon/{c['slug']}.html">
  <div class="course-row-mark" aria-hidden="true">{c['name'][0]}</div>
  <div class="course-row-main">
    <div class="course-row-head">
      <h3>{esc(c['name'])}</h3>
      <span class="course-row-count">{c['count']} 篇</span>
    </div>
    <p class="course-row-en">{esc(c['en'])}</p>
    <p class="course-row-desc">{esc(c['desc'])}</p>
  </div>
  <span class="course-row-go">进入 &gt;</span>
</a>"""


def paper_row(p):
    return f"""<a class="paper-row" href="/marathon/papers/{p['course']['slug']}/{p['date']}_{p['dnn']}.html">
  <span class="paper-row-date">{p['date']}</span>
  <span class="paper-row-dnn">{p['dnn']}</span>
  <span class="paper-row-title">{esc(p['topic'])}</span>
  <span class="paper-row-go">&gt;</span>
</a>"""


# ---------------- 扫描 ----------------

papers_by_course = {c["slug"]: [] for c in COURSES}
for c in COURSES:
    d = os.path.join(SRC, c["dir"])
    for fn in sorted(os.listdir(d)):
        if fn.endswith(".md"):
            p = parse_paper(os.path.join(d, fn), c)
            papers_by_course[c["slug"]].append(p)
    c["count"] = len(papers_by_course[c["slug"]])

os.makedirs(os.path.join(DST, "marathon", "papers"), exist_ok=True)

# ---------------- 二级：marathon.html（课程列表） ----------------

course_rows = "\n".join(course_row(c) for c in COURSES)
total = sum(c["count"] for c in COURSES)

marathon_body = f"""<header class="page-hero">
  <img class="page-logo" src="/assets/img/logo-red-128.png" alt="" width="64" height="64">
  <h1>早课马拉松</h1>
  <p class="page-sub">每个清晨，用一堂课丈量时间。7 点讲招数，8 点讲内功——一日一课，一课一论文。</p>
  <div class="page-rule"></div>
</header>

<main class="page-body">
  <div class="marathon-wrap">
    <p class="marathon-lead">已收录 <strong>{total}</strong> 篇学习论文，分属 <strong>{len(COURSES)}</strong> 门课程。点一门课，看它的全部讲次；点进某讲，读当天的论文。</p>
    <div class="course-list">
{course_rows}
    </div>
  </div>
  <a class="back-home" href="/index.html">返回首页 &gt;</a>
</main>"""

with open(os.path.join(DST, "marathon.html"), "w", encoding="utf-8") as f:
    f.write(page(
        "早课马拉松 · 壹點學園 Oneness Academy",
        "每个清晨用一堂课丈量时间。7 点讲招数，8 点讲内功——一日一课，一课一论文。",
        marathon_body,
    ))

# ---------------- 三级：marathon/<slug>.html（课程内容） ----------------

for c in COURSES:
    ps = papers_by_course[c["slug"]]
    rows = "\n".join(paper_row(p) for p in ps)
    body = f"""<header class="page-hero">
  <img class="page-logo" src="/assets/img/logo-red-128.png" alt="" width="64" height="64">
  <h1>{esc(c['name'])}</h1>
  <p class="page-sub">{esc(c['en'])}</p>
  <div class="page-rule"></div>
</header>

<main class="page-body">
  <div class="marathon-wrap">
    <p class="marathon-lead">{esc(c['desc'])}</p>
    <div class="crumbs"><a href="/index.html">首页</a> <span>›</span> <a href="/marathon.html">早课马拉松</a> <span>›</span> <span class="crumbs-here">{esc(c['name'])}</span></div>
    <div class="paper-list">
{rows}
    </div>
  </div>
  <a class="back-home" href="/marathon.html">返回早课马拉松 &gt;</a>
</main>"""
    outdir = os.path.join(DST, "marathon")
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, f"{c['slug']}.html"), "w", encoding="utf-8") as f:
        f.write(page(
            f"{c['name']} · 早课马拉松 · 壹點學園",
            c["desc"],
            body,
        ))

# ---------------- 四级：marathon/papers/<slug>/<date>_<DNN>.html ----------------

for c in COURSES:
    outdir = os.path.join(DST, "marathon", "papers", c["slug"])
    os.makedirs(outdir, exist_ok=True)
    for p in papers_by_course[c["slug"]]:
        fn = f"{p['date']}_{p['dnn']}.html"
        abstract_html = md_to_html(p["abstract"]) if p["abstract"] else ""
        kw_html = esc(p["keywords"]) if p["keywords"] else ""
        sub_html = esc(p["subtitle"]) if p["subtitle"] else ""
        body = f"""<header class="page-hero page-hero-paper">
  <div class="paper-tag">{esc(c['name'])} · {p['dnn']} · {p['date']}</div>
  <h1>{esc(p['topic'])}</h1>
  <p class="page-sub">{sub_html}</p>
  <div class="page-rule"></div>
</header>

<main class="page-body page-body-paper">
  <div class="crumbs"><a href="/index.html">首页</a> <span>›</span> <a href="/marathon.html">早课马拉松</a> <span>›</span> <a href="/marathon/{c['slug']}.html">{esc(c['name'])}</a> <span>›</span> <span class="crumbs-here">{esc(p['topic'])}</span></div>
  <article class="article">
    <div class="paper-abstract">{abstract_html}</div>
    <div class="paper-keywords"><strong>关键词</strong>：{kw_html}</div>
    <div class="paper-body">
{p['body_html']}
    </div>
  </article>
  <a class="back-home" href="/marathon/{c['slug']}.html">返回课程目录 &gt;</a>
</main>"""
        desc = re.sub(r"\s+", " ", p["abstract"])[:80]
        with open(os.path.join(outdir, fn), "w", encoding="utf-8") as f:
            f.write(page(
                f"{p['topic']} · {c['name']} · 壹點學園",
                desc,
                body,
            ))

print(f"生成完成：二级 1 页 + 三级 {len(COURSES)} 页 + 四级 {total} 页 = {1 + len(COURSES) + total} 页")
for c in COURSES:
    print(f"  {c['name']}: {c['count']} 篇")
