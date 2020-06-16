import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('can bind an object of directives', async () => {
    window.modal = () => {
        return {
            show: false,
            trigger: {
                ['x-on:click']() { this.show = ! this.show }
            },
            dialogue: {
                ['x-show']() { return this.show }
            },
        }
    }

    document.body.innerHTML = `
        <div x-data="window.modal()">
            <button x-spread="trigger">Toggle</button>

            <span x-spread="dialogue">Modal Body</span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual(null) })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;') })
})


test('x-spread supports x-for', async () => {
    window.todos = () => {
        return {
            todos: ['one', 'two', 'three'],
            outputForExpression: {
                ['x-for']() { return 'todo in todos' }
            },
        }
    }

    document.body.innerHTML = `
        <div x-data="window.todos()">
            <ul>
                <template x-spread="outputForExpression">
                    <li x-text="todo"></li>
                </template>
            </ul>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('li')[0].innerText).toEqual('one')
    expect(document.querySelectorAll('li')[1].innerText).toEqual('two')
    expect(document.querySelectorAll('li')[2].innerText).toEqual('three')
})

test('x-spread syntax supports x-transition', async () => {
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

    window.transitions = () => {
        return {
            show: false,
            outputClickExpression: {
                ['x-on:click']() { this.show = ! this.show },
            },
            outputTransitionExpression: {
                ['x-show']() { return this.show },
                ['x-transition:enter']() { return 'enter' },
                ['x-transition:enter-start']() { return 'enter-start' },
                ['x-transition:enter-end']() { return 'enter-end' },
            },
        }
    }

    document.body.innerHTML = `
        <div x-data="transitions()">
            <button x-spread="outputClickExpression"></button>

            <span x-spread="outputTransitionExpression"></span>
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
