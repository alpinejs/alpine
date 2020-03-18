import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

const component = `
    <div x-data="{ foo: 'bar' }" id="component">
        <span x-text="foo"></span>
        <button @click="foo = 'baz'">Baz</button>
    </div>
`

test('alpine:loaded event fired on init', async () => {
    document.body.innerHTML = component

    const loadedCallback = jest.fn()

    document.addEventListener('alpine:loaded', loadedCallback)

    Alpine.start()

    await wait(() => {
        expect(loadedCallback).toBeCalled()
    })
})

test('alpine:mutated and alpine:${key}-mutated event fired on mutation', async () => {
    document.body.innerHTML = component

    const generalCallback = jest.fn()
    const keyCallback = jest.fn()

    document.querySelector('#component').addEventListener('alpine:mutated', generalCallback)
    document.querySelector('#component').addEventListener('alpine:foo-mutated', keyCallback)

    Alpine.start()

    document.querySelector('button').click()

    await wait(() => {
        expect(generalCallback).toBeCalled()
        expect(keyCallback).toBeCalled()

        expect(document.querySelector('span').innerText).toEqual('baz')
    })
})

test('alpine:updated event fired after component refresh', async () => {
    document.body.innerHTML = component

    const updatedCallback = jest.fn()

    document.querySelector('#component').addEventListener('alpine:updated', updatedCallback)

    Alpine.start()

    document.querySelector('button').click()

    await wait(() => expect(updatedCallback).toBeCalled())
})

const transitionComponent = `
    <div x-data="{ open: false }" id="component">
        <button @click="open = !open">Toggle Div</button>
        <div
            x-show="open"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform scale-90"
            x-transition:enter-end="opacity-100 transform scale-100"
            x-transition:leave="transition ease-in duration-300"
            x-transition:leave-start="opacity-100 transform scale-100"
            x-transition:leave-end="opacity-0 transform scale-90"
            id="transitioning-element"
        >Transitioned</div>
    </div>
`

test('alpine:transition-${stage} events fired on transitioning element', async () => {
    document.body.innerHTML = transitionComponent

    const startCallback = jest.fn()
    const endCallback = jest.fn()

    document.querySelector('#transitioning-element').addEventListener('alpine:transition-start', startCallback)
    document.querySelector('#transitioning-element').addEventListener('alpine:transition-end', endCallback)

    Alpine.start()

    document.querySelector('button').click()

    await wait(() => {
        expect(startCallback).toBeCalled()
        expect(endCallback).toBeCalled()
    })
})

test('alpine:transition-${stage} events fired and bubble up to parent component', async () => {
    document.body.innerHTML = transitionComponent

    const startCallback = jest.fn()
    const endCallback = jest.fn()

    document.querySelector('#component').addEventListener('alpine:transition-start', startCallback)
    document.querySelector('#component').addEventListener('alpine:transition-end', endCallback)

    Alpine.start()

    document.querySelector('button').click()

    await wait(() => {
        expect(startCallback).toBeCalled()
        expect(endCallback).toBeCalled()
    })
})
