let { morph } = require('@alpinejs/morph')
let Alpine = require('alpinejs').default
let createElement = require('./createElement.js')

test('morphing an element with changed Alpine scope', () => {
    let template = `<div x-data="{ foo: 'bar' }">
        <button @click="foo = 'baz'">Change Foo</button>
        <span x-text="foo"></span>
    </div>`

    let dom = createElement(template)

    document.body.appendChild(dom)

    window.Alpine = Alpine
    window.Alpine.start()

    dom.querySelector('button').click()

    expect(dom.querySelector('span').textContent).toEqual('baz')

    morph(dom, template)

    expect(dom.querySelector('span').textContent).toEqual('baz')
})

test('morphing element with changed HTML AND Alpine scope', () => {
    let template = `<div x-data="{ foo: 'bar' }">
        <button @click="foo = 'baz'">Change Foo</button>
        <span x-text="foo"></span>
    </div>`

    let dom = createElement(template)

    document.body.appendChild(dom)

    window.Alpine = Alpine
    window.Alpine.start()

    dom.querySelector('button').click()

    expect(dom.querySelector('span').textContent).toEqual('baz')
    expect(dom.querySelector('button').textContent).toEqual('Change Foo')

    morph(dom, template.replace('Change Foo', 'Changed Foo'))

    expect(dom.querySelector('span').textContent).toEqual('baz')
    expect(dom.querySelector('button').textContent).toEqual('Changed Foo')
})

test('morphing an element with multiple nested Alpine components preserves scope', () => {
    let template = `<div x-data="{ foo: 'bar' }">
        <button @click="foo = 'baz'">Change Foo</button>
        <span x-text="foo"></span>

        <div x-data="{ bob: 'lob' }">
            <a href="#" @click.prevent="bob = 'law'">Change Bob</a>
            <h1 x-text="bob"></h1>
        </div>
    </div>`

    let dom = createElement(template)

    document.body.appendChild(dom)

    window.Alpine = Alpine
    window.Alpine.start()

    dom.querySelector('button').click()
    dom.querySelector('a').click()

    expect(dom.querySelector('span').textContent).toEqual('baz')
    expect(dom.querySelector('h1').textContent).toEqual('law')

    morph(dom, template)

    expect(dom.querySelector('span').textContent).toEqual('baz')
    expect(dom.querySelector('h1').textContent).toEqual('law')
})

test('morphing an alpine component with static javascript re-evaluates', () => {
    window.count = 1

    let template = `<div x-data>
        <span x-text="window.count"></span>
    </div>`

    let dom = createElement(template)

    document.body.appendChild(dom)

    window.Alpine = Alpine
    window.Alpine.start()

    expect(dom.querySelector('span').textContent).toEqual('1')

    window.count++

    morph(dom, template)

    expect(dom.querySelector('span').textContent).toEqual('2')
})
