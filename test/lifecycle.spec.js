import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-init', async () => {
    var spanValue
    window.setSpanValue = (el) => {
        spanValue = el.innerHTML
    }

    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-init="window.setSpanValue($refs.foo)">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `

    Alpine.start()

    expect(spanValue).toEqual('baz')
})

test('x-init from data function with callback return for "x-mounted" functionality', async () => {
    var valueA
    var valueB
    window.setValueA = (el) => { valueA = el.innerHTML }
    window.setValueB = (el) => { valueB = el.innerText }
    window.data = function() {
        return {
            foo: 'bar',
            init() {
                window.setValueA(this.$refs.foo)

                return () => {
                    window.setValueB(this.$refs.foo)
                }
            }
        }
    }

    document.body.innerHTML = `
        <div x-data="window.data()" x-init="init()">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `

    Alpine.start()

    expect(valueA).toEqual('baz')
    expect(valueB).toEqual('bar')
})

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
