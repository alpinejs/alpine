import Alpine from 'alpinejs'

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
