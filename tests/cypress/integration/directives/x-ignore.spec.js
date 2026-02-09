import { haveClasses, haveText, html, notHaveClasses, notHaveText, test } from '../../utils'

test('x-ignore',
    html`
        <div x-data="{ foo: 'bar' }">
            <div x-ignore>
                <span x-text="foo"></span>
            </div>
        </div>
    `,
    ({ get }) => {
        get('span').should(notHaveText('bar'))
    }
)

test('x-ignore.self',
    html`
        <div x-data="{ foo: 'bar' }">
            <h1 x-ignore.self :class="foo">
                <span x-text="foo"></span>
            </h1>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('h1').should(notHaveClasses(['bar']))
    }
)

test('can lazyload a component',
    html`
        <div x-data="{ lazyLoad() {$el.querySelector('#lazy').removeAttribute('x-ignore'); Alpine.nextTick(() => Alpine.initTree($el.querySelector('#lazy')))} }">
            <button @click="lazyLoad">Load</button>
            <div x-data="{ foo: 'bar' }" id="lazy" x-ignore :class="foo">
                <span x-text="foo"></span>
            </div>
        </div>
    `,
    ({ get }) => {
        get('span').should(notHaveText('bar'))
        get('div#lazy').should(notHaveClasses(['bar']))
        get('button').click()
        get('span').should(haveText('bar'))
        get('div#lazy').should(haveClasses(['bar']))
    }
)
