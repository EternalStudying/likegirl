# DESIGN.md

> 把首页从“目录入口”升级为“情侣今日手账仪表盘”：成熟网页的信息层级，保留 LikeGirl 的水彩、纸张、温柔纪念册气质。

## 1. Visual Theme & Atmosphere

**Style**: Cozy Scrapbook Dashboard  
**Keywords**: 手账纸张、撕边便签、温柔水彩、恋爱仪表盘、暖奶油色、旧相纸、胶带贴纸、轻量动效  
**Tone**: 成熟、有秩序、亲密、温柔，NOT 企业 SaaS、冷硬后台、霓虹潮流、卡片堆砌。  
**Feel**: 像两个人每天早上翻开的共享小纸袋，里面有天气、距离、心情、照片和下一件想一起完成的事。

**Interaction Tier**: L2 流畅交互  
**Dependencies**: Vue 3 + CSS only。不要新增 GSAP、Lenis、canvas 或 WebGL。  

**Page Direction**:
- 保留现有成熟首屏结构：顶部细导航、全宽水彩 hero、波浪纸边、胶囊导航、居中标题、大纪念日卡片。
- 在首屏下方新增截图式“今日手账仪表盘”：今日小纸条、我们的今日状态、恋爱进度仪表、最近发生的小事、下一件想一起完成的事。
- 页面不是后台 dashboard，而是“生活手账”：信息密度可以提高，但每个模块都应像被贴在同一页纸上的小物件。

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #fff8f2;
  --bg-rgb: 255, 248, 242;
  --bg-dotted: #f8ead9;
  --surface: #fffdf9;
  --surface-rgb: 255, 253, 249;
  --surface-alt: #fff4e6;
  --surface-hover: #fff9f0;
  --paper-note: #fffaf0;
  --paper-lined: #fff8ec;
  --paper-sage: #dfe3c8;

  /* Borders */
  --border: #ead4c0;
  --border-rgb: 234, 212, 192;
  --border-hover: #e7bd8e;
  --paper-line: rgba(126, 85, 52, 0.14);

  /* Text */
  --text: #37231f;
  --text-rgb: 55, 35, 31;
  --text-secondary: #6f5a4d;
  --text-tertiary: #8a766d;
  --text-soft: #9c8171;

  /* Accent */
  --accent: #df5145;
  --accent-rgb: 223, 81, 69;
  --accent-hover: #c84238;
  --accent-soft: #ffd9cc;
  --orange: #f28a2e;
  --orange-rgb: 242, 138, 46;
  --gold: #c78a19;
  --gold-rgb: 199, 138, 25;
  --ink-green: #214f3f;
  --ink-green-rgb: 33, 79, 63;
  --sage: #8d9a73;
  --deep-coral: #9f322b;

  /* Semantic */
  --success: #3f7a55;
  --error: #b83b33;
  --warning: #c78a19;

  /* Effects */
  --shadow-paper: 0 16px 34px rgba(111, 58, 35, 0.12);
  --shadow-float: 0 22px 46px rgba(111, 58, 35, 0.16);
  --shadow-tiny: 0 7px 16px rgba(111, 58, 35, 0.1);
}
```

**Color Rules:**
- 所有新增样式必须优先引用 CSS 变量；确需新增颜色时先补变量，再使用。
- 同一模块最多使用 1 个主强调色和 1 个辅助强调色，避免截图式模块变花。
- 大面积背景只用奶油、纸白、浅橘、浅鼠尾草绿；红色只用于重点数字、按钮和小心形。
- 天气层可以染色顶栏和页面，但内容卡片必须保持可读。
- 禁止把当前暖色系统替换为蓝紫、纯白灰或黑色科技感。

## 3. Typography Rules

**Font Stack:**

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700;900&display=swap');

:root {
  --font-serif: "Noto Serif SC", "Source Han Serif SC", "思源宋体", "Songti SC", "STSong", "SimSun", Georgia, "Times New Roman", serif;
  --font-script: "Segoe Script", "Brush Script MT", "Noto Serif SC", serif;
  --font-number: Georgia, "Times New Roman", "Noto Serif SC", serif;
}
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | `--font-serif` | `clamp(2rem, 4vw, 3.45rem)` | 900 | 1.12 | 0 |
| Section H2 | `--font-serif` | `clamp(1.45rem, 2.6vw, 2.1rem)` | 900 | 1.2 | 0 |
| Card H3 | `--font-serif` | `clamp(1.05rem, 1.45vw, 1.35rem)` | 900 | 1.25 | 0 |
| Body | `--font-serif` | `1rem` | 500 | 1.7 | 0 |
| Label | `--font-serif` | `0.82rem` | 800 | 1.2 | 0.02em |
| Number | `--font-number` | `clamp(2.6rem, 5vw, 4.6rem)` | 500 | 0.95 | 0 |

**Typography Rules:**
- 中文标题要有“手写纸面”的厚度，优先 800/900，不使用负字距。
- 英文小标题保持短、轻、装饰性，例如 `Our Cozy Place`、`Memory Index`。
- 数字是页面视觉锚点，使用 Georgia 风格衬线数字，颜色用 `--deep-coral`、`--gold`、`--ink-green` 分区。
- 卡片内正文不超过两行；长内容进入详情页，首页只放摘要。
- **NEVER use**: Arial、Roboto、Inter 作为主视觉字体；不要用等宽字体做浪漫页面正文。

**Text Decoration:**
- Hero H1: 不做渐变，不加重投影，只保留极淡纸面阴影。
- Section H2: 可加小心形、花枝、星号作为旁注，但不要在文字本身做描边。
- 关键数字: 可用短下划线、虚线轨迹或小图标陪衬，不使用发光霓虹。

## 4. Component Stylings

### Buttons

```css
.scrapbook-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 24px;
  border: 1px solid rgba(var(--accent-rgb), 0.28);
  border-radius: 14px;
  color: #fffaf2;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent 52%),
    var(--accent);
  box-shadow: 0 12px 22px rgba(var(--accent-rgb), 0.2);
  font-weight: 900;
  text-decoration: none;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
}

