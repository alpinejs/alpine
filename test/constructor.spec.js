import Alpine from 'alpinejs'
import { fireEvent, wait } from '@testing-library/dom'

test('auto-detect new components at the top level', async () => {
    var runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    document.body.innerHTML = `
        <section></section>
    `

    Alpine.start()

    document.querySelector('section').innerHTML = `
        <div x-data="{ foo: '' }">
            <input x-model="foo">
            <span x-text="foo"></span>
        </div>
    `
    runObservers[0]([
        {
            target: document.querySelector('section'),
            type: 'childList',
            addedNodes: [ document.querySelector('div') ],
        }
    ])

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' }})

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('auto-detect newsted new components at the top level', async () => {
    var runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    document.body.innerHTML = `
        <section></section>
    `

    Alpine.start()

    document.querySelector('section').innerHTML = `
        <article>
            <div x-data="{ foo: '' }">
                <input x-model="foo">
                <span x-text="foo"></span>
            </div>
        </article>
    `
    runObservers[0]([
        {
            target: document.querySelector('section'),
            type: 'childList',
            addedNodes: [ document.querySelector('article') ],
        }
    ])

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' }})

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('auto-detect new components and dont lose state of existing ones', async () => {
    var runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    document.body.innerHTML = `
        <div id="A" x-data="{ foo: '' }">
            <input x-model="foo">
            <span x-text="foo"></span>

            <div id="B"></div>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' }})

    await wait(() => { expect(document.querySelector('#A span').innerText).toEqual('bar') })

    document.querySelector('#B').innerHTML = `
        <div x-data="{foo: 'baz'}">
            <input x-model="foo">
            <span x-text="foo"></span>
        </div>
    `

    runObservers[0]([
        {
            target: document.querySelector('#A'),
            type: 'childList',
            addedNodes: [ document.querySelector('#B div') ],
        }
    ])

    await wait(() => {
        expect(document.querySelector('#A span').innerText).toEqual('bar')
        expect(document.querySelector('#B span').innerText).toEqual('baz')
    })
})

test('auto-detect new components that are wrapped in non-new component tags', async () => {
    var runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    document.body.innerHTML = `
        <div id="A" x-data="{ foo: '' }">
            <input x-model="foo">
            <span x-text="foo"></span>

            <div id="B"></div>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' }})

    await wait(() => { expect(document.querySelector('#A span').innerText).toEqual('bar') })

    document.querySelector('#B').innerHTML = `
        <section>
            <div x-data="{foo: 'baz'}">
                <input x-model="foo">
                <span x-text="foo"></span>
            </div>
        </section>
    `

    runObservers[0]([
        {
            target: document.querySelector('#A'),
            type: 'childList',
            addedNodes: [ document.querySelector('#B section') ],
        }
    ])

    await wait(() => {
        expect(document.querySelector('#A span').innerText).toEqual('bar')
        expect(document.querySelector('#B span').innerText).toEqual('baz')
    })
})

test('auto-initialize new elements added to a component', async () => {
    var runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <span x-text="count"></span>

            <div id="target">
            </div>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual(0)

    document.querySelector('#target').innerHTML = `
        <span x-text="count"></span>

        <button x-on:click="count++"></button>
    `

    runObservers[0]([
        { target: document.querySelector('#target'), addedNodes: [
            document.querySelector('#target span'),
            document.querySelector('#target button'),
        ] }
    ])

    await wait(() => { expect(document.querySelector('#target span').innerText).toEqual(0) })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(1) })
    await wait(() => { expect(document.querySelector('#target span').innerText).toEqual(1) })
})

test('auto-detect x-data property changes at run-time', async () => {
    var runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <span x-text="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual(0)

    document.querySelector('div').setAttribute('x-data', '{ count: 1 }')

    runObservers[0]([
        {
            addedNodes: [],
            type: 'attributes',
            attributeName: 'x-data',
            target: document.querySelector('div')
        }
    ])

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(1) })
})
