import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

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

    await timeout(10)

    expect(document.querySelector('span').classList.contains('leave')).toEqual(false)
    expect(document.querySelector('span').classList.contains('leave-start')).toEqual(false)
    expect(document.querySelector('span').classList.contains('leave-end')).toEqual(false)
    expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')
})

test('if only transition leave directives are present, don\'t transition in at all', async () => {
    var frameStack = []

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        frameStack.push(callback)
    });

    document.body.innerHTML = `
        <div x-data="{ show: false }">
            <button x-on:click="show = ! show"></button>

            <span x-show="show"
                x-transition:leave="leave"
                x-transition:leave-start="leave-start"
                x-transition:leave-end="leave-end"
            ></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;') })

    document.querySelector('button').click()

    await timeout(10)

    expect(frameStack.length).toEqual(0)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)
})

test('if only transition enter directives are present, don\'t transition out at all', async () => {
    var frameStack = []

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        frameStack.push(callback)
    });

    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <button x-on:click="show = ! show"></button>

            <span x-show="show"
                x-transition:enter="enter"
                x-transition:enter-start="enter-start"
                x-transition:enter-end="enter-end"
            ></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual(null) })

    document.querySelector('button').click()

    await timeout(10)

    expect(frameStack.length).toEqual(0)
    expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')
})

test('original class attribute classes are preserved after transition finishes', async () => {
    var frameStack = []

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        frameStack.push(callback)
    });

    jest.spyOn(window, 'getComputedStyle').mockImplementation(el => {
        return { transitionDuration: '.01s' }
    });

    document.body.innerHTML = `
        <div x-data="{ show: false }">
            <button x-on:click="show = ! show"></button>

            <span
                x-show="show"
                class="enter"
                x-transition:enter="enter"
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
    expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')

    frameStack.pop()()

    expect(document.querySelector('span').classList.contains('enter')).toEqual(true)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    frameStack.pop()()

    expect(document.querySelector('span').classList.contains('enter')).toEqual(true)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    await new Promise((resolve) =>
        setTimeout(() => {
            expect(document.querySelector('span').classList.contains('enter')).toEqual(true)
            expect(document.querySelector('span').getAttribute('style')).toEqual(null)
            resolve();
        }, 10)
    )
})

test('transition in not called when item is already visible', async () => {
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
        <div x-data="{ show: true, foo: 'bar' }">
            <button x-on:click="foo = 'bob'"></button>

            <span
                x-show="show"
                x-transition:enter="enter"
                x-transition:enter-start="enter-start"
                x-transition:enter-end="enter-end"
            ></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    document.querySelector('button').click()

    // Wait out the intial Alpine refresh debounce.
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 5)
    )

    // No animation queued
    expect(frameStack.pop()).toEqual(undefined)

    expect(document.querySelector('span').classList.contains('enter')).toEqual(false)
    expect(document.querySelector('span').classList.contains('enter-start')).toEqual(false)
    expect(document.querySelector('span').classList.contains('enter-end')).toEqual(false)
    expect(document.querySelector('span').getAttribute('style')).toEqual(null)
})

