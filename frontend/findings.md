# 发现与决策

## 需求
- 用户要求使用 `planning-with-files-zh` 创建三个规划文件。
- 用户要求写入当前项目上下文。
- 用户明确说明：我是一个新的前端 Agent，目前还没有被指派任何任务。
- 2026-04-30 新任务：参考截图，将首页导航栏上移，使导航栏中心与雪坡中心重合。
- 2026-04-30 新任务：去掉雪坡图片，使用 CSS 构建抛物线曲线雪坡；用户随后明确不要考虑移动端。
- 2026-04-30 新任务：点击导航栏其他页面时，页面内容应出现在导航栏下方，顶部首屏与导航不被整页替换。
- 2026-04-30 协作规则调整：`planning-with-files-zh` 不按每次修改强制记录，由我判断修改是否值得记录；值得则记录，否则不记录。
- 2026-04-30 新任务：拆分 4000 多行 `styles.css`，并明确后续其他页面 CSS 放置位置。
- 2026-05-01 新任务：删除右上角天气邮票，但保留天气 API。
- 2026-05-01 新任务：删除右上角用户入口，并删除相应用户编辑页面。
- 2026-05-01 新任务：总结当前上下文窗口工作，写入 `planning-with-files-zh`，用于上下文压缩恢复。
- 2026-05-01 新任务：鼠标滚轮滚动时，首页导航栏接触顶栏后自然融入顶栏；融入完成后顶栏区域成为导航栏。
- 2026-05-01 新任务：使用 `web-design` 按 `DESIGN.md` 和 `相册页面设计图-v2.png` 实现相册页，导航栏区域不要动。

## 项目事实
- 固定工作区：`E:\project\likegirl`。
- 前端目录：`E:\project\likegirl\frontend`。
- 后端目录：`E:\project\likegirl\backend`。
- 临时脚本、截图、调试文件目录：`E:\project\likegirl\codex-work`。
- 前端技术栈：Vue 3 + Vite。
- 后端技术栈：Spring Boot + MyBatis + MySQL。
- 认证：JWT。
- 天气：浏览器定位 + 高德地图 API。
- 高德 Key 已配置到环境变量 `AMAP_KEY`。
- 使用 PowerShell 时必须用：`D:\PowerShell-7.6.1\pwsh.exe`。

## 前端 Agent 边界
- 只负责前端相关工作。
- 不主动修改 `backend`。
- 不主动创建无关文档；本次创建文档是用户明确要求。
- 需要修改代码前，应先说明假设、方案、影响范围和验证方式。
- 当前没有具体实现任务。

## 可用验证方式
| 验证项 | 命令或方式 |
|------|-----------|
| 前端测试 | `npm test` |
| 前端构建 | `npm run build` |
| 前端页面验收 | `http://127.0.0.1:5173` |
| 后端测试 | `mvn test` |

## 天气动画背景
- 首页天气动画当前为 DOM/CSS 原生组件方向。
- 支持天气类型：`sunny`、`cloudy`、`rain`、`snow`、`fog`、`thunder`、`windy`、`night`。
- `cloudy` 已使用 DOM 云朵动画。
- 已知业务方向：`thunder` 应直接表现为雨天动画，不再显示雷电动画。
- 后端 `mapWeatherType(live.weather())` 只按中文天气关键词判断；英文 `"rain"` 不会命中雨天，会落到默认 `cloudy`。

