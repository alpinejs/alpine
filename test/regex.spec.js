import Alpine from 'alpinejs'
import { fireEvent, wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('regex test without change pattern', async () => {
    document.body.innerHTML = `
        <div x-data="test()">
            <span x-show="testRegex()"></span>

            <button x-on:click="regex = /[0-9]+/"></button>
        </div>
    `
        test = function(){
            return {
                regex: /[a-z]+/,
                testRegex(){
                    return this.regex.test('justCharHere')
                }
            }
        }
    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual(null)
})

test('change pattern regex testing', async () => {
    document.body.innerHTML = `
        <div x-data="test()">
            <span x-show="testRegex()"></span>

            <button x-on:click="regex = /[0-9]+/"></button>
        </div>
    `
        test = function(){
            return {
                regex: /[a-z]+/,
                testRegex(){
                    return this.regex.test('justCharHere')
                }
            }
        }
    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;') })
})