test('transition out not called when item is already hidden', async () => {
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
        <div x-data="{ show: false, foo: 'bar' }">
            <button x-on:click="foo = 'bob'"></button>

            <span
                x-show="show"
                x-transition:leave="leave"
                x-transition:leave-start="leave-start"
                x-transition:leave-end="leave-end"
            ></span>
        </div>
    `

    Alpine.start()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')

    document.querySelector('button').click()

    // Wait out the intial Alpine refresh debounce.
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 5)
    )

    // No animation queued
    expect(frameStack.pop()).toEqual(undefined)

    expect(document.querySelector('span').classList.contains('leave')).toEqual(false)
    expect(document.querySelector('span').classList.contains('leave-start')).toEqual(false)
    expect(document.querySelector('span').classList.contains('leave-end')).toEqual(false)
    expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')
})

test('transition with x-show.transition helper', async () => {
    await assertTransitionHelperStyleAttributeValues('x-show.transition.in', [
        'display: none; opacity: 0; transform: scale(0.95); transform-origin: center; transition-property: opacity transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 0; transform: scale(0.95); transform-origin: center; transition-property: opacity transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 1; transform: scale(1); transform-origin: center; transition-property: opacity transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'display: none;',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition.out', [
        null,
        null,
        'opacity: 1; transform: scale(1); transform-origin: center; transition-property: opacity transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 1; transform: scale(1); transform-origin: center; transition-property: opacity transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 0; transform: scale(0.95); transform-origin: center; transition-property: opacity transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition', [
        'display: none; opacity: 0; transform: scale(0.95); transform-origin: center; transition-property: opacity transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 0; transform: scale(0.95); transform-origin: center; transition-property: opacity transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 1; transform: scale(1); transform-origin: center; transition-property: opacity transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'opacity: 1; transform: scale(1); transform-origin: center; transition-property: opacity transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 1; transform: scale(1); transform-origin: center; transition-property: opacity transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 0; transform: scale(0.95); transform-origin: center; transition-property: opacity transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition.opacity', [
        'display: none; opacity: 0; transition-property: opacity; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 0; transition-property: opacity; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 1; transition-property: opacity; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'opacity: 1; transition-property: opacity; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 1; transition-property: opacity; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'opacity: 0; transition-property: opacity; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition.scale', [
        'display: none; transform: scale(0.95); transform-origin: center; transition-property: transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.95); transform-origin: center; transition-property: transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.95); transform-origin: center; transition-property: transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition.scale.85', [
        'display: none; transform: scale(0.85); transform-origin: center; transition-property: transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: center; transition-property: transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.15s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: center; transition-property: transform; transition-duration: 0.075s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition.scale.85.duration.200ms', [
        'display: none; transform: scale(0.85); transform-origin: center; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: center; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: center; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: center; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition.scale.85.duration.200ms.origin.top', [
        'display: none; transform: scale(0.85); transform-origin: top; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: top; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: top; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'transform: scale(1); transform-origin: top; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: top; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: top; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition.scale.85.duration.200ms.origin.top.left', [
        'display: none; transform: scale(0.85); transform-origin: top left; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: top left; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: top left; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'transform: scale(1); transform-origin: top left; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: top left; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: top left; transition-property: transform; transition-duration: 0.1s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])

    await assertTransitionHelperStyleAttributeValues('x-show.transition.in.scale.85.duration.200ms.origin.top.left.out.scale.75.duration.500ms.origin.bottom.right', [
        'display: none; transform: scale(0.85); transform-origin: top left; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.85); transform-origin: top left; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: top left; transition-property: transform; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        '',
        'transform: scale(1); transform-origin: bottom right; transition-property: transform; transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(1); transform-origin: bottom right; transition-property: transform; transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'transform: scale(0.75); transform-origin: bottom right; transition-property: transform; transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);',
        'display: none;',
    ])
})

async function assertTransitionHelperStyleAttributeValues(xShowDirective, styleAttributeExpectations) {
    // Hijack "requestAnimationFrame" for finer-tuned control in this test.
    var frameStack = []

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        frameStack.push(callback)
    });

    // Hijack "getComputeStyle" because js-dom is weird with it.
    // (hardcoding 10ms transition time for later assertions)
    jest.spyOn(window, 'getComputedStyle').mockImplementation(el => {
        return { transitionDuration: '.02s' }
    });

    document.body.innerHTML = `
        <div x-data="{ show: false }">
            <button x-on:click="show = ! show"></button>

            <span ${xShowDirective}="show"></span>
        </div>
    `

    Alpine.start()

    document.querySelector('button').click()

    // Wait out the intial Alpine refresh debounce.
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 5)
    )

    let index = 0

    expect(document.querySelector('span').getAttribute('style')).toEqual(styleAttributeExpectations[index])

    while(frameStack.length) {
        frameStack.pop()()
        expect(document.querySelector('span').getAttribute('style')).toEqual(styleAttributeExpectations[++index])
    }

    await new Promise(resolve => setTimeout(resolve, 30))

    expect(document.querySelector('span').getAttribute('style')).toEqual(styleAttributeExpectations[++index])

    document.querySelector('button').click()

    // Wait out the intial Alpine refresh debounce.
    await new Promise(resolve => setTimeout(resolve, 5))

    expect(document.querySelector('span').getAttribute('style')).toEqual(styleAttributeExpectations[++index])

    while(frameStack.length) {
        frameStack.pop()()
        expect(document.querySelector('span').getAttribute('style')).toEqual(styleAttributeExpectations[++index])
    }

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.querySelector('span').getAttribute('style')).toEqual(styleAttributeExpectations[++index])
}

test('x-transition supports css animation', async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        setTimeout(callback, 0)
    });

    // (hardcoding 10ms animation time for later assertions)
    jest.spyOn(window, 'getComputedStyle').mockImplementation(el => {
        return {
            transitionDuration: '0s',
            animationDuration: '.1s'
        }
    });

    document.body.innerHTML = `
        <div x-data="{ show: false }">
            <button x-on:click="show = ! show"></button>

            <span
                x-show="show"
                x-transition:enter="animation-enter"
                x-transition:leave="animation-leave"
            ></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;') })

    // Testing animation enter
    document.querySelector('button').click()

    // Wait for the first requestAnimationFrame
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 0)
    )
    expect(document.querySelector('span').classList.contains('animation-enter')).toEqual(true)

    // The class should still be there since the animationDuration property is 100ms
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 99)
    )
    expect(document.querySelector('span').classList.contains('animation-enter')).toEqual(true)

    // The class shouldn't be there anymore
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 10)
    )
    expect(document.querySelector('span').classList.contains('animation-enter')).toEqual(false)

    // Testing animation enter
    document.querySelector('button').click()

    // Wait for the first requestAnimationFrame
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 0)
    )
    expect(document.querySelector('span').classList.contains('animation-leave')).toEqual(true)

    // The class should still be there since the animationDuration property is 100ms
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 99)
    )
    expect(document.querySelector('span').classList.contains('animation-leave')).toEqual(true)

    // The class shouldn't be there anymore
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, 10)
    )
    expect(document.querySelector('span').classList.contains('animation-leave')).toEqual(false)
})

