/**
 * Browser half of `dsh-ios-top-clearance`.
 *
 * iOS 26 and later draw a scroll-edge effect over the first ~33 CSS px of a
 * Home Screen web app's viewport: the system blurs and dims whatever the page
 * paints there, while the page's own render is sharp. The conversation header
 * starts at the viewport top, so its 30px title row lands inside the band and
 * reads as smudged; content further down, such as the View tabs and the
 * transcript, is below the band and stays crisp.
 *
 * Native apps switch the effect off with `scrollView.topEdgeEffect.isHidden`.
 * A web page cannot reach it, and no CSS property disables it, so the only
 * page-side remedy is to keep content out of the band. This module moves the
 * header down by the band height in the iOS standalone app. The strip it
 * leaves above the header is page background, which the effect blurs into a
 * flat colour and which therefore shows no smear.
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
     * clearance puts the 20px title line (glyphs at y 15–31) below the band
     * without leaving a whole blank header above the content. The band is a
     * soft falloff; raising this value moves the header further down.
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
  header[data-window-drag] {
    margin-top: ${String(BAND)}px;
  }
}`
          document.head.appendChild(style)
          return () => { style.remove() }
        }, 'dsh-ios-top-clearance: header clearance')
      },
    }
  },
})
