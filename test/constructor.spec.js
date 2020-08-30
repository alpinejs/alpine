import Alpine from 'alpinejs'
import { fireEvent, wait } from '@testing-library/dom'
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

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

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('bar') })
})

test('auto-detect nested new components at the top level', async () => {
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

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('bar') })
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

    await wait(() => { expect(document.querySelector('#A span').textContent).toEqual('bar') })

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
        expect(document.querySelector('#A span').textContent).toEqual('bar')
        expect(document.querySelector('#B span').textContent).toEqual('baz')
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

    await wait(() => { expect(document.querySelector('#A span').textContent).toEqual('bar') })

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
        expect(document.querySelector('#A span').textContent).toEqual('bar')
        expect(document.querySelector('#B span').textContent).toEqual('baz')
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

    expect(document.querySelector('span').textContent).toEqual('0')

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

    await wait(() => { expect(document.querySelector('#target span').textContent).toEqual('0') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1') })
    await wait(() => { expect(document.querySelector('#target span').textContent).toEqual('1') })
})

test('Alpine mutations don\'t trigger (like x-if and x-for) MutationObserver', async () => {
    var runObservers = []
    var evaluations = 0

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }
    window.bob = () => {
        evaluations++
        return 'lob'
    }

    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" id="component">
            <template x-if="foo === 'baz'">
                <span x-text="bob()"></span>
            </template>

            <button @click="foo = 'baz'"></button>
        </div>
    `

    Alpine.start()

    document.querySelector('button').click()

    // Wait out the rendering tick.
    await new Promise(resolve => setTimeout(resolve, 1))

    // Run both queud mutations.
    runObservers[0]([
        { target: document.querySelector('#component'), addedNodes: [
            document.querySelector('#component span'),
        ] }
    ])
    runObservers[1]([
        { target: document.querySelector('#component'), addedNodes: [
            document.querySelector('#component span'),
        ] }
    ])

    expect(evaluations).toEqual(2)
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

    expect(document.querySelector('span').textContent).toEqual('0')

    document.querySelector('div').setAttribute('x-data', '{ count: 1 }')

    runObservers[0]([
        {
            addedNodes: [],
            type: 'attributes',
            attributeName: 'x-data',
            target: document.querySelector('div')
        }
    ])

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1') })
})

test('can use $el when changing x-data property at run-time', async () => {
    var runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    document.body.innerHTML = `
        <div x-data="{ count: '0' }" data-count="1">
            <span x-text="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('0')

    document.querySelector('div').setAttribute('x-data', '{ count: $el.dataset.count }')

    runObservers[0]([
        {
            addedNodes: [],
            type: 'attributes',
            attributeName: 'x-data',
            target: document.querySelector('div')
        }
    ])

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1') })
})

test('nested components only get registered once on initialization', async () => {
    global.MutationObserver = class {
        constructor(callback) {}
        observe() {}
    }

    var initCount = 0
    window.registerInit = function () {
        initCount = initCount + 1
    }

    document.body.innerHTML = `
        <div x-data x-init="registerInit()">
            <div x-data x-init="registerInit()"></div>
        </div>
    `

    Alpine.start()

    expect(initCount).toEqual(2)
})

test('can clone an existing component to a new element', async () => {
    global.MutationObserver = class {
        constructor(callback) {}
        observe() {}
    }

    document.body.innerHTML = `
        <h1 x-data="{ foo: 'bar' }"></h1>

        <div id="insert-component-here"></div>
    `

    Alpine.start()

    document.querySelector('#insert-component-here').innerHTML = `
        <h2 x-data="{ foo: 'baz' }">
            <span x-text="foo"></span>
        </h2>
    `

    Alpine.clone(document.querySelector('h1').__x, document.querySelector('h2'))

    expect(document.querySelector('span').textContent).toEqual('bar')
})

test('x-attributes are matched exactly', async () => {
    document.body.innerHTML = `
        <div x-data="{ showElement: false }">
            <div id="el1" x-show="showElement" />
            <div id="el2" xxx-show="showElement" />
            <div id="el3" x-showabc="showElement" />
        </div>
    `

    Alpine.start()

    expect(document.getElementById('el1').style.display).toEqual('none')
    expect(document.getElementById('el2').style.display).not.toEqual('none')
    await wait(() => { expect(document.getElementById('el3').style.display).not.toEqual('none') })
})


test('a mutation from another part of the HTML doesnt prevent a different alpine component from initializing', async () => {
    document.body.innerHTML = `
        <div x-data x-init="registerInit()">
        </div>
    `

    var initCount = 0
    window.registerInit = function () {
        initCount = initCount + 1
    }

    var runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    Alpine.start()

    await wait(() => { expect(initCount).toEqual(1) })

    document.querySelector('div').innerHTML = `
        <h1 x-data x-init="registerInit()"></h1>
    `
    let h2 = document.createElement('h2')
    document.querySelector('div').parentElement.appendChild(h2)

    await timeout(5)

    runObservers[0]([
        {
            target: document.querySelector('h2'),
            type: 'attributes',
            addedNodes: [],
        },
        {
            target: document.querySelector('div'),
            type: 'childList',
            addedNodes: [ document.querySelector('h1') ],
        }
    ])

    await wait(() => { expect(initCount).toEqual(2) })
})
