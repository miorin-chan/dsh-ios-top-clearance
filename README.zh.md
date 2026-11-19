# dsh-ios-top-clearance

把 DSH 手机版顶部抬出 iOS 主屏幕应用的系统模糊带。

## 问题

iOS 26 及以后，主屏幕 Web 应用会得到系统级的滚动边缘效果：视口最上面约
33 CSS px 由 WebKit 在上层模糊、压暗，页面自己渲染的那块是清晰的。DSH 手机
版的会话标题栏正好从视口顶部开始，标题行落在这条带子里，看起来发灰、发虚，
而下方的正文仍然锐利。

这不是页面样式造成的，也没有 CSS 开关能关掉它：原生应用用
`scrollView.topEdgeEffect.isHidden` 隐藏，网页够不到。页面侧唯一的办法是把
内容挪出这条带子。

## 插件做什么

仅在 iOS 独立应用（`navigator.standalone === true`）且宽度不超过 767px 时，
给会话标题栏加 24px 的上外边距——正好是这条带子伸进视口的距离。标题栏上方
留出的空白是页面背景，系统模糊过去只剩平色，标题和标签页恢复清晰。

其余不变：浏览器标签页、桌面端、Web UI 的其他页面以及标题栏内部的布局都不
受影响。

## 安装

```sh
dsh plugin --profile web add link:/path/to/plugins/dsh-ios-top-clearance
```

装完后重新打开主屏幕应用。如果标题顶部还剩一点虚边，把 `client.js` 里的
`BAND` 调大；这条带子是软过渡，24px 对应 62px 状态栏下 95px 的带底。

## 移除

```sh
dsh plugin --profile web remove dsh-ios-top-clearance
```

## 测试

```sh
node --test
```
