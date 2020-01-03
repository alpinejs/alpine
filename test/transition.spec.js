import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('transition in', async () => {
    // Hijack "requestAnimationFrame" for finer-tuned control in this test.
    var frameStack = []

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        frameStack.push(callback)
    });

    // Hijack "getComputeStyle" because js-dom is weird with it.
    // (hardcoding 10ms transition time for later assertions)
    jest.spyOn(window, 'getComputedStyle').mockImplementation(el => {
        return { transitionDuration: '.01s' }
    });

    document.body.innerHTML = `
        <div x-data="{ show: false }">
            <button x-on:click="show = ! show"></button>

            <span
                x-show="show"
                x-transition:enter="enter"
                x-transition:enter-start="enter-start"
                x-transition:enter-end="enter-end"
            ></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;') })

    document.querySelector('button').click()

    // Wait out the intial Alpine refresh debounce.
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 5)
    )

    expect(document.querySelector('span').classList.contains('enter')).toEqual(true)
    expect(document.querySelector('span').classList.contains('enter-start')).toEqual(true)
    expect(document.querySelector('span').classList.contains('enter-end')).toEqual(false)
    expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')

    frameStack.pop()()

    expect(document.querySelector('span').classList.contains('enter')).toEqual(true)
    expect(document.querySelector('span').classList.contains('enter-start')).toEqual(true)
    expect(document.querySelector('span').classList.contains('enter-end')).toEqual(false)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    frameStack.pop()()

    expect(document.querySelector('span').classList.contains('enter')).toEqual(true)
    expect(document.querySelector('span').classList.contains('enter-start')).toEqual(false)
    expect(document.querySelector('span').classList.contains('enter-end')).toEqual(true)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    await new Promise((resolve) =>
        setTimeout(() => {
            expect(document.querySelector('span').classList.contains('enter')).toEqual(false)
            expect(document.querySelector('span').classList.contains('enter-start')).toEqual(false)
            expect(document.querySelector('span').classList.contains('enter-end')).toEqual(false)
            expect(document.querySelector('span').getAttribute('style')).toEqual(null)
            resolve();
        }, 10)
    )
})

test('transition out', async () => {
    // Hijack "requestAnimationFrame" for finer-tuned control in this test.
    var frameStack = []

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        frameStack.push(callback)
    });

    // Hijack "getComputeStyle" because js-dom is weird with it.
    // (hardcoding 10ms transition time for later assertions)
    jest.spyOn(window, 'getComputedStyle').mockImplementation(el => {
        return { transitionDuration: '.01s' }
    });

    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <button x-on:click="show = ! show"></button>

            <span
                x-show="show"
                x-transition:leave="leave"
                x-transition:leave-start="leave-start"
                x-transition:leave-end="leave-end"
            ></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual(null) })

    document.querySelector('button').click()

    // Wait out the intial Alpine refresh debounce.
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 5)
    )

    expect(document.querySelector('span').classList.contains('leave')).toEqual(true)
    expect(document.querySelector('span').classList.contains('leave-start')).toEqual(true)
    expect(document.querySelector('span').classList.contains('leave-end')).toEqual(false)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    frameStack.pop()()

    expect(document.querySelector('span').classList.contains('leave')).toEqual(true)
    expect(document.querySelector('span').classList.contains('leave-start')).toEqual(true)
    expect(document.querySelector('span').classList.contains('leave-end')).toEqual(false)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    frameStack.pop()()

    expect(document.querySelector('span').classList.contains('leave')).toEqual(true)
    expect(document.querySelector('span').classList.contains('leave-start')).toEqual(false)
    expect(document.querySelector('span').classList.contains('leave-end')).toEqual(true)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    await new Promise((resolve) =>
        setTimeout(() => {
            expect(document.querySelector('span').classList.contains('leave')).toEqual(false)
            expect(document.querySelector('span').classList.contains('leave-start')).toEqual(false)
            expect(document.querySelector('span').classList.contains('leave-end')).toEqual(false)
            expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')
            resolve();
        }, 10)
    )
})
