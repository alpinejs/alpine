import Alpine from 'alpinejs'
import { fireEvent, wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('data manipulated on component object is reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    document.querySelector('div').__x.$data.foo = 'baz'

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('baz') })
})

test('x-data attribute value is optional', async () => {
    document.body.innerHTML = `
        <div x-data>
            <span x-text="'foo'"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('foo')
})