## 技术决策
| 决策 | 理由 |
|------|------|
| 规划文件只记录上下文和待命状态 | 当前没有具体任务，避免过度设计 |
| 不启动服务、不运行测试 | 本次只初始化规划文件，没有代码变更 |
| 首页导航上移只改 `frontend/src/styles.css` | 导航结构已正确，位置由 CSS 变量控制 |
| 使用雪坡高度和导航半高计算导航 offset | 让导航中心与雪坡中心对齐，避免写死单一像素值 |
| 补偿 `.home-cozy-intro` 顶部间距 | 避免导航上移后带动下方内容一起上移 |
| 移除 `hero-torn-wave.png` 的前端引用 | 用户要求去掉雪坡图片 |
| 用 `.home-hero-carousel::after` 绘制 CSS 雪坡 | 保持结构简单，不新增 DOM |
| SVG mask 使用 `Q` 二次贝塞尔曲线 | 用 CSS mask 表达抛物线式雪坡轮廓 |
| 不调整移动端媒体查询 | 用户明确要求不要考虑移动端 |
| 公共上半区应从 `HomeView` 抽到登录后布局 | 当前 `App.vue` 直接渲染 `RouterView`，而封面和导航在 `HomeView` 内；切换到其他路由时自然会替换整页 |
| 使用 `HomeCozyShell` 包裹登录后的 `RouterView` | 保持首屏、雪坡和导航不随路由切换卸载；页面内容通过 slot 出现在导航栏下方 |
| 首页正文继续留在 `HomeView` | `/` 路由只负责导航下方的首页内容，避免把全部首页逻辑塞进公共外壳 |
| 规划记录采用价值判断 | 记录影响后续协作、跨多步、结构性、高风险或用户明确要求的事项；普通小改、一次性微调、简单查询不写入规划文件 |
| `src/styles.css` 保留为样式总入口 | 避免改动 `main.ts` 引入路径，降低拆分风险 |
| CSS 拆分目录采用公共层 + 页面层 | `00-tokens`、`01-base`、`02-app-shell`、`03-effects`、`04-paper-system`、`90-keyframes`、`99-responsive` 放公共样式，`pages/*.css` 放页面样式 |
| 后续新页面 CSS 放到 `src/styles/pages/<page>.css` | 让页面样式独立演进，避免重新堆回大文件 |
| 天气邮票只删除展示层 | `WeatherAtmosphere.vue` 仍保留 `fetchBrowserWeatherAtmosphere` 调用和天气动画逻辑 |
| 删除 `/user` 路由和编辑页，但保留 `src/api/user.ts` | 用户要求删除页面；接口层没有明确要求删除，保留给后续可能复用 |
| 导航融入顶栏使用同一个导航 DOM | 避免复制导航导致 active 状态、点击行为或后续维护出现两套逻辑 |
| 动效使用滚动进度 + smoothstep | 符合 `web-animation-design` 中屏幕内元素移动使用 ease-in-out 的原则，滚轮滚动时更自然 |
| 动效主要更新 transform 和 opacity | 减少滚动时布局与重绘压力，导航通过 fixed + translate/scale 融入顶栏 |
| `prefers-reduced-motion` 下直接吸附 | 避免对偏好减少动态效果的用户播放融合过程 |
| 首页导航 fixed 后仍会受父级 stacking context 影响 | `.home-cozy-stage` 原本 `z-index: 1` 会让 fixed 导航被顶栏盖住，导致顶栏标题淡出后看起来空白 |
| 导航锚点也不能创建 stacking context | `.home-cozy-nav-anchor { z-index: 8 }` 会把 fixed 导航锁在锚点层级里，仍然低于 `.app-topbar { z-index: 45 }` |
| 相册页改造不触碰公共导航 | 用户明确要求导航栏那一块不要动；相册页实现只落在 `AlbumView.vue`、`styles/pages/album.css` 和相册素材目录 |
| 相册页用占位真实照片补齐两行布局 | `DESIGN.md` 要求桌面端两行四列，当前后端种子数据只有 2 张照片；前端优先用 API 数据，缺口用真实照片补齐到 8 张 |

## 遇到的问题
| 问题 | 解决方案 |
|------|---------|
| 第一次检查文件时 PowerShell 把 `$_` 解析成空，导致 `.Name` 错误 | 后续使用 `$PSItem` 并处理外层转义 |
| 第二次检查文件时内层字符串引号被吞，导致数组参数解析失败 | 改用外层 PowerShell 调用 `pwsh.exe` 的标准方式 |
| `rg.exe` 从 WindowsApps 路径启动被拒绝访问 | 改用 PowerShell `Get-ChildItem` 和 `Select-String` |
| PowerShell 行号片段查看命令中 `$变量` 被外层展开 | 改用无行号的 `Get-Content | Select-Object -Skip -First` |
| 导航融合时出现“长条包长条” | docking 态额外给导航容器加了背景/边框，而纸质导航 PNG 尚未淡出；改为融合态不再额外画外层胶囊 |
| 顶栏融合后仍空白 | 浏览器验证显示导航进入 `is-docked` 且透明度为 1，但 `elementFromPoint` 命中顶栏内部；根因是导航锚点层级低于顶栏 |
| `npx` 默认 npm cache 无权限 | 默认写入 `E:\nodejs\node_cache` 会报 `EPERM mkdir`；使用项目约定 `$env:npm_config_cache='E:\project\likegirl\codex-work\npm-cache'` |
| Playwright CLI 默认找 Chrome | 本机没有 `C:\Users\Acer\AppData\Local\Google\Chrome\Application\chrome.exe`；按项目约定改用 `--browser msedge` |
| PowerShell 中 Playwright CLI 的 `eval/run-code` 容易被引号和括号破坏 | 简单表达式可用 `eval '(() => {...})()'`；复杂滚动/采样流程优先写临时 Node 脚本到 `E:\project\likegirl\codex-work` |
| 程序化 `window.scrollTo(0, 900)` 在本次调试中没有模拟真实滚轮效果 | 用 `page.mouse.wheel(0, 1200)` 更贴近用户滚轮行为，能触发导航 dock 状态 |
| 相册页初版滚动 reveal 导致整页截图里卡片不可见 | 由于未滚入视口的卡片保持透明，改为 CSS-only 入场动画，卡片默认可见 |

