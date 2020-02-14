import Alpine from 'alpinejs'
import { wait, fireEvent } from '@testing-library/dom'
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

global.MutationObserver = class {
    observe() {}
}

test('data modified in event listener updates effected attribute bindings', async () => {
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

test('nested data modified in event listener updates effected attribute bindings', async () => {
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

test('.once modifier doest remove listener if false is returned', async () => {
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

    expect(document.querySelector('span').innerText).toEqual(0)

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter' })

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(2) })

    fireEvent.keyDown(document.querySelector('input'), { key: ' ' })

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(4) })

    fireEvent.keyDown(document.querySelector('input'), { key: 'Spacebar' })

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(6) })

    fireEvent.keyDown(document.querySelector('input'), { key: 'Escape' })

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(7) })
})

test('keydown combo modifiers', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <input type="text" x-on:keydown.cmd.enter="count++">

            <span x-text="count"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual(0)

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter' })

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(0) })

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter', metaKey: true })

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(1) })
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

    expect(document.querySelector('span').innerText).toEqual(0)

    fireEvent.keyDown(document.querySelector('input'), { key: 'Escape' })

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(1) })

    fireEvent.keyDown(document.querySelector('input'), { key: 'Enter' })

    await timeout(25)
    expect(document.querySelector('span').innerText).toEqual(1)
})

test('click away', async () => {
    // Because jsDom doesn't support .offsetHeight and offsetWidth, we have to
    // make our own implementation using a specific class added to the class. Ugh.
    Object.defineProperties(window.HTMLElement.prototype, {
        offsetHeight: {
          get: function() { return this.classList.contains('hidden') ? 0 : 1 }
        },
        offsetWidth: {
          get: function() { return this.classList.contains('hidden') ? 0 : 1 }
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

test('single event registered with bracket notation', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:[click]="foo = 'baz'"></button>

            <span x-bind:foo="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('foo')).toEqual('baz') })
})

test('multiple events registered with bracket notation', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: true }">
            <button x-on:[click,touchend]="foo = !foo"></button>

            <span x-bind:foo="foo ? 'bar' : 'baz'"></span>
        </div>
    `

    const span = document.querySelector('span')
    const button = document.querySelector('button')
    Alpine.start()

    expect(span.getAttribute('foo')).toEqual('bar')

    button.click()
    await wait(() => { expect(span.getAttribute('foo')).toEqual('baz') })

    var event = new Event('touchend');
    button.dispatchEvent(event);
    await wait(() => { expect(span.getAttribute('foo')).toEqual('bar') })
})

test('prevent default action when an event returns false', async () => {
    window.confirm = jest.fn().mockImplementation(() => false)

    document.body.innerHTML = `
        <div x-data="{}">
            <input type="checkbox" x-on:click="return confirm('are you sure?')">
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').checked).toEqual(false)

    document.querySelector('input').click()

    expect(document.querySelector('input').checked).toEqual(false)

    window.confirm = jest.fn().mockImplementation(() => true)

    document.querySelector('input').click()

    expect(document.querySelector('input').checked).toEqual(true)
})
