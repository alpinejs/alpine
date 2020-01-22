import Alpine from 'alpinejs'

test('catch disconnected nodes that were used as targets in for any mutations', async () => {
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

    runObservers[0]([
        {
            target: document.createElement('div'),
            type: 'childList',
            addedNodes: [ document.createElement('div') ],
        }
    ])
})