## 资源
- 技能文件：`C:\Users\Acer\.agents\skills\planning-with-files-zh\SKILL.md`
- 模板目录：`C:\Users\Acer\.agents\skills\planning-with-files-zh\templates`

## 视觉/浏览器发现
- `hero-torn-wave.png` 尺寸为 `1555x177`，透明裁切后可见雪坡区域约 `145px` 高。
- 本次未主动启动本地前端服务；项目规则默认由用户自行启动服务。
- 桌面主样式已不再依赖 `hero-torn-wave.png`；`npm run build` 产物列表中不再出现 `hero-torn-wave` 资源。
- 右上角天气邮票已从 `WeatherAtmosphere.vue` 删除；天气背景动画仍依赖天气接口结果。
- 右上角用户入口已从 `AppTopBar.vue` 删除；`/user` 路由与用户编辑页组件已删除。
- 相关验证：2026-05-01 记录的 `npm run build` 通过；`npx vitest run tests/architecture.test.ts tests/login.test.ts tests/user-api.test.ts` 通过，14 tests passed。
- 首页导航融入顶栏动效已实现；本地 `http://127.0.0.1:5173` 未运行，因此本次未做 Playwright 视觉验收。
- 相册页已按 `DESIGN.md` 初步落地；Playwright 截图保存到 `E:\project\likegirl\codex-work\album-page-check.png`，控制台 Errors 0、Warnings 0。

## Playwright 验收流程与坑
1. 先探测服务：`Invoke-WebRequest http://127.0.0.1:5173`，服务存在再做浏览器验收。
2. PowerShell 中先设置 npm cache：`$env:npm_config_cache='E:\project\likegirl\codex-work\npm-cache'`。
3. CLI 打开页面时指定 Edge：`npx --yes --package '@playwright/cli' playwright-cli --session <name> open http://127.0.0.1:5173 --browser msedge`。
4. 需要登录时用本地账号 `大帅哥` / `123456`，可通过 CLI snapshot 拿元素 ref 后 fill/click。
5. 复杂视觉调试优先使用临时脚本，例如 `E:\project\likegirl\codex-work\nav-dock-debug.cjs`，复用 npm cache 里的 `playwright-core` 并启动 `channel: 'msedge'`。
6. 滚动类问题要用真实滚轮：`page.mouse.wheel(0, 1200)`；不要只相信 `window.scrollTo`。
7. 验证 dock/遮挡问题时采样 `getBoundingClientRect()`、`getComputedStyle()`、`document.elementFromPoint()` 和父级链路的 `z-index/isolation/transform`。
8. 截图放到 `E:\project\likegirl\codex-work`，例如 `nav-dock-debug.png`；调试结束关闭 CLI session。

## 上下文压缩摘要
- 身份与边界：当前是 LikeGirl 前端 Agent，只改 `E:\project\likegirl\frontend`，不碰后端；所有回复中文；默认不启动服务。
- 重要协作规则：`planning-with-files-zh` 不再每次小改都记录，由我判断值得记录时记录；用户明确要求记录时必须记录。
- 首页现状：首屏插画、CSS 抛物线雪坡、导航已抽到 `HomeCozyShell.vue`，在 `App.vue` 登录后包裹 `RouterView`；其他页面内容出现在导航栏下方。
- CSS 现状：`src/styles.css` 是 import 入口；公共样式在 `src/styles/*.css`，页面样式在 `src/styles/pages/*.css`；后续新页面 CSS 放 `src/styles/pages/`。
- 顶部清理：天气邮票已删但天气 API/动画保留；用户入口、`/user` 路由、用户编辑页和用户入口组件已删；`src/api/user.ts` 保留。
- 验证现状：构建通过；用户入口删除相关定向测试通过；未做 Playwright 视觉验收。

---
*每执行2次查看/浏览器/搜索操作后更新此文件。*
