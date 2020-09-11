import Alpine from 'alpinejs'
import { wait, fireEvent } from '@testing-library/dom'
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

global.MutationObserver = class {
    observe() {}
}

test('data modified in event listener updates affected attribute bindings', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>

            <span x-bind:foo="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test('nested data modified in event listener updates affected attribute bindings', async () => {
    document.body.innerHTML = `
        <div x-data="{ nested: { foo: 'bar' } }">
            <button x-on:click="nested.foo = 'baz'"></button>

            <span x-bind:foo="nested.foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test('.passive modifier should disable e.preventDefault()', async () => {
    document.body.innerHTML = `
        <div x-data="{ defaultPrevented: null }">
            <button
                x-on:mousedown.passive="
                    $event.preventDefault();
                    defaultPrevented = $event.defaultPrevented;
                "
            >
                <span></span>
            </button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('div').__x.$data.defaultPrevented).toEqual(null)

    fireEvent.mouseDown(document.querySelector('button'))

    await wait(() => {
        expect(document.querySelector('div').__x.$data.defaultPrevented).toEqual(false)
    })
})

test('.stop modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'">
                <span></span>
            </button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('div').__x.$data.foo).toEqual('bar')

    document.querySelector('span').click()

    await wait(() => {
        expect(document.querySelector('div').__x.$data.foo).toEqual('baz')
    })
})

test('.self modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <div x-on:click.self="foo = 'baz'" id="selfTarget">
                <button></button>
            </div>
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').textContent).toEqual('bar')
    })

    document.querySelector('#selfTarget').click()

    await wait(() => {
        expect(document.querySelector('span').textContent).toEqual('baz')
    })
})

test('.prevent modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <input type="checkbox" x-on:click.prevent>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').checked).toEqual(false)

    document.querySelector('input').click()

    expect(document.querySelector('input').checked).toEqual(false)
})

test('.window modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <div x-on:click.window="foo = 'baz'"></div>

            <span x-bind:foo="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.body.click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test('unbind global event handler when element is removed', async () => {
    document._callCount = 0

    document.body.innerHTML = `
        <div x-data="{}">
            <div x-on:click.window="document._callCount += 1"></div>
        </div>
    `

    Alpine.start()

    document.body.click()

    document.body.innerHTML = ''

    document.body.click()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document._callCount).toEqual(1)
})

test('.document modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <div x-on:click.document="foo = 'baz'"></div>

            <span x-bind:foo="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.body.click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test('.once modifier', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <button x-on:click.once="count = count+1"></button>

            <span x-bind:foo="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('0')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('1') })

    document.querySelector('button').click()

    await timeout(25)

    expect(document.querySelector('span').getAttribute('foo')).toEqual('1')
})

test('.once modifier does not remove listener if false is returned', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <button x-on:click.once="return ++count === 2"></button>

            <span x-bind:foo="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('0')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('1') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('2') })

    await timeout(25)

    expect(document.querySelector('span').getAttribute('foo')).toEqual('2')
})

test('keydown modifiers', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <input type="text" x-on:keydown="count++" x-on:keydown.enter="count++" x-on:keydown.space="count++">

            <span x-text="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('0')

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter' })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('2') })

    fireEvent.keyDown(document.querySelector('input'), { key: ' ' })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('4') })

    fireEvent.keyDown(document.querySelector('input'), { key: 'Spacebar' })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('6') })

    fireEvent.keyDown(document.querySelector('input'), { key: 'Escape' })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('7') })
})

test('keydown combo modifiers', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <input type="text" x-on:keydown.cmd.enter="count++">

            <span x-text="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('0')

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter' })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('0') })

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter', metaKey: true })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1') })
})

test('keydown with specified key and stop modifier only stops for specified key', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <article x-on:keydown="count++">
                <input type="text" x-on:keydown.enter.stop>
            </article>

            <span x-text="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('0')

    fireEvent.keyDown(document.querySelector('input'), { key: 'Escape' })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1') })

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter' })

    await timeout(25)
    expect(document.querySelector('span').textContent).toEqual('1')
})