.scrapbook-button:hover {
  transform: translateY(-2px);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent 52%),
    var(--accent-hover);
  box-shadow: 0 16px 28px rgba(var(--accent-rgb), 0.25);
}

.scrapbook-button:active {
  transform: translateY(0);
  box-shadow: 0 8px 16px rgba(var(--accent-rgb), 0.18);
}

.scrapbook-button:focus-visible {
  outline: 3px solid rgba(var(--orange-rgb), 0.34);
  outline-offset: 3px;
}

.scrapbook-button:disabled,
.scrapbook-button[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
  box-shadow: none;
}
```

### Cards

```css
.paper-card {
  position: relative;
  border: 1px solid rgba(var(--border-rgb), 0.9);
  border-radius: 10px;
  background:
    radial-gradient(circle at 18px 18px, rgba(var(--gold-rgb), 0.08) 0 1px, transparent 1.4px),
    repeating-linear-gradient(0deg, transparent 0 27px, var(--paper-line) 28px),
    linear-gradient(180deg, rgba(var(--surface-rgb), 0.98), rgba(255, 247, 236, 0.94));
  background-size: 22px 22px, auto, auto;
  box-shadow: var(--shadow-paper);
  color: var(--text);
}

.paper-card:hover {
  transform: translateY(-3px) rotate(-0.4deg);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-float);
}

.paper-card:focus-within {
  outline: 3px solid rgba(var(--orange-rgb), 0.26);
  outline-offset: 3px;
}

.paper-card::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 54px;
  height: 54px;
  background:
    linear-gradient(135deg, rgba(var(--gold-rgb), 0.16), rgba(255, 255, 255, 0.36) 48%, transparent 50%),
    linear-gradient(135deg, transparent 0 50%, rgba(171, 92, 39, 0.14) 51% 100%);
  pointer-events: none;
}
```

### Navigation

```css
.cozy-pill-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 1.4vw, 20px);
  width: max-content;
  max-width: calc(100% - 32px);
  margin: 0 auto;
  padding: 8px 18px;
  border: 1px solid rgba(126, 85, 52, 0.16);
  border-radius: 999px;
  background: rgba(var(--surface-rgb), 0.9);
  box-shadow: 0 13px 26px rgba(95, 55, 34, 0.13);
  backdrop-filter: blur(10px) saturate(1.06);
}

