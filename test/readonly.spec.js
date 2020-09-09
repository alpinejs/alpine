import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('read-only properties do not break the proxy', async () => {
    document.body.innerHTML = `
        <div x-data="{ files: [] }">
            <input type="file"
                multiple
                x-ref="files"
                x-on:change="files = [...$refs.files.files].filter(Boolean)">
            <span x-text="files.length"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('0')

    const input = document.querySelector('input')
    Object.defineProperty(input, 'files', {
        get: () => [new File(["foo"], "foo.txt", {type: "text/plain"})]
    })

    input.dispatchEvent(new Event('change'));

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1') })
})
