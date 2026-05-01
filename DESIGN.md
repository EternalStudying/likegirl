# DESIGN.md

> 把相册页做成一张铺开的恋爱手账桌面：旧纸、相片、胶带、干花、邮戳和天气便签共同承载照片记忆。

## 0. Current Design Artifacts

| Page | Artifact | Notes |
|------|----------|-------|
| 首页 | `E:\project\likegirl\codex-work\首页设计图\likegirl-home-design-content.png`、`E:\project\likegirl\codex-work\首页设计图\likegirl-home-design-layout.png` | 现有登录后公共外壳的视觉基准。 |
| 相册 | `E:\project\likegirl\codex-work\相册设计图\相册页面设计图-v2.png` | 以顶部导航、纸张手账、相片卡片为主。 |
| 相册素材 | `E:\project\likegirl\codex-work\相册设计图\素材\可用` | 已抠图的纸张、胶带、花枝、导航图标等 PNG 素材。 |
| 清单 | `E:\project\likegirl\codex-work\清单设计图\清单页面设计图.png` | 以用户当前结构截图为基础：顶部 `LG Demo`、大幅 hero、双头像、中心爱心、轮播点、hero 下方居中纸质导航，且 `清单` 高亮。 |

清单页设计不要按当前三条 seed 数据收窄成固定布局；页面内容可以重新设计，但必须保留现有上方导航结构，不做底部导航。

## 1. Visual Theme & Atmosphere

**Style**: Vintage Scrapbook Photo Album  
**Keywords**: 复古纸张、手撕相纸、胶带固定、干花贴纸、邮戳印章、暖色照片、手账网格、轻量纸感动效  
**Tone**: 温柔、怀旧、亲密、自然、有手作痕迹，NOT 现代极简图库、冷白后台、玻璃拟态、强科技感。  
**Feel**: 像把两个人的照片铺在一张旧书桌上，灯串微亮，纸页有纹理，每张照片都被小心贴好。

**Interaction Tier**: L2 流畅交互  
**Dependencies**: Vue 3 + CSS only。不要新增 GSAP、Lenis、canvas 或 WebGL。

