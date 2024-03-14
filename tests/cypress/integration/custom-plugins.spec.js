import { haveText, haveAttribute, html, test } from '../utils'

test('can register custom directive from plugin',
    [html`
        <div x-data>
            <span x-foo:bar.baz="bob"></span>
        </div>
    `,
    `
        Alpine.plugin((PluginAlpine) => {
          PluginAlpine.directive('foo', (el, { value, modifiers, expression }) => {
              el.textContent = value+modifiers+expression
          })
        })
    `],
    ({ get }) => get('span').should(haveText('barbazbob'))
)

test('can register custom magic properties from plugin',
    [html`
        <div x-data>
            <span x-text="$foo.bar"></span>
        </div>
    `,
    `
        Alpine.plugin((PluginAlpine) => {
          PluginAlpine.magic('foo', (el) => {
            return { bar: 'baz' }
          })
        })
    `],
    ({ get }) => get('span').should(haveText('baz'))
)

test('throws error when plugin is not a callback function',
    [html`
        <div x-data>
            <span x-foo:bar.baz="bob"></span>
        </div>
    `,
    `
        Alpine.plugin(undefined)
    `],
  () => {}, (err) => {
    expect(err.message).to.include('Alpine.plugin(...) expects a callback function but got');
    return false;
  },
)