test('click away', async () => {
    // Because jsDom doesn't support .offsetHeight and offsetWidth, we have to
    // make our own implementation using a specific class added to the class. Ugh.
    Object.defineProperties(window.HTMLElement.prototype, {
        offsetHeight: {
            get: function () { return this.classList.contains('hidden') ? 0 : 1 }
        },
        offsetWidth: {
            get: function () { return this.classList.contains('hidden') ? 0 : 1 }
        }
    });

    document.body.innerHTML = `
        <div id="outer">
            <div x-data="{ isOpen: true }">
                <button x-on:click="isOpen = true"></button>

                <ul x-bind:class="{ 'hidden': ! isOpen }" x-on:click.away="isOpen = false">
                    <li>...</li>
                </ul>
            </div>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false)

    document.querySelector('li').click()

    await wait(() => { expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false) })

    document.querySelector('ul').click()

    await wait(() => { expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false) })

    document.querySelector('#outer').click()

    await wait(() => { expect(document.querySelector('ul').classList.contains('hidden')).toEqual(true) })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('ul').classList.contains('hidden')).toEqual(false) })
})

test('.passive + .away modifier still disables e.preventDefault()', async () => {
    // Pretend like all the elements are visible
    Object.defineProperties(window.HTMLElement.prototype, {
        offsetHeight: {
            get: () => 1
        },
        offsetWidth: {
            get: () => 1
        }
    });
    document.body.innerHTML = `
        <div x-data="{ defaultPrevented: null }">
            <button
                x-on:mousedown.away.passive="
                    $event.preventDefault();
                    defaultPrevented = $event.defaultPrevented;
                "
            ></button>
            <span></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('div').__x.$data.defaultPrevented).toEqual(null)

    fireEvent.mouseDown(document.querySelector('span'))

    await wait(() => {
        expect(document.querySelector('div').__x.$data.defaultPrevented).toEqual(false)
    })
})

test('supports short syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'"></button>
            <span x-bind:foo="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test('event with colon', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <div x-on:my:event.document="foo = 'baz'"></div>

            <span x-bind:foo="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    var event = new CustomEvent('my:event');

    document.dispatchEvent(event);

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test.skip('prevent default action when an event returns false', async () => {
    // This test is skipped because in a browser this works, but it won't
    // pass in this tests unless we bypass the promise resolving system
    // for the result of an event handler expression.
    window.confirm = jest.fn().mockReturnValue(false)

    document.body.innerHTML = `
        <div x-data="{}">
            <input type="checkbox" x-on:click="return confirm('are you sure?')">
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').checked).toEqual(false)

    document.querySelector('input').click()

    expect(document.querySelector('input').checked).toEqual(false)

    window.confirm = jest.fn().mockReturnValue(true)

    document.querySelector('input').click()

    expect(document.querySelector('input').checked).toEqual(true)
})

test('allow method reference to be passed to listeners', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar', changeFoo() { this.foo = 'baz' } }">
            <button x-on:click="changeFoo"></button>
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelector('button').click()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document.querySelector('span').textContent).toEqual('baz')
})

test('event instance is passed to method reference', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar', changeFoo(e) { this.foo = e.target.id } }">
            <button x-on:click="changeFoo" id="baz"></button>
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelector('button').click()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document.querySelector('span').textContent).toEqual('baz')
})

test('autocomplete event does not trigger keydown with modifier callback', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <input type="text" x-on:keydown.?="count++">

            <span x-text="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('0')

    const autocompleteEvent = new Event('keydown')

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter' })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('0') })

    fireEvent.keyDown(document.querySelector('input'), { key: '?' })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1') })

    fireEvent(document.querySelector('input'), autocompleteEvent)

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('1') })
})

test('.camel modifier correctly binds event listener', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-on:event-name.camel.window="foo = 'bob'">
            <button x-on:click="$dispatch('eventName')"></button>
            <p x-text="foo"></p>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p').textContent).toEqual('bar')

    document.querySelector('button').click();

    await wait(() => {
        expect(document.querySelector('p').textContent).toEqual('bob');
    });
})

test('.camel modifier correctly binds event listener with namespace', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-on:ns:event-name.camel.window="foo = 'bob'">
            <button x-on:click="$dispatch('ns:eventName')"></button>
            <p x-text="foo"></p>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p').textContent).toEqual('bar')

    document.querySelector('button').click();

    await wait(() => {
        expect(document.querySelector('p').textContent).toEqual('bob');
    });
})