**Page Direction**:
- 页面目标是“照片相册”，不是通用图片网格；每张卡片都要像真实相纸贴在纸面上。
- 顶部保持纸质横幅导航，当前页“相册”使用红色胶囊高亮。
- 左侧保留“返回首页”吊牌，右上保留天气便签，右侧可放干花与邮戳装饰。
- 首屏包含标题区和 2 行相册卡片，桌面端每行 4 张，整体宽松但不空。
- 所有装饰服务于相册氛围，不压住照片和文字。

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #f8efe2;
  --bg-rgb: 248, 239, 226;
  --bg-paper: #fff8ec;
  --surface: #fffaf0;
  --surface-rgb: 255, 250, 240;
  --surface-alt: #f3e3cc;
  --surface-hover: #fff4e4;
  --photo-paper: #fffdf6;
  --tape: #d9c29f;
  --tape-red: #d97968;
  --tape-green: #8f9b73;

  /* Borders */
  --border: #e5cfb5;
  --border-rgb: 229, 207, 181;
  --border-hover: #d7ad86;
  --paper-line: rgba(111, 78, 48, 0.14);

  /* Text */
  --text: #35231c;
  --text-rgb: 53, 35, 28;
  --text-secondary: #6a5548;
  --text-tertiary: #8f7a6c;
  --text-muted: #aa9484;

  /* Accent */
  --accent: #d95b49;
  --accent-rgb: 217, 91, 73;
  --accent-hover: #bf4738;
  --accent-soft: #f7cabb;
  --title-red: #9f352d;
  --ink-green: #28533f;
  --stamp: #d7836e;
  --date-bg: #efe0c9;
  --date-text: #7a604e;

  /* Semantic */
  --success: #4d7758;
  --error: #b94336;
  --warning: #c58a2b;

  /* Effects */
  --shadow-paper: 0 14px 28px rgba(87, 55, 31, 0.13);
  --shadow-photo: 0 16px 30px rgba(76, 47, 25, 0.18);
  --shadow-soft: 0 8px 18px rgba(76, 47, 25, 0.1);
  --ring: 0 0 0 3px rgba(var(--accent-rgb), 0.18);
}
```

**Color Rules:**
- 所有新增颜色必须先定义为 CSS 变量，再在组件中引用。
- 页面大面积只使用纸白、奶油、浅棕；红色只用于当前导航、标题重点、邮戳和小装饰。
- 绿色只用于英文小标题、植物贴纸或小面积状态，不做大面积背景。
- 照片本身是页面色彩重点，卡片底色必须克制，不能抢照片。
- 日期标签使用浅棕底，不使用纯灰或纯白。

## 3. Typography Rules

**Font Stack:**

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600;700;900&family=Noto+Sans+SC:wght@400;500;600;700&display=swap');

:root {
  --font-serif: "Noto Serif SC", "Songti SC", "SimSun", serif;
  --font-sans: "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;
}
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | var(--font-serif) | clamp(56px, 6vw, 98px) | 900 | 1.02 | 0 |
| English Label | var(--font-serif) | 18px | 700 | 1.2 | 0 |
| Section H2 | var(--font-serif) | clamp(34px, 4vw, 56px) | 800 | 1.12 | 0 |
| Card Title | var(--font-serif) | 24px | 700 | 1.25 | 0 |
| Body | var(--font-sans) | 16px | 500 | 1.7 | 0 |
| Meta / Date | var(--font-sans) | 14px | 600 | 1.2 | 0 |
| Navigation | var(--font-sans) | 15px | 600 | 1.2 | 0 |

**Typography Rules:**
- 中文大标题使用宋体/衬线气质，形成“旧相册标题”感。
- 正文、日期、导航使用无衬线，保证小字号清晰。
- 标题可以使用深红色，但不使用渐变、描边或强投影。
- 正文最大行宽控制在 36em 内，避免横向拉太长。
- **NEVER use**: Impact, Comic Sans MS, Arial Black, 等宽字体做标题。

**Text Decoration:**
- Hero h1: 无渐变、无投影，使用 `--title-red` 纯色。
- 英文 `PHOTO ALBUM`: 使用 `--ink-green`，不做大字距。
- 副标题: 可使用红色手绘下划线装饰，但不要用真实文本下划线。

## 4. Component Stylings

### Asset Usage Map

裁切后的可用素材目录：

`E:\project\likegirl\codex-work\相册设计图\素材\可用`

实现时建议把实际会用到的 PNG 复制到前端资源目录，例如：

`E:\project\likegirl\frontend\src\assets\album-scrapbook`

保持文件名不变，便于按下表映射。

| Area | Asset | Usage | Suggested Size | Layer |
|------|-------|-------|----------------|-------|
| 顶部灯串 | `top-garland.png` | 页面最顶部横向灯串花枝，对齐设计图顶部 | width: 100vw; height: 110-150px | 背景装饰 |
| 顶部纸边 | `top-torn-paper.png` | 灯串下方撕纸边，压住顶部背景 | width: 100vw; height: 70-96px | 背景装饰 |
| 顶部导航 | `nav-pill.png` | 纸质胶囊导航底图；文字和图标叠在上面 | width: 720-860px | 导航底层 |
| 导航图标 | `icon-nav-message.png`, `icon-nav-moment.png`, `icon-nav-diary.png`, `icon-nav-home.png`, `icon-nav-album.png`, `icon-nav-list.png`, `icon-nav-about.png` | 对应留言、点滴、日记、首页、相册、清单、关于 | 16-20px | 导航内容 |
| 返回首页 | `back-home-tag.png` | 左侧悬挂吊牌，文字“返回首页”叠加 | width: 92-120px | 左侧装饰/入口 |
| 天气便签 | `weather-note-card.png` | 右上天气剧场纸条底图，城市和温度叠加 | width: 112-140px | 右上信息 |
| 右上干花 | `dry-flower-taped.png` | 天气便签左侧或下方干花胶带装饰 | width: 130-170px | 右上装饰 |
| 邮戳 | `love-postmark-large.png` 或 `stamp-love-postmark.png` | 标题右侧淡红邮戳，低透明度 | width: 104-150px | 中层装饰 |
| 标题下划线 | `hero-red-underline.png` 或 `scribble-red.png` | 副标题下方手绘红线 | width: 190-260px | 标题装饰 |
| 相册胶带 | `tape-beige-long.png`, `tape-red-long.png`, `tape-green-long.png`, `tape-grid-white.png` | 随机贴在相册卡片顶部边缘 | width: 72-110px | 卡片装饰 |
| 波点胶带 | `tape-red-dotted.png`, `tape-green-dotted.png` | 少量用于重点卡片，不要每张都用 | width: 78-116px | 卡片装饰 |
| 折角纸 | `tape-corner-fold-top.png`, `tape-corner-fold-side.png`, `note-corner-fold.png` | 卡片角落或页面右下纸张折角 | width: 54-90px | 边角装饰 |
| 小花叶 | `flower-sticker-small.png`, `small-daisy.png`, `leaf-sticker.png`, `leaf-branch.png`, `baby-breath-branch.png` | 相册卡片角落装饰，避开标题和日期 | width: 36-90px | 卡片装饰 |
| 花束 | `flower-bouquet-large.png`, `flower-cluster-medium.png`, `flower-cluster-small.png`, `left-bottom-bouquet.png` | 页面边角或空白区域氛围装饰 | width: 120-260px | 背景/边角 |
| 心形贴纸 | `heart-red-sticker.png`, `heart-sketch-red.png`, `heart-double-paper.png`, `wax-seal-heart.png` | 局部点缀，控制在每屏 3 个以内 | width: 26-54px | 小装饰 |
| 日期底图 | `date-pill-location.png`, `date-pill-calendar.png`, `ticket-date-red.png`, `ticket-date-green.png`, `ticket-label-red.png`, `ticket-label-green.png` | 日期标签或票根样式底图；文字叠加在中间 | height: 26-34px | 卡片信息 |
| 图库小贴纸 | `camera-sticker.png`, `photo-stack-sticker.png` | 相册标题区或空状态点缀 | width: 42-70px | 信息装饰 |
| 灯具 | `string-lights-left.png`, `string-lights-center.png`, `lantern-single.png` | 只用于顶部或大屏边缘，移动端隐藏 | width: 120-280px | 氛围装饰 |
| 纸条 | `note-with-dryflower.png`, `wide-note-red-tape.png`, `airmail-note-stamp.png` | 备用便签/空状态/说明区，不进入主照片网格 | width: 160-260px | 信息容器 |

**Asset Rules:**
- 设计图里的关键复现优先级：顶部灯串纸边 > 纸质导航 > 返回吊牌 > 天气便签和干花 > 胶带相册卡片 > 邮戳/花枝点缀。
- PNG 装饰应使用 `pointer-events: none`，只有返回首页、导航、相册卡片本身可点击。
- 装饰图宽高用 CSS 控制，不能拉伸变形；使用 `object-fit: contain`。
- 同一张相册卡片最多 2 个装饰 PNG：1 条胶带 + 1 个小花/邮戳/心形。
- 移动端隐藏顶部灯串以外的大型边角装饰，避免压缩内容。

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font: 600 15px/1.2 var(--font-sans);
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.btn:hover {
  transform: translateY(-1px);
  background: var(--surface-hover);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-paper);
}

.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-soft);
}

.btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-soft), var(--ring);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.btn--primary {
  border-color: rgba(var(--accent-rgb), 0.45);
  background: linear-gradient(180deg, #e97862, var(--accent));
  color: #fffaf3;
}

.btn--primary:hover {
  background: linear-gradient(180deg, #ed826d, var(--accent-hover));
}
```

