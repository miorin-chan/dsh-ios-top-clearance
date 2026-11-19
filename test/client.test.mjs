import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')

/**
 * Evaluate the browser half against a minimal fake page.
 * @param {object} options - `standalone` mirrors iOS's `navigator.standalone`.
 * @returns The loader registration, appended styles and effect cleanups.
 */
function load({ standalone }) {
  const styles = []
  const document = {
    createElement() {
      const element = {
        dataset: {},
        textContent: '',
        remove() {
          const at = styles.indexOf(element)
          if (at >= 0) styles.splice(at, 1)
        },
      }
      return element
    },
    head: {
      appendChild(element) {
        styles.push(element)
      },
    },
  }
  const window = {
    __ModuleLoader__: {
      load(registration) {
        window.registration = registration
      },
    },
  }
  new Function('window', 'navigator', 'document', source)(window, { standalone }, document)
  assert.ok(window.registration, 'client registers with the module loader')
  const cleanups = []
  const ctx = {
    effect(run) {
      cleanups.push(run())
    },
  }
  window.registration.factory().apply(ctx)
  return { styles, cleanups, registration: window.registration }
}

test('iOS Home Screen app insets the frame root out of the blur band', () => {
  const { styles, cleanups, registration } = load({ standalone: true })
  assert.equal(registration.id, 'dsh-ios-top-clearance')
  assert.equal(styles.length, 1)
  const css = styles[0].textContent
  assert.match(css, /#root\s*\{/)
  assert.match(css, /padding-top: 24px/)
  assert.match(css, /box-sizing: border-box/)
  assert.match(css, /max-width: 767px/)
  assert.equal(cleanups.length, 1)

  cleanups[0]()
  assert.equal(styles.length, 0, 'unloading removes the style')
})

test('browser tab leaves the frame alone', () => {
  const { styles, cleanups } = load({ standalone: false })
  assert.equal(styles.length, 0)
  assert.equal(cleanups.length, 0)
})

test('missing standalone flag leaves the frame alone', () => {
  const { styles } = load({ standalone: undefined })
  assert.equal(styles.length, 0)
})
