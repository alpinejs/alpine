import projectX from 'project-x'
import { wait } from 'dom-testing-library'

global.MutationObserver = class {
    observe() {}
}

test('data modified in event listener updates effected attribute bindings', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>

            <span x-bind:foo="foo"></span>
        </div>
    `

    projectX.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test('.stop modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'">
                <span></span>
            </button>
        </div>
    `

    projectX.start()

    expect(document.querySelector('div').__x.data.foo).toEqual('bar')

    document.querySelector('span').click()

    await wait(() => {
        expect(document.querySelector('div').__x.data.foo).toEqual('baz')
    })
})

test('.prevent modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <input type="checkbox" x-on:click.prevent>
        </div>
    `

    projectX.start()

    expect(document.querySelector('input').checked).toEqual(false)

    document.querySelector('input').click()

    expect(document.querySelector('input').checked).toEqual(false)
})

test('click away', async () => {
    document.body.innerHTML = `
        <style>.hidden { display: none; }</style>
        <div id="outer">
            <div x-data="{ isOpen: true }">
                <button x-on:click="isOpen = true"></button>

                <ul x-bind:class="{ 'hidden': ! isOpen }" x-on:click.away="isOpen = false">
                    <li>...</li>
                </ul>
            </div>
        </div>
    `

    projectX.start()

    expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false)

    document.querySelector('li').click()

    await wait(() => { expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false) })

    document.querySelector('ul').click()

    await wait(() => { expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false) })

    document.querySelector('#outer').click()

    await wait(() => { expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false) })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false) })
})