### Album Cards

```css
.album-card {
  position: relative;
  padding: 12px 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--photo-paper);
  box-shadow: var(--shadow-paper);
  transform: rotate(var(--rotate, 0deg));
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.album-card::before {
  content: "";
  position: absolute;
  top: -12px;
  left: var(--tape-left, 36px);
  width: 86px;
  height: 28px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--tape) 86%, white);
  box-shadow: 0 3px 8px rgba(70, 45, 24, 0.12);
  transform: rotate(var(--tape-rotate, -4deg));
  opacity: 0.88;
  pointer-events: none;
}

.album-card:hover {
  transform: rotate(var(--rotate, 0deg)) translateY(-5px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-photo);
}

.album-card:focus-within {
  outline: none;
  box-shadow: var(--shadow-paper), var(--ring);
}

.album-card__image {
  display: block;
  width: 100%;
  aspect-ratio: 1.54 / 1;
  object-fit: cover;
  border-radius: 6px;
}

.album-card__footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
}

.album-card__title {
  margin: 0;
  color: var(--text);
  font: 700 24px/1.25 var(--font-serif);
}

.album-card__date {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 28px;
  padding: 0 14px;
  border: 1px solid rgba(var(--border-rgb), 0.75);
  border-radius: 5px;
  background: var(--date-bg);
  color: var(--date-text);
  font: 600 14px/1 var(--font-sans);
}
```

