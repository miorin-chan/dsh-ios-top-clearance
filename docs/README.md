# 项目文档

- [产品设计](../DESIGN.md)：用户问题、适用边界与成功标准。
- [English README](../README.md) · [中文 README](../README.zh.md)：适用范围、安装与移除。
- [浏览器源码](../src/client/index.ts) 记录 iOS 滚动边缘效果、frame 定位与样式生命周期。
- [通用约定](../AGENTS.md) · [项目约定](../AGENTS.local.md)：维护与验证方法。

## 原理与调参说明

- iOS 26+ 主屏幕 Web App 的系统滚动边缘效果由 WebKit 叠加在视口顶部约 33 CSS px 区域，
  原生应用用 `scrollView.topEdgeEffect.isHidden` 隐藏，Web 侧无开关可关。
- 位移施加在 `#root` 而非会话标题栏，因为左上角抽屉开关（leading seat）相对 frame 顶部绝对定位，
  整体下移 `#root` 才能让开关、标题与抽屉同步让出；顶部留白由页面背景色填充。
- 若最上方仍见轻微虚边，可在 [src/client/index.ts](../src/client/index.ts) 中调大 `BAND`（默认 16 px，
  24 px 可覆盖 62 px 状态栏下 95 px 的过渡底缘）并运行 `npm run build`。
- 首次检出运行 `pnpm install` 与 `npm test` 构建并执行单元测试。
