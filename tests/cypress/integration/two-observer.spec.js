import { haveText, html, test } from '../utils'

test('dynamically added x-data component is detected and initialized',
    html`
        <div x-data="{
            add() {
                let el = document.createElement('div')
                el.setAttribute('x-data', '{ msg: &quot;hello&quot; }')
                let span = document.createElement('span')
                span.setAttribute('x-text', 'msg')
                el.appendChild(span)
                document.getElementById('container').appendChild(el)
            }
        }">
            <button @click="add">Add</button>
            <div id="container"></div>
        </div>
    `,
    ({ get }) => {
        get('#container').should('have.text', '')
        get('button').click()
        get('#container span').should(haveText('hello'))
    }
)

test('dynamically added nested x-data components are detected',
    html`
        <div x-data="{
            add() {
                let wrapper = document.createElement('div')
                let inner = document.createElement('div')
                inner.setAttribute('x-data', '{ count: 42 }')
                let span = document.createElement('span')
                span.setAttribute('x-text', 'count')
                inner.appendChild(span)
                wrapper.appendChild(inner)
                document.getElementById('container').appendChild(wrapper)
            }
        }">
            <button @click="add">Add</button>
            <div id="container"></div>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('#container span').should(haveText('42'))
    }
)

test('dynamically removed x-data component is cleaned up',
    html`
        <div x-data="{ count: 0 }">
            <button @click="count++">increment</button>
            <span x-text="count"></span>
            <a href="#" @click.prevent="document.getElementById('dynamic').remove()">remove</a>
        </div>

        <div x-data="{ val: 'dynamic' }" id="dynamic">
            <p x-text="val"></p>
        </div>
    `,
    ({ get }) => {
        get('p').should(haveText('dynamic'))
        get('a').click()
        get('p').should('not.exist')
        // Ensure the remaining component still works
        get('button').click()
        get('span').should(haveText('1'))
    }
)

test('mutations inside a component still work (attribute changes)',
    html`
        <div x-data="{ foo: 'bar', baz: 'qux' }">
            <button @click="$refs.target.setAttribute('x-text', 'baz')">change</button>
            <span x-text="foo" x-ref="target"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('qux'))
    }
)

test('mutations inside a component still work (element additions)',
    html`
        <div x-data="{ foo: 'hello' }">
            <button @click="
                let span = document.createElement('span')
                span.setAttribute('x-text', 'foo')
                $refs.container.appendChild(span)
            ">add</button>
            <div x-ref="container"></div>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('span').should(haveText('hello'))
    }
)

test('component added outside existing components via third-party script is initialized',
    [html`
        <div x-data="{ existing: true }">
            <span x-text="'existing'"></span>
        </div>
        <div id="injection-point"></div>
    `, `
        setTimeout(() => {
            let el = document.createElement('div')
            el.setAttribute('x-data', '{ injected: true }')
            el.innerHTML = '<p x-text=\"\\'injected\\'\">'
            document.getElementById('injection-point').appendChild(el)
        }, 100)
    `],
    ({ get }) => {
        get('span').should(haveText('existing'))
        get('p', { timeout: 2000 }).should(haveText('injected'))
    }
)
