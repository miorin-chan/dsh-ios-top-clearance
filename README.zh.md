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
把 frame 根节点整体让出 24px——正好是这条带子伸进视口的距离。位移放在
`#root` 而不是会话标题栏上：frame 左上角的 leading seat（抽屉开关）是相对
frame 顶部绝对定位的，只挪标题栏会把它留在原地、悬在标题上方；挪根节点则让
开关、标题栏、抽屉一起下移。frame 上方的留白是页面背景，系统模糊过去只剩
平色。

浏览器标签页、桌面端和 frame 内部的布局都不受影响。

## 安装

```sh
dsh plugin --profile web add link:/path/to/plugins/dsh-ios-top-clearance
```

装完后重新打开主屏幕应用。如果最上面一行还剩一点虚边，把 `client.js` 里的
`BAND` 调大；这条带子是软过渡，24px 对应 62px 状态栏下 95px 的带底。

## 移除

```sh
dsh plugin --profile web remove dsh-ios-top-clearance
```

## 测试

```sh
node --test
```
