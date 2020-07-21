import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-show toggles display: none; with no other style attributes', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <span x-show="show"></span>

            <button x-on:click="show = false"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;') })
})

test('x-show toggles display: none; with other style attributes', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <span x-show="show" style="color: blue;"></span>

            <button x-on:click="show = false"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual('color: blue;')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('color: blue; display: none;') })
})

test('x-show waits for transitions within it to finish before hiding an elements', async () => {
    document.body.innerHTML = `
        <style>
            .transition { transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform; }
            .duration-75 {
                transition-duration: 75ms;
            }
        </style>
        <div x-data="{ show: true }">
            <span x-show="show">
                <h1 x-show="show" x-transition:leave="transition duration-75"></h1>
            </span>

            <button x-on:click="show = false"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    document.querySelector('button').click()

    await new Promise((resolve) => setTimeout(() => { resolve(); }, 50))

    await wait(() => {
        expect(document.querySelector('span').getAttribute('style')).toEqual(null)
        expect(document.querySelector('h1').getAttribute('style')).toEqual(null)
    })
})

test('x-show does NOT wait for transitions to finish if .immediate is present', async () => {
    document.body.innerHTML = `
        <style>
            .transition { transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform; }
            .duration-75 {
                transition-duration: 75ms;
            }
        </style>
        <div x-data="{ show: true }">
            <span x-show.immediate="show">
                <h1 x-show="show" x-transition:leave="transition duration-75"></h1>
            </span>

            <button x-on:click="show = false"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    document.querySelector('button').click()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')
    expect(document.querySelector('h1').getAttribute('style')).toEqual(null)
})

test('x-show works with nested x-shows of different functions (hiding vs showing)', async () => {
    document.body.innerHTML = `
        <div x-data="{ show1: true, show2: true }">
            <span x-show="show1">
                <h1 x-show="show2"></h1>
            </span>

            <button x-on:click="show1 = false"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual(null)
    expect(document.querySelector('h1').getAttribute('style')).toEqual(null)

    document.querySelector('button').click()

    await new Promise((resolve) => setTimeout(() => { resolve(); }, 50))

    await wait(() => {
        expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')
        expect(document.querySelector('h1').getAttribute('style')).toEqual(null)
    })
})

// Regression in 2.4.0
test('x-show with x-bind:style inside x-for works correctly', async () => {
    document.body.innerHTML = `
        <div x-data="{items: [{ cleared: false }, { cleared: false }]}">
            <template x-for="(item, index) in items" :key="index">
                <button x-show="! item.cleared"
                    x-bind:style="'background: #999'"
                    @click="item.cleared = true"
                >
                </button>
            </template>
        </div>
    `
    Alpine.start()

    expect(document.querySelectorAll('button')[0].style.display).toEqual('')
    expect(document.querySelectorAll('button')[1].style.display).toEqual('')

    document.querySelectorAll('button')[0].click()

    await wait(() => {
        expect(document.querySelectorAll('button')[0].style.display).toEqual('none')
        expect(document.querySelectorAll('button')[1].style.display).toEqual('')
    })

    document.querySelectorAll('button')[1].click()

    await wait(() => {
        expect(document.querySelectorAll('button')[0].style.display).toEqual('none')
        expect(document.querySelectorAll('button')[1].style.display).toEqual('none')
    })
})

test('x-show takes precedence over style bindings for display property', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: false }">
            <span x-show="show" :style="'color: red;'"></span>
            <span :style="'color: red;'" x-show="show"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span')[0].getAttribute('style')).toContain('display: none;')
    expect(document.querySelectorAll('span')[1].getAttribute('style')).toContain('display: none;')
})