test('x-transition do not overlap', async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        setTimeout(callback, 0)
    });

    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <button x-on:click="show = ! show"></button>

            <span x-show.transition="show"></span>
        </div>
    `

    Alpine.start()

    // Initial state
    expect(document.querySelector('span').style.display).toEqual("")
    expect(document.querySelector('span').style.opacity).toEqual("")
    expect(document.querySelector('span').style.transform).toEqual("")
    expect(document.querySelector('span').style.transformOrigin).toEqual("")

    // Trigger transition out
    document.querySelector('button').click()

    // Trigger transition in before the previous one has finished
    await timeout(10)
    document.querySelector('button').click()

    // Check the element is still visible and style properties are correct
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("")
    expect(document.querySelector('span').style.opacity).toEqual("")
    expect(document.querySelector('span').style.transform).toEqual("")
    expect(document.querySelector('span').style.transformOrigin).toEqual("")

    // Hide the element
    document.querySelector('button').click()
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("none")
    expect(document.querySelector('span').style.opacity).toEqual("")
    expect(document.querySelector('span').style.transform).toEqual("")
    expect(document.querySelector('span').style.transformOrigin).toEqual("")

    // Trigger transition in
    document.querySelector('button').click()

    // Trigger transition out before the previous one has finished
    await timeout(10)
    document.querySelector('button').click()

    // Check the element is hidden and style properties are correct
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("none")
    expect(document.querySelector('span').style.opacity).toEqual("")
    expect(document.querySelector('span').style.transform).toEqual("")
    expect(document.querySelector('span').style.transformOrigin).toEqual("")
})

test('x-transition using classes do not overlap', async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        setTimeout(callback, 0)
    });
    jest.spyOn(window, 'getComputedStyle').mockImplementation(el => {
        return { transitionDuration: '.1s' }
    });

    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <button x-on:click="show = ! show"></button>

            <span x-show="show"
                x-transition:enter="enter"
                x-transition:leave="leave">
            </span>
        </div>
    `

    Alpine.start()

    // Initial state
    expect(document.querySelector('span').style.display).toEqual("")

    const emptyClassList = document.querySelector('span').classList

    // Trigger transition out
    document.querySelector('button').click()

    // Trigger transition in before the previous one has finished
    await timeout(10)
    document.querySelector('button').click()

    // Check the element is still visible and class property is correct
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("")
    expect(document.querySelector('span').classList).toEqual(emptyClassList)

    // Hide the element
    document.querySelector('button').click()
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("none")
    expect(document.querySelector('span').classList).toEqual(emptyClassList)

    // Trigger transition in
    document.querySelector('button').click()

    // Trigger transition out before the previous one has finished
    await timeout(10)
    document.querySelector('button').click()

    // Check the element is hidden and class property is correct
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("none")
    expect(document.querySelector('span').classList).toEqual(emptyClassList)
})

