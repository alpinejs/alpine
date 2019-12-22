import Alpine from 'alpinejs'

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

test('class attribute bindings are removed by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="{ 'foo': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy()
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

test('class attribute bindings are removed by array syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <span class="foo" x-bind:class="[]"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy()
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
