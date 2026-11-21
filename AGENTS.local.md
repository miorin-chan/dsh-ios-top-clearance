# AGENTS.local

本文件补充 [AGENTS.md](AGENTS.md)，记录 iOS 顶部留白的项目约定。
两者冲突时以本文件为准。

## 范围与结构

- 本 bundle 独立安装和启停。
  [client.js](client.js) 是浏览器模块，文件头记录滚动模糊带、16px 顶部留白以及 DSH frame 的定位关系。
  [index.js](index.js) 是供 [bundle patch](cordis.patch.yml) 加载的空 Host 模块。
- `navigator.standalone === true` 限定 iOS 主屏幕应用。
  宽度限制在 CSS 中处理，以适应视口宽度变化。
  在 `#root` 留出空间，使抽屉开关、标题栏及抽屉整体下移。
  由 `ctx.effect` 注册样式并负责卸载时移除。
- `locale/*.json` 仅保存 Plugin Manager 的展示文案，八种语言为 `en`、`zh`、`ja`、`de`、`es`、`fr`、`pt`、`ru`。
  客户端没有额外界面文案或服务注入。
  [icon.svg](icon.svg) 是 bundle 图标。

## 开发约束

- 常见操作按钮优先使用易识别的图标，仅在图标无法明确表达操作含义时使用可见文字。
- 新增实现用 TypeScript，复用与目标 DSH 版本匹配的官方类型，在接口、配置和事件中保留类型信息，并同步维护类型依赖。
- 只用 DSH 支持的插件 API 和扩展点实现新行为。
  禁止修改 DSH 源码或安装产物，也禁止用全局猴子补丁或覆写内部实现绕过边界。
  扩展点不足时说明缺口，并将实现限制在插件能力内。

## 文档与验证

- [README.md](README.md) 是英文用户文档，[README.zh.md](README.zh.md) 是中文版。
  设计与验证记录用中文，入口见 [文档索引](docs/README.md)。
- 在项目目录运行 `node --test`、`node --check client.js && node --check index.js` 及 `npm pack --dry-run --json`。
  [客户端测试](test/client.test.mjs) 用假页面验证样式注册、应用范围和卸载清理。
- 在工作区运行 `node tools/new-dsh-plugin/cli.mjs --check plugins/dsh-ios-top-clearance`。
  如需设备验证，用临时 profile 在 iOS 主屏幕应用确认标题和抽屉开关的位置，并对照普通浏览器标签页。
- 用 `docs/scripts/reflow md <path>` 重排修改过的英文 Markdown。
  命令需要 Python 3.11 或更新版本。
- 在项目根运行 `prek install`，之后提交时会自动重排暂存的 Markdown。
- 在 DSH 沙箱内提交时，用 `PREK_HOME="${TMPDIR:?}/prek-dsh" git commit -m "<commit message>"`，
  让 reflow 钩子照常运行，并把 `prek` 的缓存和日志写到可写的临时目录。