.cozy-pill-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 76px;
  min-height: 38px;
  padding: 7px 12px;
  border-radius: 999px;
  color: var(--text-secondary);
  font-weight: 900;
  text-decoration: none;
  transition: color 180ms ease, background 180ms ease, transform 180ms ease;
}

.cozy-pill-nav a:hover,
.cozy-pill-nav a:focus-visible {
  color: var(--deep-coral);
  background: rgba(var(--accent-rgb), 0.08);
  transform: translateY(-1px);
  outline: none;
}

.cozy-pill-nav a[aria-current="page"] {
  color: #fff9f2;
  background: linear-gradient(180deg, #eb7165, #d85248);
  box-shadow: 0 9px 18px rgba(174, 61, 51, 0.22);
}
```

### Links

```css
.paper-link {
  color: var(--deep-coral);
  font-weight: 900;
  text-decoration: none;
  background-image: linear-gradient(90deg, currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0 2px;
  transition: background-size 180ms ease, color 180ms ease;
}

.paper-link:hover,
.paper-link:focus-visible {
  color: var(--accent-hover);
  background-size: 100% 2px;
  outline: none;
}
```

### Tags / Badges

```css
.paper-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 4px 10px;
  border: 1px solid rgba(var(--border-rgb), 0.92);
  border-radius: 999px;
  color: var(--ink-green);
  background: rgba(var(--surface-rgb), 0.78);
  box-shadow: 0 3px 8px rgba(111, 58, 35, 0.08);
  font-size: 0.82rem;
  font-weight: 800;
}
```

### Dashboard Modules

```css
.daily-dashboard {
  width: min(1180px, calc(100% - 32px));
  margin: clamp(28px, 4vw, 48px) auto;
  display: grid;
  gap: clamp(18px, 2.6vw, 30px);
}

.daily-top-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.94fr) minmax(420px, 1.36fr);
  gap: clamp(18px, 2.4vw, 28px);
  align-items: start;
}

.torn-note {
  padding: clamp(24px, 4vw, 42px);
  transform: rotate(-2deg);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.64), transparent 34%),
    repeating-linear-gradient(0deg, transparent 0 30px, rgba(126, 85, 52, 0.12) 31px),
    var(--paper-note);
  filter: drop-shadow(0 14px 20px rgba(111, 58, 35, 0.12));
}

.status-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.progress-ledger {
  padding: clamp(22px, 3vw, 34px);
  overflow: hidden;
}

.recent-grid {
  display: grid;
  grid-template-columns: 1fr 0.92fr 1.05fr;
  gap: clamp(16px, 2.4vw, 28px);
}

