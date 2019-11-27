import minimal from 'minimal'
import { wait } from 'dom-testing-library'

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

            <span x-bind:output="foo"></span>
            <span x-bind:output="count++"></span>
        </div>
    `

    minimal.start()

    expect(document.querySelectorAll('span')[0].getAttribute('output')).toEqual('bar')
    expect(document.querySelectorAll('span')[1].getAttribute('output')).toEqual('0')

    document.querySelectorAll('button')[0].click()

    await wait(async () => {
        expect(document.querySelectorAll('span')[0].getAttribute('output')).toEqual('baz')
        expect(document.querySelectorAll('span')[1].getAttribute('output')).toEqual('0')

        document.querySelectorAll('button')[1].click()

        await wait(() => {
            expect(document.querySelectorAll('span')[0].getAttribute('output')).toEqual('baz')
            expect(document.querySelectorAll('span')[1].getAttribute('output')).toEqual('3')
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
