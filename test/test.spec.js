import minimal from 'minimal'
import { wait } from 'dom-testing-library'

test('attribute bindings are set on initialize', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-bind:foo="foo"></span>
        </div>
    `

    minimal.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')
})

test('x-text on init', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>
        </div>
    `

    minimal.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('x-text on triggered update', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '' }">
            <button x-on:click="foo = 'bar'"></button>

            <span x-text="foo"></span>
        </div>
    `

    minimal.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('class attribute bindings are removed by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="{ 'foo': isOn }"></span>
        </div>
    `

    minimal.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy
})

test('class attribute bindings are added by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: true }">
            <span x-bind:class="{ 'foo': isOn }"></span>
        </div>
    `

    minimal.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy
})

test('boolean attributes set to false are removed from element', async () => {
    document.body.innerHTML = `
        <div x-data="{ isSet: false }">
            <input x-bind:disabled="isSet"></input>
            <input x-bind:checked="isSet"></input>
            <input x-bind:required="isSet"></input>
            <input x-bind:readonly="isSet"></input>
        </div>
    `

    minimal.start()

    expect(document.querySelectorAll('input')[0].disabled).toBeFalsy()
    expect(document.querySelectorAll('input')[1].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[2].required).toBeFalsy()
    expect(document.querySelectorAll('input')[3].readOnly).toBeFalsy()
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

    minimal.start()

    expect(document.querySelectorAll('input')[0].disabled).toBeTruthy()
    expect(document.querySelectorAll('input')[1].checked).toBeTruthy()
    expect(document.querySelectorAll('input')[2].required).toBeTruthy()
    expect(document.querySelectorAll('input')[3].readOnly).toBeTruthy()
})

test('data modified in event listener updates effected attribute bindings', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>

            <span x-bind:foo="foo"></span>
        </div>
    `

    minimal.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test('data modified in event listener doesnt update uneffected attribute bindings', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar', count: 0 }">
            <button x-on:click="foo = 'baz'"></button>
            <button x-on:click="count++"></button>

            <span x-bind:value="foo"></span>
            <span x-bind:value="count++"></span>
        </div>
    `

    minimal.start()

    expect(document.querySelectorAll('span')[0].getAttribute('value')).toEqual('bar')
    expect(document.querySelectorAll('span')[1].getAttribute('value')).toEqual('0')

    document.querySelectorAll('button')[0].click()

    await wait(async () => {
        expect(document.querySelectorAll('span')[0].getAttribute('value')).toEqual('baz')
        expect(document.querySelectorAll('span')[1].getAttribute('value')).toEqual('0')

        document.querySelectorAll('button')[1].click()

        await wait(() => {
            expect(document.querySelectorAll('span')[0].getAttribute('value')).toEqual('baz')
            expect(document.querySelectorAll('span')[1].getAttribute('value')).toEqual('3')
        })
    })
})

test('click away', async () => {
    document.body.innerHTML = `
        <div id="outer">
            <div x-data="{ isOpen: true }">
                <button x-on:click="isOpen = true"></button>

                <ul x-bind:value="isOpen" x-on:click.away="isOpen = false">
                    <li>...</li>
                </ul>
            </div>
        </div>
    `

    minimal.start()

    expect(document.querySelector('ul').getAttribute('value')).toEqual('true')

    document.querySelector('li').click()

    await wait(() => { expect(document.querySelector('ul').getAttribute('value')).toEqual('true') })

    document.querySelector('ul').click()

    await wait(() => { expect(document.querySelector('ul').getAttribute('value')).toEqual('true') })

    document.querySelector('#outer').click()

    await wait(() => { expect(document.querySelector('ul').getAttribute('value')).toEqual('false') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('ul').getAttribute('value')).toEqual('true') })
})
