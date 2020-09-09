import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

test('catch disconnected nodes that were used as targets for any mutations', async () => {
    const runObservers = []

    global.MutationObserver = class {
        constructor(callback) { runObservers.push(callback) }
        observe() {}
    }

    document.body.innerHTML = `
        <div x-data="{}">
        </div>
    `

    Alpine.start()

    runObservers.forEach(cb => cb([
        {
            target: document.createElement('div'),
            type: 'childList',
            addedNodes: [ document.createElement('div') ],
        }
    ]))
})

test('mutationObserver doesn\'t reset data when reparenting nested components', async () => {

    const runObservers = []

    global.MutationObserver = class {
        constructor(callback) {
            runObservers.push(callback)
        }
        observe() {}
    }

    document.body.innerHTML = `
        <div x-data>
            <div id="a">
                <button x-data="{counter: 1}" x-text="counter" @click="counter = 2"></button>
            </div>
            <div id="b">
            </div>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('button').textContent).toEqual('1')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('button').textContent).toEqual('2') })

    // Move the component and run the observer
    document.getElementById('b').appendChild(document.querySelector('button'))
    runObservers.forEach(cb => {
        cb([
            {
                target: document.getElementById('b'),
                type: 'childList',
                addedNodes: [ document.querySelector('button') ],
            }
        ])
    })

    await wait(() => { expect(document.querySelector('button').textContent).toEqual('2') })
})
