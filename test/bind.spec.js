import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('attribute bindings are set on initialize', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-bind:foo="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')
})

test('class attribute bindings are merged by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="isOn ? 'bar': ''"></span>

            <button @click="isOn = ! isOn"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('bar')).toBeFalsy()

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('bar')).toBeFalsy()
    })
})

test('class attribute bindings are merged by array syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="isOn ? ['bar', 'baz']: ['bar']"></span>

            <button @click="isOn = ! isOn"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('baz')).toBeFalsy()

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('baz')).toBeTruthy()
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('baz')).toBeFalsy()
    })
})

test('class attribute bindings are removed by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="{ 'foo': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy()
})

test('class attribute bindings are added by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ initialClass: 'foo' }">
            <span x-bind:class="initialClass"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
})

test('class attribute bindings are added by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: true }">
            <span x-bind:class="{ 'foo': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
})

test('multiple classes are added by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo bar" x-bind:class="{ 'foo bar': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy()
    expect(document.querySelector('span').classList.contains('bar')).toBeFalsy()
})

test('multiple classes are removed by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: true }">
            <span x-bind:class="{ 'foo bar': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
})

test('class attribute bindings are added by nested object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ nested: { isOn: true } }">
            <span x-bind:class="{ 'foo': nested.isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
})

test('class attribute bindings are added by array syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <span class="" x-bind:class="['foo']"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy
})

test('class attribute bindings are synced by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 'bar baz'}">
            <span class="" x-bind:class="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy
    expect(document.querySelector('span').classList.contains('baz')).toBeTruthy
})

test('boolean attributes set to false are removed from element', async () => {
    document.body.innerHTML = `
        <div x-data="{ isSet: false }">
            <input x-bind:disabled="isSet"></input>
            <input x-bind:checked="isSet"></input>
            <input x-bind:required="isSet"></input>
            <input x-bind:readonly="isSet"></input>
            <input x-bind:hidden="isSet"></input>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].disabled).toBeFalsy()
    expect(document.querySelectorAll('input')[1].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[2].required).toBeFalsy()
    expect(document.querySelectorAll('input')[3].readOnly).toBeFalsy()
    expect(document.querySelectorAll('input')[4].hidden).toBeFalsy()
})

test('boolean attributes set to true are added to element', async () => {
    document.body.innerHTML = `
        <div x-data="{ isSet: true }">
            <input x-bind:disabled="isSet"></input>
            <input x-bind:checked="isSet"></input>
            <input x-bind:required="isSet"></input>
            <input x-bind:readonly="isSet"></input>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].disabled).toBeTruthy()
    expect(document.querySelectorAll('input')[1].checked).toBeTruthy()
    expect(document.querySelectorAll('input')[2].required).toBeTruthy()
    expect(document.querySelectorAll('input')[3].readOnly).toBeTruthy()
})

test('binding supports short syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span :class="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
})