### Navigation

```css
.album-nav {
  position: sticky;
  top: 24px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(860px, calc(100% - 32px));
  min-height: 58px;
  margin: 24px auto 0;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(var(--surface-rgb), 0.88);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(10px);
}

.album-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  color: var(--text-secondary);
  text-decoration: none;
  font: 600 15px/1.2 var(--font-sans);
  transition: color 180ms ease, background 180ms ease, transform 180ms ease;
}

.album-nav__link:hover {
  color: var(--text);
  background: rgba(var(--border-rgb), 0.28);
  transform: translateY(-1px);
}

.album-nav__link:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

.album-nav__link[aria-current="page"] {
  background: linear-gradient(180deg, #e97862, var(--accent));
  color: #fffaf3;
  box-shadow: 0 8px 16px rgba(var(--accent-rgb), 0.28);
}
```

### Links

```css
.paper-link {
  color: var(--title-red);
  text-decoration: none;
  background-image: linear-gradient(var(--accent-soft), var(--accent-soft));
  background-size: 100% 8px;
  background-position: 0 88%;
  background-repeat: no-repeat;
  transition: color 180ms ease, background-size 180ms ease;
}

.paper-link:hover {
  color: var(--accent-hover);
  background-size: 100% 12px;
}

.paper-link:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}
```

### Tags / Badges

```css
.paper-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text-secondary);
  font: 600 14px/1 var(--font-sans);
  box-shadow: var(--shadow-soft);
}

.weather-note {
  width: 126px;
  padding: 18px 16px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text-secondary);
  box-shadow: var(--shadow-paper);
  transform: rotate(3deg);
}

.weather-note strong {
  display: block;
  color: var(--accent);
  font: 800 22px/1.2 var(--font-serif);
}

.weather-note b {
  display: block;
  color: var(--ink-green);
  font: 800 30px/1.1 var(--font-serif);
}
```

### Decorative Elements

