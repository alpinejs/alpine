import projectX from 'project-x'
import { fireEvent, wait } from 'dom-testing-library'

global.MutationObserver = class {
    observe() {}
}

test('auto-detect new components and dont loose state of existing ones', async () => {
    var runObserver

    global.MutationObserver = class {
        constructor(callback) { runObserver = callback }
        observe() {}
    }

    document.body.innerHTML = `
        <div id="A" x-data="{ foo: '' }">
            <input x-model="foo">
            <span x-text="foo"></span>
        </div>
    `

    projectX.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' }})

    await wait(() => { expect(document.querySelector('#A span').innerText).toEqual('bar') })

    const div = document.createElement('div')
    div.setAttribute('id', 'B')
    div.setAttribute('x-data', '{ foo: "baz" }')
    div.innerHTML = `
        <input x-model="foo">
        <span x-text="foo"></span>
    `
    document.body.appendChild(div)

    runObserver([
        { addedNodes: [ div ] }
    ])

    await wait(() => {
        expect(document.querySelector('#A span').innerText).toEqual('bar')
        expect(document.querySelector('#B span').innerText).toEqual('baz')
    })
})