test('x-transition with parent x-show does not overlap', async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        setTimeout(callback, 0)
    });

    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <button x-on:click="show = ! show"></button>

            <h1 x-show="show">
                <span x-show.transition="show"></span>
            </h1>
        </div>
    `

    Alpine.start()

    // Initial state
    expect(document.querySelector('span').style.display).toEqual("")
    expect(document.querySelector('span').style.opacity).toEqual("")
    expect(document.querySelector('span').style.transform).toEqual("")
    expect(document.querySelector('span').style.transformOrigin).toEqual("")
    expect(document.querySelector('h1').style.display).toEqual("")
    expect(document.querySelector('h1').style.opacity).toEqual("")
    expect(document.querySelector('h1').style.transform).toEqual("")
    expect(document.querySelector('h1').style.transformOrigin).toEqual("")

    // Trigger transition out
    document.querySelector('button').click()

    // Trigger transition in before the previous one has finished
    await timeout(10)
    document.querySelector('button').click()

    // Check the element is still visible and style properties are correct
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("")
    expect(document.querySelector('span').style.opacity).toEqual("")
    expect(document.querySelector('span').style.transform).toEqual("")
    expect(document.querySelector('span').style.transformOrigin).toEqual("")
    expect(document.querySelector('h1').style.display).toEqual("")
    expect(document.querySelector('h1').style.opacity).toEqual("")
    expect(document.querySelector('h1').style.transform).toEqual("")
    expect(document.querySelector('h1').style.transformOrigin).toEqual("")

    // Hide the element
    document.querySelector('button').click()
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("none")
    expect(document.querySelector('span').style.opacity).toEqual("")
    expect(document.querySelector('span').style.transform).toEqual("")
    expect(document.querySelector('span').style.transformOrigin).toEqual("")
    expect(document.querySelector('h1').style.display).toEqual("none")
    expect(document.querySelector('h1').style.opacity).toEqual("")
    expect(document.querySelector('h1').style.transform).toEqual("")
    expect(document.querySelector('h1').style.transformOrigin).toEqual("")

    // Trigger transition in
    document.querySelector('button').click()

    // Trigger transition out before the previous one has finished
    await timeout(10)
    document.querySelector('button').click()

    // Check the element is hidden and style properties are correct
    await timeout(200)
    expect(document.querySelector('span').style.display).toEqual("none")
    expect(document.querySelector('span').style.opacity).toEqual("")
    expect(document.querySelector('span').style.transform).toEqual("")
    expect(document.querySelector('span').style.transformOrigin).toEqual("")
    expect(document.querySelector('h1').style.display).toEqual("none")
    expect(document.querySelector('h1').style.opacity).toEqual("")
    expect(document.querySelector('h1').style.transform).toEqual("")
    expect(document.querySelector('h1').style.transformOrigin).toEqual("")
})