```css
.asset-img {
  display: block;
  width: var(--asset-w, auto);
  height: auto;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.album-top-garland {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 0;
  width: 100vw;
  max-width: none;
  transform: translateX(-50%);
}

.album-top-paper {
  position: absolute;
  top: 58px;
  left: 50%;
  z-index: 1;
  width: 100vw;
  max-width: none;
  transform: translateX(-50%);
}

.album-back-tag {
  position: absolute;
  top: 86px;
  left: 24px;
  z-index: 3;
  width: 106px;
}

.album-weather-asset {
  position: absolute;
  top: 88px;
  right: 58px;
  z-index: 3;
  width: 126px;
}

.album-dry-flower {
  position: absolute;
  top: 116px;
  right: 200px;
  z-index: 2;
  width: 158px;
}

.album-postmark {
  position: absolute;
  top: 214px;
  right: 330px;
  z-index: 1;
  width: 132px;
  opacity: 0.55;
  transform: rotate(10deg);
}

.album-card__tape {
  position: absolute;
  top: -15px;
  left: var(--tape-left, 42px);
  z-index: 2;
  width: var(--tape-width, 92px);
  transform: rotate(var(--tape-rotate, -4deg));
}

.album-card__sticker {
  position: absolute;
  right: var(--sticker-right, -8px);
  bottom: var(--sticker-bottom, 18px);
  z-index: 2;
  width: var(--sticker-width, 54px);
}

.paper-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 22% 18%, rgba(217, 91, 73, 0.05), transparent 24%),
    radial-gradient(circle at 72% 8%, rgba(40, 83, 63, 0.05), transparent 20%),
    var(--bg);
  color: var(--text);
}

.paper-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(111, 78, 48, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(111, 78, 48, 0.035) 1px, transparent 1px);
  background-size: 32px 32px;
}

.stamp {
  display: grid;
  place-items: center;
  width: 122px;
  height: 122px;
  border: 3px double color-mix(in srgb, var(--stamp) 78%, transparent);
  border-radius: 999px;
  color: var(--stamp);
  font: 700 13px/1.1 var(--font-serif);
  text-align: center;
  opacity: 0.62;
  transform: rotate(15deg);
}

@media (max-width: 767px) {
  .album-back-tag,
  .album-weather-asset,
  .album-dry-flower,
  .album-postmark {
    display: none;
  }

  .album-top-garland {
    opacity: 0.55;
  }
}
```

## 5. Layout Principles

**Container:**
- Max width: `1380px`
- Page padding desktop: `0 48px 64px`
- Page padding mobile: `0 18px 40px`
- Title block width: `min(620px, 100%)`

**Spacing Scale:**
- Top navigation margin: `24px`
- Hero/title area padding: `76px 0 64px`
- Album grid gap: `34px 36px`
- Card internal padding: `12px`
- Decoration safe distance from content: at least `24px`

**Grid:**

```css
.album-page__inner {
  position: relative;
  width: min(1380px, calc(100% - 96px));
  margin: 0 auto;
}

.album-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  align-items: start;
  gap: 48px;
  padding: 76px 0 64px;
}

.album-hero__title {
  max-width: 620px;
  padding-left: 72px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 34px 36px;
  padding-bottom: 64px;
}
```

**Composition Rules:**
- 标题区左对齐，英文小标题在中文大标题上方。
- 第一行相册卡片从标题下方开始，不能挤到导航下面。
- 卡片可以有轻微旋转，但单张旋转不超过 `1.2deg`。
- 装饰物使用绝对定位时必须让出主内容区域，不能遮挡文字、日期和人物主体。

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | 无阴影，仅纸纹背景 | 页面底层纸面 |
| Subtle | `var(--shadow-soft)` | 导航、标签、小便签 |
| Paper | `var(--shadow-paper)` | 相册卡片、天气纸条、返回吊牌 |
| Photo Hover | `var(--shadow-photo)` | 相册卡片 hover |
| Stamp | 低透明度、无投影 | 邮戳、印章装饰 |

**Elevation Rules:**
- 阴影方向保持向下，模拟纸片放在桌面上。
- 禁止大面积模糊光晕和玻璃拟态阴影。
- 相册卡片 hover 只能上浮一点，不能像商品卡一样强烈弹出。

## 7. Animation & Interaction

**Motion Philosophy**: 轻、慢、纸感，像纸片被手指轻轻托起。  
**Tier**: L2

### Dependencies

```html
<!-- CSS only，无额外运行时依赖 -->
```

### Base Setup

```js
// Vue 页面只需要在列表渲染时按 index 设置轻微延迟。
const albumMotionStyle = (index) => ({
  "--delay": `${Math.min(index * 55, 360)}ms`,
  "--rotate": `${[-0.6, 0.5, -0.4, 0.6][index % 4]}deg`,
});
```

### Entrance Animation

```css
.album-hero__title,
.album-card,
.weather-note,
.stamp {
  animation: paper-rise 520ms ease both;
  animation-delay: var(--delay, 0ms);
}

@keyframes paper-rise {
  from {
    opacity: 0;
    transform: translateY(14px) rotate(var(--rotate, 0deg));
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(var(--rotate, 0deg));
  }
}
```

