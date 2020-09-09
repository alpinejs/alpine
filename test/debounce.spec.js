import Alpine from 'alpinejs'
import { fireEvent } from '@testing-library/dom'
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

global.MutationObserver = class {
    observe() {}
}

test('x-on with debounce modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:input.debounce="foo++" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 1 }})

    await timeout(10)

    fireEvent.input(document.querySelector('input'), { target: { value: 1 } })
    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(10)

    fireEvent.input(document.querySelector('input'), { target: { value: 1 } })
    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(249)

    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(20)

    expect(document.querySelector('span').textContent).toEqual('1')
})

test('x-on with debounce modifier and specified wait', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:input.debounce.100="foo++" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 1 }})

    await timeout(10)

    fireEvent.input(document.querySelector('input'), { target: { value: 1 } })
    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(10)

    fireEvent.input(document.querySelector('input'), { target: { value: 1 } })
    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(99)

    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(20)

    expect(document.querySelector('span').textContent).toEqual('1')
})

test('x-model with debounce modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{ search: '' }">
          <input x-model.debounce="search" />
          <span x-text="search"></span>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'foo' } })

    await timeout(10)

    fireEvent.input(document.querySelector('input'), { target: { value: 'foo' } })
    expect(document.querySelector('span').textContent).toEqual('')

    await timeout(10)

    fireEvent.input(document.querySelector('input'), { target: { value: 'foo' } })
    expect(document.querySelector('span').textContent).toEqual('')

    await timeout(249)

    expect(document.querySelector('span').textContent).toEqual('')

    await timeout(20)

    expect(document.querySelector('span').textContent).toEqual('foo')
})

test('x-on with debounce modifier (with "ms" suffix)', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:input.debounce.100ms="foo++" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 1 } })

    await timeout(10)

    fireEvent.input(document.querySelector('input'), { target: { value: 1 } })
    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(10)

    fireEvent.input(document.querySelector('input'), { target: { value: 1 } })
    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(99)

    expect(document.querySelector('span').textContent).toEqual('0')

    await timeout(20)

    expect(document.querySelector('span').textContent).toEqual('1')
})

test('keydown with key modifier and debounce with 10ms wait', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:keydown.a.debounce.10ms="foo++" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.keyDown(document.querySelector('input'), { key: 'b' })

    await timeout(10)

    expect(document.querySelector('span').textContent).toEqual('0')

    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })
    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })

    await timeout(20)

    expect(document.querySelector('span').textContent).toEqual('1')
})

test('keydown with debounce modifier and no specified wait', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 0}">
          <input x-on:keydown.a.debounce="foo++" />
          <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('0')

    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })
    fireEvent.keyDown(document.querySelector('input'), { key: 'a' })

    await timeout(270)

    expect(document.querySelector('span').textContent).toEqual('1')
})
