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

    expect(document.querySelectorAll('li')[0].textContent).toEqual('one')
    expect(document.querySelectorAll('li')[1].textContent).toEqual('two')
    expect(document.querySelectorAll('li')[2].textContent).toEqual('three')
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
                ['x-transition:leave']() { return 'leave' },
                ['x-transition:leave-start']() { return 'leave-start' },
                ['x-transition:leave-end']() { return 'leave-end' },
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


test('x-spread event handlers defined as functions receive the event object as their first argument', async () => {
    window.data = function () {
        return {
            eventType: null,
            button: {
                ['@click']($event){
                    this.eventType = $event.type;
                }
            }
        };
    };

    document.body.innerHTML = `
        <div x-data="window.data()">
            <button x-spread="button">click me<button>
        </div>
    `;

    Alpine.start();

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelector("div").__x.$data.eventType).toEqual("click");
    });
});

test('x-spread undefined values can fail gracefully', async () => {
    window.data = function () {
        return {
            foo: {
                ['x-text'](){
                    return this.somethingUndefined;
                }
            }
        };
    };

    document.body.innerHTML = `
        <div x-data="window.data()">
            <button x-text="somethingUndefined">should be empty string</button>
            <span x-spread="foo">should be empty string<span>
        </div>
    `;

    Alpine.start();

    await wait(() => {
        expect(document.querySelector("button").textContent).toEqual('')
        expect(document.querySelector("span").textContent).toEqual('')
    })
});
