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

window.__ModuleLoader__.load({
  id: 'dsh-ios-top-clearance',
  factory() {
    /**
     * Height the system effect claims inside the viewport. On an iPhone 16 Pro
     * the status bar ends at about 62px and the blur at about 95px, so 24px of
     * inset puts the title line (frame y 34–64, glyphs 39–55) and the leading
     * seat (y 35–63) below the band. The band is a soft falloff; raising this
     * value moves the whole frame further down.
     */
    const BAND = 24

    /** iOS Home Screen apps are the only WebKit surface that composites the effect. */
    const isHomeScreenApp = (nav) => nav.standalone === true

    return {
      apply(ctx) {
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
      },
    }
  },
})