.next-plan-strip {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: clamp(14px, 3vw, 38px);
  padding: 20px clamp(20px, 4vw, 42px);
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.26), transparent 36%),
    var(--paper-sage);
  box-shadow: var(--shadow-paper);
}
```

## 5. Layout Principles

**Container:**
- Max width: `1180px` for dashboard sections.
- Hero width: `100vw` visual band, content constrained to `min(1180px, calc(100% - 32px))`.
- Narrow text blocks: `680px` max.
- Page padding: `16px` mobile, `32px` tablet, `clamp(32px, 5vw, 72px)` desktop section rhythm.

**Spacing Scale:**
- Section padding: `clamp(28px, 5vw, 64px)`.
- Component gap: `clamp(16px, 2.4vw, 30px)`.
- Card internal padding: `clamp(18px, 3vw, 34px)`.
- Small chip gap: `6px-10px`.

**Page Structure:**

```css
.home-page {
  background:
    radial-gradient(circle at 12px 12px, rgba(var(--gold-rgb), 0.12) 0 1px, transparent 1.5px),
    linear-gradient(180deg, #fff3e5 0%, #fffdf9 48%, #f8e5d1 100%);
  background-size: 22px 22px, auto;
}

.home-main-flow {
  display: grid;
  gap: clamp(28px, 5vw, 56px);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(14px, 2vw, 24px);
}

.dashboard-span-4 { grid-column: span 4; }
.dashboard-span-6 { grid-column: span 6; }
.dashboard-span-8 { grid-column: span 8; }
.dashboard-span-12 { grid-column: 1 / -1; }
```

**Information Hierarchy:**
- 首屏负责情绪和品牌，不承载太多小数据。
- 第二屏“今日手账仪表盘”承载截图中的高密度生活信息。
- `恋爱进度仪表` 必须是一整行宽卡，作为数据核心。
- `最近发生的小事` 使用三列卡片，分别承接点滴、留言、相册。
- `下一件想一起完成的事` 使用横向浅绿色纸条，作为行动入口。

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | 无阴影，只有纸张底纹 | 页面背景、分隔背景 |
| Subtle | `0 7px 16px rgba(111, 58, 35, 0.1)` | 小标签、天气 chip、日期 chip |
| Paper | `0 16px 34px rgba(111, 58, 35, 0.12)` | 常规手账卡片 |
| Floating | `0 22px 46px rgba(111, 58, 35, 0.16)` | Hero 内贴纸、重点状态卡 hover |
| Pressed | 内部浅线条 + 无上浮 | 时间线、进度虚线、状态 ledger |

**Depth Rules:**
- 阴影只模拟纸张叠放，不模拟玻璃拟态。
- 同一屏最多 2 个明显浮起元素，避免所有卡片都在抢焦点。
- 胶带、回形针、贴纸可作为局部装饰，但不能遮挡正文。

## 7. Animation & Interaction

**Motion Philosophy**: 像纸片被轻轻放到桌面上，只动画 `transform` 和 `opacity`，不做快速弹跳。  
**Tier**: L2。

### Dependencies

```html
<!-- No extra runtime dependency. Use Vue state + CSS only. -->
```

### Base Setup

```js
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
```

### Entrance Animation

```css
.paper-reveal {
  opacity: 0;
  transform: translate3d(0, 18px, 0) rotate(-0.6deg);
  transition: opacity 520ms ease, transform 520ms ease;
}

.paper-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0) rotate(0);
}

@keyframes tape-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--tape-rotate, -4deg)); }
  50% { transform: translate3d(0, -4px, 0) rotate(calc(var(--tape-rotate, -4deg) + 1deg)); }
}
```

### Scroll Behavior

```css
.daily-dashboard {
  scroll-margin-top: 82px;
}

