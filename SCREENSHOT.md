# 截图流程

用于截图时被登录页拦住的场景：先用 Playwright 自动登录，再截图登录后的页面。

## 前提

- 前端服务已启动：`http://127.0.0.1:5173`
- 后端服务已启动：`http://127.0.0.1:8080`
- 使用 PowerShell：`D:\PowerShell-7.6.1\pwsh.exe`
- 测试账号：`大帅哥`
- 测试密码：`123456`
- 截图和缓存目录放在：`E:\project\likegirl\codex-work`

## 命令流程

在 `E:\project\likegirl` 下执行：

```powershell
& 'D:\PowerShell-7.6.1\pwsh.exe' -NoProfile
```

进入 PowerShell 后设置 npm cache 和 Playwright 会话名：

```powershell
$env:npm_config_cache = 'E:\project\likegirl\codex-work\npm-cache'
$env:PLAYWRIGHT_CLI_SESSION = 'likegirl-shot'
```

打开页面：

```powershell
npx --yes --package @playwright/cli playwright-cli open 'http://127.0.0.1:5173' --browser msedge
```

抓取页面快照，找到账号输入框、密码输入框和登录按钮的引用：

```powershell
npx --yes --package @playwright/cli playwright-cli snapshot
```

本次实际快照中的引用是：

- 账号输入框：`e26`
- 密码输入框：`e28`
- 登录按钮：`e29`

填入账号密码并登录：

```powershell
npx --yes --package @playwright/cli playwright-cli fill e26 '大帅哥'
npx --yes --package @playwright/cli playwright-cli fill e28 '123456'
npx --yes --package @playwright/cli playwright-cli click e29
```

等待进入首页后，再抓一次快照确认已经登录：

```powershell
Start-Sleep -Seconds 2
npx --yes --package @playwright/cli playwright-cli snapshot
```

保存整页截图：

```powershell
npx --yes --package @playwright/cli playwright-cli screenshot --filename 'E:\project\likegirl\codex-work\likegirl-home-login-shot.png' --full-page
```

关闭浏览器会话：

```powershell
npx --yes --package @playwright/cli playwright-cli close
```

## 注意

`snapshot` 里的 `e26`、`e28`、`e29` 这类引用不是固定不变的。如果页面结构变了，需要重新执行 `snapshot`，再用新的引用填表和点击。
