import { beVisible, haveText, html, test } from '../utils'

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

test('does not initialise components twice when contained in multiple mutations',
    html`
        <div x-data="{
            foo: 0,
            bar: 0,
            test() {
                container = document.createElement('div')
                this.$root.appendChild(container)
                alpineElement = document.createElement('span')
                alpineElement.setAttribute('x-data', '{init() {this.bar++}}')
                alpineElement.setAttribute('x-init', 'foo++')
                container.appendChild(alpineElement)
            }
        }">
            <span id="one" x-text="foo"></span>
            <span id="two" x-text="bar"></span>
            <button @click="test">Test</button>
        </div>
    `,
    ({ get }) => {
        get('span#one').should(haveText('0'))
        get('span#two').should(haveText('0'))
        get('button').click()
        get('span#one').should(haveText('1'))
        get('span#two').should(haveText('1'))
    }
)

test('directives keep working when node is moved into a different one',
    html`
        <div x-data="{
            foo: 0,
            mutate() {
                let button = document.getElementById('one')
                button.remove()
                let container = document.createElement('p')
                container.appendChild(button)
                this.$root.appendChild(container)
            }
        }">
            <button id="one" @click="foo++">increment</button>
            <button id="two" @click="mutate()">Mutate</button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('button#one').click()
        get('span').should(haveText('1'))
        get('button#two').click()
        get('p').should(beVisible())
        get('button#one').click()
        get('span').should(haveText('2'))
    }
)

test('no side effects when directives are added to an element that is removed afterwards',
    html`
        <div x-data="{
            foo: 0,
            mutate() {
                let span = document.createElement('span')
                span.setAttribute('x-on:keydown.a.window', 'foo = foo+1')
                let container = document.getElementById('container')
                container.appendChild(span)
                container.remove()
            }
        }">
            <button @click="mutate()">Mutate</button>
            <p id="container"></p>
            <input type="text">

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('button').click()
        get('input').type('a')
        get('span').should(haveText('0'))
    }
)
