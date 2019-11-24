import rename from 'rename-me'

test('attribute bindings are set on initialize', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-bind:foo="$data.foo"></span>
        </div>
    `

    rename.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')
})

test('class attribute bindings are removed by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="{ 'foo': $data.isOn }"></span>
        </div>
    `

    rename.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy
})

test('class attribute bindings are added by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: true }">
            <span x-bind:class="{ 'foo': $data.isOn }"></span>
        </div>
    `

    rename.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy
})

test('boolean attributes set to false are removed from element', async () => {
    document.body.innerHTML = `
        <div x-data="{ isSet: false }">
            <input x-bind:disabled="$data.isSet"></input>
            <input x-bind:checked="$data.isSet"></input>
            <input x-bind:required="$data.isSet"></input>
            <input x-bind:readonly="$data.isSet"></input>
        </div>
    `

    rename.start()

    expect(document.querySelectorAll('input')[0].disabled).toBeFalsy()
    expect(document.querySelectorAll('input')[1].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[2].required).toBeFalsy()
    expect(document.querySelectorAll('input')[3].readOnly).toBeFalsy()
})

test('boolean attributes set to true are added to element', async () => {
    document.body.innerHTML = `
        <div x-data="{ isSet: true }">
            <input x-bind:disabled="$data.isSet"></input>
            <input x-bind:checked="$data.isSet"></input>
            <input x-bind:required="$data.isSet"></input>
            <input x-bind:readonly="$data.isSet"></input>
        </div>
    `

    rename.start()

    expect(document.querySelectorAll('input')[0].disabled).toBeTruthy()
    expect(document.querySelectorAll('input')[1].checked).toBeTruthy()
    expect(document.querySelectorAll('input')[2].required).toBeTruthy()
    expect(document.querySelectorAll('input')[3].readOnly).toBeTruthy()
})

test('data modified in event listener updates effected attribute bindings', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="$data.foo = 'baz'"></button>

            <span x-bind:foo="$data.foo"></span>
        </div>
    `

    rename.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.querySelector('button').click()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('baz')
})

test('data modified in event listener doesnt update uneffected attribute bindings', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar', count: 0 }">
            <button x-on:click="$data.foo = 'baz'"></button>
            <button x-on:click="$data.count++"></button>

            <span x-bind:value="$data.foo"></span>
            <span x-bind:value="$data.count++"></span>
        </div>
    `

    rename.start()

    expect(document.querySelectorAll('span')[0].getAttribute('value')).toEqual('bar')
    expect(document.querySelectorAll('span')[1].getAttribute('value')).toEqual('0')

    document.querySelectorAll('button')[0].click()

    expect(document.querySelectorAll('span')[0].getAttribute('value')).toEqual('baz')
    expect(document.querySelectorAll('span')[1].getAttribute('value')).toEqual('0')

    document.querySelectorAll('button')[1].click()

    expect(document.querySelectorAll('span')[0].getAttribute('value')).toEqual('baz')
    expect(document.querySelectorAll('span')[1].getAttribute('value')).toEqual('3')
})
