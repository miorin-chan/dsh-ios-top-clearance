/**
 * Browser half of `dsh-ios-top-clearance`.
 *
 * iOS 26 and later draw a scroll-edge effect over the first ~33 CSS px of a
 * Home Screen web app's viewport: the system blurs and dims whatever the page
 * paints there, while the page's own render is sharp. DSH's frame starts at
 * the viewport top, so the conversation title row (frame y 10–40) lands inside
 * the band and reads as smudged, while the View tabs and the transcript below
 * stay crisp.
 *
 * Native apps switch the effect off with `scrollView.topEdgeEffect.isHidden`.
 * A web page cannot reach it, and no CSS property disables it, so the only
 * page-side remedy is to keep content out of the band. This module insets the
 * whole frame root by the band height in the iOS standalone app. The strip it
 * leaves above the frame is page background, which the effect blurs into a
 * flat colour and which therefore shows no smear.
 *
 * The inset belongs on the frame root, not on the conversation header: the
 * frame's leading seat (ui-sidebar's drawer opener) is absolutely positioned
 * against the frame top, so moving only the header strands that control above
 * the title. Insetting the root moves every frame-anchored element — leading
 * seat, header, drawer — together.
 *
 * Scope is deliberately narrow: `navigator.standalone` exists only in the iOS
 * Home Screen app, and the width query keeps tablets and desktop installed
 * PWAs untouched.
 */

import type { Context } from '@deepseek-ai/cordis'

/**
 * Height the system effect claims inside the viewport. On an iPhone 16 Pro
 * the status bar ends at about 62px and the blur at about 95px. 16px of
 * inset starts the title line at frame y 26 (ink from about y 35), so the
 * title clears the band and the frame gives back 8px compared with 24px;
 * the leading seat's top edge (y 27) stays at the band's soft edge. Raising
 * this value moves the whole frame further down and clears more of it.
 */
const BAND = 16

/** iOS Home Screen apps are the only WebKit surface that composites the effect. */
const isHomeScreenApp = (nav: Navigator & { readonly standalone?: boolean }) => nav.standalone === true

export function apply(ctx: Context): void {
  if (!isHomeScreenApp(navigator)) return
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-ios-top-clearance'
    style.textContent = `@media (max-width: 767px) {
  #root {
    box-sizing: border-box;
    padding-top: ${String(BAND)}px;
  }
}`
    document.head.appendChild(style)
    return () => { style.remove() }
  }, 'dsh-ios-top-clearance: frame clearance')
}
