import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('Proxy does not error in strict mode when reactivity is suspended', async () => {
    "use strict"

    global.statCounter = function () {
        return {
            count: 0,
            init() {
                this.count = 1200;
            }
        }
    }
    document.body.innerHTML = `
        <div class="my-48">
            <div x-data="statCounter()" x-init="init()">
                <span x-text="count"></span>
            </div>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1200') })
})
