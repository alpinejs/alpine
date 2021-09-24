import { haveText, html, test } from '../utils'

test('element side effects are cleaned up after the elements are removed',
    html`
        <div x-data="{ foo: 1, bar: 1 }">
            <button @click="bar++">bar</button>
            <a href="#" @click.prevent="$refs.span.remove()">remove</a>

            <span x-text="(() => { foo = foo + 1; return bar })" x-ref="span"></span>

            <h1 x-text="foo"></h1>
            <h2 x-text="bar"></h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('2'))
        get('h2').should(haveText('1'))
        get('button').click()
        get('h1').should(haveText('3'))
        get('h2').should(haveText('2'))
        get('a').click()
        get('button').click()
        get('h1').should(haveText('3'))
        get('h2').should(haveText('3'))
    }
)

test('nested element side effects are cleaned up after the parent is removed',
    html`
        <div x-data="{ foo: 1, bar: 1 }">
            <button @click="bar++">bar</button>
            <a href="#" @click.prevent="$refs.article.remove()">remove</a>

            <article x-ref="article">
                <span x-text="(() => { foo = foo + 1; return bar })"></span>
            </article>

            <h1 x-text="foo"></h1>
            <h2 x-text="bar"></h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('2'))
        get('h2').should(haveText('1'))
        get('button').click()
        get('h1').should(haveText('3'))
        get('h2').should(haveText('2'))
        get('a').click()
        get('button').click()
        get('h1').should(haveText('3'))
        get('h2').should(haveText('3'))
    }
)

test('can mutate directive value',
    html`
        <div x-data="{ foo: 'bar', bar: 'baz' }">
            <button @click="$refs.target.setAttribute('x-text', 'bar')">change text</button>

            <span x-text="foo" x-ref="target"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('can add new directive',
    html`
        <div x-data="{ foo: 'bar' }">
            <button @click="$refs.target.setAttribute('x-text', 'foo')">change text</button>

            <span x-ref="target"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText(''))
        get('button').click()
        get('span').should(haveText('bar'))
    }
)

test('can pause and queue mutations for later resuming/flushing',
    html`
        <div x-data="{ foo: 1 }">
            <button x-on:click="setTimeout(() => foo++)" x-ref="btn">foo</button>
            <h1 x-text="foo"></h1>

            <a href="#" @click="$refs.btn.removeAttribute('x-on:click')" id="remove">remove</a>
            <a href="#" @click="$refs.btn.setAttribute('x-on:click', 'foo++')" id="add">add</a>
            <a href="#" @click="Alpine.deferMutations()" id="defer">add</a>
            <a href="#" @click="Alpine.flushAndStopDeferringMutations()" id="flush">add</a>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('1'))
        get('button').click()
        get('h1').should(haveText('2'))
        get('#remove').click()
        get('button').click()
        get('h1').should(haveText('2'))
        get('#defer').click()
        get('#add').click()
        get('button').click()
        get('h1').should(haveText('2'))
        get('#flush').click()
        get('button').click()
        get('h1').should(haveText('3'))
    }
)
