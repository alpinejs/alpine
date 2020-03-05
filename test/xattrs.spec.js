import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-attributes are matched exactly', async () => {
    document.body.innerHTML = `
        <div x-data="{ showElement: false }">
            <div id="el1" x-show="showElement" />
            <div id="el2" xxx-show="showElement" />
            <div id="el3" x-showabc="showElement" />
        </div>
    `

    Alpine.start()

    expect(document.getElementById('el1').style.display).toEqual('none')
    expect(document.getElementById('el2').style.display).not.toEqual('none')
    await wait(() => { expect(document.getElementById('el3').style.display).not.toEqual('none') })
})
