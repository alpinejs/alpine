import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-created', async () => {
    var spanValue
    window.setSpanValue = (el) => {
        spanValue = el.innerHTML
    }

    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-created="window.setSpanValue($refs.foo)">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `

    Alpine.start()

    expect(spanValue).toEqual('baz')
})

test('x-mounted', async () => {
    var spanValue
    window.setSpanValue = (el) => {
        spanValue = el.innerText
    }

    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-mounted="window.setSpanValue($refs.foo)">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `

    Alpine.start()

    expect(spanValue).toEqual('bar')
})

test('callbacks registered within x-created can affect reactive data changes', async () => {
    document.body.innerHTML = `
        <div x-data="{ bar: 'baz', foo() { this.$refs.foo.addEventListener('click', () => { this.bar = 'bob' }) } }" x-created="foo()">
            <button x-ref="foo"></button>

            <span x-text="bar"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('baz')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bob') })
})

test('callbacks registered within x-mounted can affect reactive data changes', async () => {
    document.body.innerHTML = `
        <div x-data="{ bar: 'baz', foo() { this.$refs.foo.addEventListener('click', () => { this.bar = 'bob' }) } }" x-mounted="foo()">
            <button x-ref="foo"></button>

            <span x-text="bar"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('baz')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bob') })
})