.progress-thread {
  transform-origin: left center;
  transition: transform 700ms ease, opacity 700ms ease;
}
```

使用 IntersectionObserver 给 `progress-thread` 添加 `is-visible`，实现虚线轨迹从左到右轻微展开。不要使用 scroll-jacking。

### Hover & Focus States

```css
.status-person-card,
.recent-paper-card,
.album-strip-card {
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.status-person-card:hover,
.recent-paper-card:hover,
.album-strip-card:hover {
  transform: translateY(-3px) rotate(-0.4deg);
  box-shadow: var(--shadow-float);
}

.status-person-card:focus-within,
.recent-paper-card:focus-within,
.album-strip-card:focus-within {
  outline: 3px solid rgba(var(--orange-rgb), 0.26);
  outline-offset: 3px;
}
```

### Special Effects

- 首页巧思：`今日小纸条` 的胶带轻微浮动，hover 时纸条角度归正，像被人扶正。
- 天气联动：天气层保持全站最顶，但 dashboard 卡片内容层级要清晰，不能被强天气完全盖住。
- 鼠标轨迹爱心效果保留，但 dashboard 密集区域中粒子 opacity 降低，避免干扰阅读。

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .paper-reveal {
    opacity: 1;
    transform: none;
  }

  .status-person-card:hover,
  .recent-paper-card:hover,
  .album-strip-card:hover,
  .torn-note:hover {
    transform: none;
  }
}
```

## 8. Do's and Don'ts

### Do

- 使用截图的信息架构：今日小纸条、两人状态、距离条、恋爱进度、最近小事、下一件计划。
- 保留项目现有水彩 hero、奶油背景、点阵纸纹、衬线中文标题和暖色体系。
- 使用纸张、胶带、回形针、虚线、手绘小花作为结构装饰，而不是纯装饰。
- 让每个模块都有明确数据来源或未来可接 API 的字段。
- 卡片可以轻微旋转，但同一屏旋转角度要克制，通常在 `-2deg` 到 `2deg`。
- 大数字要成为视觉锚点，例如 `1441 天`、`21 天后`、`36 条`、`128 张`。
- 移动端先保留信息顺序，再考虑视觉装饰；读得清比装饰完整更重要。

### Don't

- 禁止把截图直接复刻成另一套风格，必须继承 LikeGirl 当前视觉语言。
- 禁止新增企业后台式 sidebar、表格、冷灰统计卡。
- 禁止大面积使用纯白卡片和黑色无衬线数字。
- 禁止给每张卡都加很重的阴影、玻璃模糊或彩色渐变。
- 禁止引入新的 JS 动画库、canvas 或 WebGL 来实现本页布局。
- 禁止让天气效果挡住按钮点击；天气层必须 `pointer-events: none`。
- 禁止卡片内文案溢出或强行压缩字体，内容过长就截断或进入详情页。
- 禁止移动端保留三列密集布局；必须降为单列或横向小滚动。
- 禁止新增与情侣纪念册无关的营销话术、商业 CTA 或通用 SaaS 文案。
- 禁止为完成设计而新建无来源的真实照片；优先复用项目 assets。

## 9. Responsive Behavior

**Breakpoints:**

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | `> 1120px` | Hero 全宽，dashboard 最大 `1180px`；顶部状态区左右两列；最近小事三列 |
| Tablet | `768px-1120px` | Dashboard 保持两列，但最近小事降为两列；导航可横向滚动 |
| Mobile | `< 768px` | 所有 dashboard 模块单列；状态卡单列；进度仪表数字两列；下一件计划竖排 |
| Small Mobile | `< 420px` | Hero 降低装饰密度；导航仅显示图标和短文字；隐藏非关键贴纸 |

**Touch Targets:** minimum `44px`。  
**Collapsing Strategy:** 内容优先级为：标题和天数 > 今日状态 > 下一计划 > 最近小事 > 装饰物。移动端先隐藏胶带/花枝等装饰，不隐藏核心数据。

```css
@media (max-width: 1120px) {
  .daily-top-grid,
  .recent-grid {
    grid-template-columns: 1fr 1fr;
  }

  .progress-ledger,
  .next-plan-strip {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .daily-dashboard,
  .daily-top-grid,
  .status-card-grid,
  .recent-grid,
  .next-plan-strip {
    grid-template-columns: 1fr;
  }

  .cozy-pill-nav {
    justify-content: flex-start;
    width: calc(100% - 28px);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .cozy-pill-nav::-webkit-scrollbar {
    display: none;
  }

  .torn-note {
    transform: none;
  }

  .next-plan-strip {
    align-items: stretch;
  }
}

@media (max-width: 420px) {
  .paper-card {
    border-radius: 8px;
  }

  .paper-card::after,
  .decorative-tape,
  .decorative-flower {
    display: none;
  }

  .scrapbook-button {
    width: 100%;
  }
}
```

## Implementation Notes For This Project

- 目标页面优先改 `frontend/src/views/HomeView.vue` 和 `frontend/src/styles.css`。
- 不改后端接口；缺少的数据先从 `useSiteData()`、当前用户、静态 mock 派生。
- 当前 `HomeView.vue` 已有 `home-cozy-stage`、`home-cozy-nav`、`home-memory-card`，后续实现应在这些结构下方新增 `daily-dashboard`，不要推翻首屏。
- 新增模块建议：
  - `DailyNoteCard`：今日小纸条。
  - `CoupleStatusPanel`：两人状态卡 + 距离纸条。
  - `LoveProgressLedger`：恋爱进度仪表。
  - `RecentMomentsGrid`：最新点滴、最新留言、最新相册。
  - `NextPlanStrip`：下一件想一起完成的事。
- 图标优先使用现有内联 SVG 风格，线条统一 `stroke-width: 2`，颜色继承 `currentColor`。
- 实现阶段请先小步落地首屏下方 dashboard，不要同时重构登录页、用户页或其他路由。