### Scroll Behavior

```js
// 可选：不引入依赖，用 IntersectionObserver 给相册卡片加 reveal。
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(18px) rotate(var(--rotate, 0deg));
  transition: opacity 520ms ease, transform 520ms ease;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0) rotate(var(--rotate, 0deg));
}
```

### Hover & Focus States

```css
.album-card:hover .album-card__image {
  filter: saturate(1.04) contrast(1.02);
}

.album-card:hover .album-card__title {
  color: var(--title-red);
}

.album-card a:focus-visible,
.album-card button:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}
```

### Special Effects

```css
.hand-drawn-underline {
  position: relative;
  display: inline-block;
}

.hand-drawn-underline::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 74%;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.78;
  transform: rotate(-2deg);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }

  .album-card,
  .album-card:hover {
    transform: rotate(var(--rotate, 0deg));
  }
}
```

## 8. Do's and Don'ts

### Do

- 保持截图里的“纸张桌面 + 相纸网格 + 真实照片”作为核心识别。
- 使用真实照片作为卡片主视觉，照片比例统一为横向相纸。
- 当前导航“相册”必须清楚高亮，且与其它导航项在同一个纸质胶囊内。
- 相册卡片标题和日期要稳定对齐，日期标签统一放在卡片底部右侧。
- 装饰物可以少量压住卡片边缘，但不能压住照片主体、标题、日期。
- 桌面端优先保证 4 列相册，移动端优先保证可读性和触摸面积。

### Don't

- ❌ 不要把相册做成普通电商卡片或后台数据卡片。
- ❌ 不要使用纯白背景、冷灰边框、蓝紫渐变或黑色科技风。
- ❌ 不要让所有卡片旋转角度过大，最多只做轻微手工感。
- ❌ 不要使用圆角超过 8px 的大卡片，纸张应偏方正。
- ❌ 不要把胶带、贴纸、干花做得比照片更抢眼。
- ❌ 不要使用玻璃拟态、霓虹光效、毛玻璃大面板。
- ❌ 不要在卡片里堆叠多行说明文字；相册页只保留标题和日期。
- ❌ 不要让顶部导航遮挡标题或天气便签。
- ❌ 不要在移动端保留四列硬挤，必须改为单列或双列。
- ❌ 不要用图标替代必要文字；相册标题、日期必须可直接阅读。

## 9. Responsive Behavior

**Breakpoints:**

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | `> 1180px` | 4 列相册，标题左侧偏移，天气纸条在右上 |
| Tablet | `768px - 1180px` | 2 列相册，标题取消大偏移，装饰减少 |
| Mobile | `< 768px` | 单列相册，导航横向滚动，返回吊牌和天气纸条进入普通流 |

**Touch Targets:** minimum `44px`  
**Collapsing Strategy:** 导航保持横向胶囊滚动；相册卡片单列铺开；干花、邮戳、角落灯串等纯装饰在移动端隐藏或弱化。

```css
@media (max-width: 1180px) {
  .album-page__inner {
    width: min(920px, calc(100% - 48px));
  }

  .album-hero {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .album-hero__title {
    padding-left: 0;
  }

  .album-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
  }
}

@media (max-width: 767px) {
  .album-page__inner {
    width: calc(100% - 36px);
  }

  .album-nav {
    top: 10px;
    justify-content: flex-start;
    width: calc(100% - 24px);
    overflow-x: auto;
    min-height: 54px;
    padding: 6px;
  }

  .album-nav__link {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0 14px;
  }

  .album-hero {
    padding: 52px 0 36px;
  }

  .album-hero__title h1 {
    font-size: clamp(48px, 18vw, 72px);
  }

  .album-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-bottom: 42px;
  }

  .album-card {
    transform: none;
  }

  .album-card:hover {
    transform: translateY(-3px);
  }

  .album-card__footer {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .weather-note,
  .stamp,
  .desktop-decoration {
    display: none;
  }
}
```
