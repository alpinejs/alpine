import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$el', async () => {
    document.body.innerHTML = `
        <div x-data>
            <button @click="$el.innerHTML = 'foo'"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('div').innerHTML).not.toEqual('foo')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('div').innerHTML).toEqual('foo') })
})
