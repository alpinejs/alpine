import Alpine from 'alpinejs'
import { wait, fireEvent } from '@testing-library/dom'
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

global.MutationObserver = class {
    observe() {}
}

test('input with debounce modifier and 100ms wait', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:input.debounce.100ms="foo = foo+1" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 1 }})
    fireEvent.input(document.querySelector('input'), { target: { value: 1 }})

    // At this point, wait time has not passed, so counter is still zero
    await wait( () => { expect(document.querySelector('span').innerText).toEqual(0) })
    
    await timeout(100)

    fireEvent.input(document.querySelector('input'), { target: { value: 1 }})
    fireEvent.input(document.querySelector('input'), { target: { value: 1 }})
    
    await timeout(100)
    
    // At this point, wait time has passed twice, so counter is 2
    await wait( () => { expect(document.querySelector('span').innerText).toEqual(2) })
})

test('keyup with key modifier and debounce with 100ms wait', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:keydown.a.debounce.100ms="foo = foo+1" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.keyDown(document.querySelector('input'), { key: 'b' })

    await timeout(100)

    await wait( () => { expect(document.querySelector('span').innerText).toEqual(0) })

    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })
    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })

    await timeout(100)

    await wait( () => { expect(document.querySelector('span').innerText).toEqual(1) })
})

test('using key modifiers after debounce', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:keydown.debounce.a="foo = foo+1" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.keyDown(document.querySelector('input'), { key: 'b' })

    await timeout(250)

    await wait( () => { expect(document.querySelector('span').innerText).toEqual(0) })

    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })
    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })

    await timeout(250)

    await wait( () => { expect(document.querySelector('span').innerText).toEqual(1) })
})

test('using key modifiers after debounce.time(ms|s)', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:keydown.debounce.100ms.a="foo = foo+1" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.keyDown(document.querySelector('input'), { key: 'b' })

    await timeout(100)

    await wait( () => { expect(document.querySelector('span').innerText).toEqual(0) })

    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })
    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })

    await timeout(100)

    await wait( () => { expect(document.querySelector('span').innerText).toEqual(1) })
})
