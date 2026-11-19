# dsh-ios-top-clearance

Keeps the DSH phone header out of the iOS Home Screen app's top blur band.

## The problem

On iOS 26 and later, a Home Screen web app gets a system scroll-edge effect:
the first ~33 CSS px of the viewport are blurred and dimmed by WebKit, above
the page's own rendering. In the DSH Web UI the conversation header starts at
the viewport top, so its title row lands inside that band and looks smudged —
"修复 Reflow 排版并验证回归" reads grey and soft while the transcript below
stays sharp.

The effect is not a page style. Native apps hide it with
`scrollView.topEdgeEffect.isHidden`; a web page has no CSS or JavaScript
switch for it, so the only remedy is to keep content out of the band.

## What this plugin does

In the iOS standalone app only (`navigator.standalone === true`) and only at
phone widths (`max-width: 767px`), it gives the conversation header 24px of
top margin, which is the band's reach into the viewport. The gap above the
header is page background, so the system blur has nothing to smear, and the
title and tabs render sharp.

Nothing else changes: browser tabs, the desktop app, other pages of the Web UI
and the rest of the header layout are untouched.

## Install

```sh
dsh plugin --profile web add link:/path/to/plugins/dsh-ios-top-clearance
```

The package is a bundle, so adding it also inserts it into the profile's
bundles. Reload the Home Screen app after installing.

If the header still catches a faint soft edge at the top, raise `BAND` in
`client.js` — the band is a soft falloff and 24px matches a 95px band end
below a 62px status bar.

## Remove

```sh
dsh plugin --profile web remove dsh-ios-top-clearance
```

## Test

```sh
node --test
```
