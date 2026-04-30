# 发现与决策

## 需求
- 用户要求使用 `planning-with-files-zh` 创建三个规划文件。
- 用户要求写入当前项目上下文。
- 用户明确说明：我是一个新的前端 Agent，目前还没有被指派任何任务。
- 2026-04-30 新任务：参考截图，将首页导航栏上移，使导航栏中心与雪坡中心重合。
- 2026-04-30 新任务：去掉雪坡图片，使用 CSS 构建抛物线曲线雪坡；用户随后明确不要考虑移动端。
- 2026-04-30 新任务：点击导航栏其他页面时，页面内容应出现在导航栏下方，顶部首屏与导航不被整页替换。
- 2026-04-30 协作规则调整：`planning-with-files-zh` 不按每次修改强制记录，由我判断修改是否值得记录；值得则记录，否则不记录。

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

## 遇到的问题
| 问题 | 解决方案 |
|------|---------|
| 第一次检查文件时 PowerShell 把 `$_` 解析成空，导致 `.Name` 错误 | 后续使用 `$PSItem` 并处理外层转义 |
| 第二次检查文件时内层字符串引号被吞，导致数组参数解析失败 | 改用外层 PowerShell 调用 `pwsh.exe` 的标准方式 |
| `rg.exe` 从 WindowsApps 路径启动被拒绝访问 | 改用 PowerShell `Get-ChildItem` 和 `Select-String` |
| PowerShell 行号片段查看命令中 `$变量` 被外层展开 | 改用无行号的 `Get-Content | Select-Object -Skip -First` |

## 资源
- 技能文件：`C:\Users\Acer\.agents\skills\planning-with-files-zh\SKILL.md`
- 模板目录：`C:\Users\Acer\.agents\skills\planning-with-files-zh\templates`

## 视觉/浏览器发现
- `hero-torn-wave.png` 尺寸为 `1555x177`，透明裁切后可见雪坡区域约 `145px` 高。
- 本次未主动启动本地前端服务；项目规则默认由用户自行启动服务。
- 桌面主样式已不再依赖 `hero-torn-wave.png`；`npm run build` 产物列表中不再出现 `hero-torn-wave` 资源。

---
*每执行2次查看/浏览器/搜索操作后更新此文件。*
