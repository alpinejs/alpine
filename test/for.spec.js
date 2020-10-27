import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-for', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = ['foo', 'bar']"></button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)
    expect(document.querySelectorAll('span')[0].textContent).toEqual('foo')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(2) })

    expect(document.querySelectorAll('span')[0].textContent).toEqual('foo')
    expect(document.querySelectorAll('span')[1].textContent).toEqual('bar')
})

test('removes all elements when array is empty and previously had one item', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = []"></button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(0) })
})

test('removes all elements when array is empty and previously had multiple items', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar', 'world'] }">
            <button x-on:click="items = []"></button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(3)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(0) })
})

test('elements inside of loop are reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'], foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>

            <template x-for="item in items">
                <span>
                    <h1 x-text="item"></h1>
                    <h2 x-text="foo"></h2>
                </span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)
    expect(document.querySelector('h1').textContent).toEqual('first')
    expect(document.querySelector('h2').textContent).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('h1').textContent).toEqual('first')
        expect(document.querySelector('h2').textContent).toEqual('baz')
    })
})

test('components inside of loop are reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'] }">
            <template x-for="item in items">
                <div x-data="{foo: 'bar'}" class="child">
                    <span x-text="foo"></span>
                    <button x-on:click="foo = 'bob'"></button>
                </div>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('div.child').length).toEqual(1)
    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').textContent).toEqual('bob')
    })
})

test('components inside a plain element of loop are reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'] }">
            <template x-for="item in items">
                <ul>
                    <div x-data="{foo: 'bar'}" class="child">
                        <span x-text="foo"></span>
                        <button x-on:click="foo = 'bob'"></button>
                    </div>
                </ul>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('ul').length).toEqual(1)
    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').textContent).toEqual('bob')
    })
})

test('adding key attribute moves dom nodes properly', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'] }">
            <button x-on:click="items = ['bar', 'foo', 'baz']"></button>

            <template x-for="item in items" :key="item">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(2)
    const itemA = document.querySelectorAll('span')[0]
    itemA.setAttribute('order', 'first')
    const itemB = document.querySelectorAll('span')[1]
    itemB.setAttribute('order', 'second')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(3) })

    expect(document.querySelectorAll('span')[0].getAttribute('order')).toEqual('second')
    expect(document.querySelectorAll('span')[1].getAttribute('order')).toEqual('first')
    expect(document.querySelectorAll('span')[2].getAttribute('order')).toEqual(null)
})

test('can key by index', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'] }">
            <button x-on:click="items = ['bar', 'foo', 'baz']"></button>

            <template x-for="(item, index) in items" :key="index">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(2)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(3) })
})

test('can use index inside of loop', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <template x-for="(item, index) in items">
                <div>
                    <h1 x-text="items.indexOf(item)"></h1>
                    <h2 x-text="index"></h2>
                </div>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').textContent).toEqual('0')
    expect(document.querySelector('h2').textContent).toEqual('0')
})

test('can use third iterator param (collection) inside of loop', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <template x-for="(item, index, things) in items">
                <div>
                    <h1 x-text="items"></h1>
                    <h2 x-text="things"></h2>
                </div>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').textContent).toEqual('foo')
    expect(document.querySelector('h2').textContent).toEqual('foo')
})

test('can use x-if in conjunction with x-for', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'], show: false }">
            <button @click="show = ! show"></button>

            <template x-if="show" x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(0)

    document.querySelector('button').click()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document.querySelectorAll('span').length).toEqual(2)

    document.querySelector('button').click()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document.querySelectorAll('span').length).toEqual(0)
})

test('listeners in loop get fresh iteration data even though they are only registered initially', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'], output: '' }">
            <button x-on:click="items = ['bar']"></button>

            <template x-for="(item, index) in items">
                <span x-text="item" x-on:click="output = item"></span>
            </template>

            <h1 x-text="output"></h1>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)

    document.querySelector('span').click()

    await wait(() => { expect(document.querySelector('h1').textContent).toEqual('foo') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('bar') })

    document.querySelector('span').click()

    await wait(() => { expect(document.querySelector('h1').textContent).toEqual('bar') })
})

test('nested x-for', async () => {
    document.body.innerHTML = `
        <div x-data="{ foos: [ {bars: ['bob', 'lob']} ] }">
            <button x-on:click="foos = [ {bars: ['bob', 'lob']}, {bars: ['law']} ]"></button>
            <template x-for="foo in foos">
                <h1>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="bar"></h2>
                    </template>
                </h1>
            </template>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelectorAll('h1').length).toEqual(1) })
    await wait(() => { expect(document.querySelectorAll('h2').length).toEqual(2) })

    expect(document.querySelectorAll('h2')[0].textContent).toEqual('bob')
    expect(document.querySelectorAll('h2')[1].textContent).toEqual('lob')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('h2').length).toEqual(3) })

    expect(document.querySelectorAll('h2')[0].textContent).toEqual('bob')
    expect(document.querySelectorAll('h2')[1].textContent).toEqual('lob')
    expect(document.querySelectorAll('h2')[2].textContent).toEqual('law')
})

test('x-for updates the right elements when new item are inserted at the beginning of the list', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: [{name: 'one', key: '1'}, {name: 'two', key: '2'}] }">
            <button x-on:click="items = [{name: 'zero', key: '0'}, {name: 'one', key: '1'}, {name: 'two', key: '2'}]"></button>

            <template x-for="item in items" :key="item.key">
                <span x-text="item.name"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(2)
    const itemA = document.querySelectorAll('span')[0]
    itemA.setAttribute('order', 'first')
    const itemB = document.querySelectorAll('span')[1]
    itemB.setAttribute('order', 'second')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(3) })

    expect(document.querySelectorAll('span')[0].textContent).toEqual('zero')
    expect(document.querySelectorAll('span')[1].textContent).toEqual('one')
    expect(document.querySelectorAll('span')[2].textContent).toEqual('two')

    // Make sure states are preserved
    expect(document.querySelectorAll('span')[0].getAttribute('order')).toEqual(null)
    expect(document.querySelectorAll('span')[1].getAttribute('order')).toEqual('first')
    expect(document.querySelectorAll('span')[2].getAttribute('order')).toEqual('second')
})

test('nested x-for access outer loop variable', async () => {
    document.body.innerHTML = `
        <div x-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
            <template x-for="foo in foos">
                <h1>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="foo.name+': '+bar"></h2>
                    </template>
                </h1>
            </template>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelectorAll('h1').length).toEqual(2) })
    await wait(() => { expect(document.querySelectorAll('h2').length).toEqual(4) })

    expect(document.querySelectorAll('h2')[0].textContent).toEqual('foo: bob')
    expect(document.querySelectorAll('h2')[1].textContent).toEqual('foo: lob')
    expect(document.querySelectorAll('h2')[2].textContent).toEqual('baz: bab')
    expect(document.querySelectorAll('h2')[3].textContent).toEqual('baz: lab')
})

test('sibling x-for do not interact with each other', async () => {
    document.body.innerHTML = `
        <div x-data="{ foos: [1], bars: [1, 2] }">
            <template x-for="foo in foos">
                <h1 x-text="foo"></h1>
            </template>
            <template x-for="bar in bars">
                <h2 x-text="bar"></h2>
            </template>
            <button @click="foos = [1, 2];bars = [1, 2, 3]">Change</button>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelectorAll('h1').length).toEqual(1) })
    await wait(() => { expect(document.querySelectorAll('h2').length).toEqual(2) })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('h1').length).toEqual(2) })
    await wait(() => { expect(document.querySelectorAll('h2').length).toEqual(3) })
})

test('nested x-for event listeners', async () => {
    document._alerts = []

    document.body.innerHTML = `
        <div x-data="{ foos: [
            {name: 'foo', bars: [{name: 'bob', count: 0}, {name: 'lob', count: 0}]},
            {name: 'baz', bars: [{name: 'bab', count: 0}, {name: 'lab', count: 0}]}
        ], fnText: function(foo, bar) { return foo.name+': '+bar.name+' = '+bar.count; } }">
            <template x-for="foo in foos">
                <h1>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="fnText(foo, bar)"
                            x-on:click="bar.count += 1; document._alerts.push(fnText(foo, bar))"
                        ></h2>
                    </template>
                </h1>
            </template>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelectorAll('h1').length).toEqual(2) })
    await wait(() => { expect(document.querySelectorAll('h2').length).toEqual(4) })

    expect(document.querySelectorAll('h2')[0].textContent).toEqual('foo: bob = 0')
    expect(document.querySelectorAll('h2')[1].textContent).toEqual('foo: lob = 0')
    expect(document.querySelectorAll('h2')[2].textContent).toEqual('baz: bab = 0')
    expect(document.querySelectorAll('h2')[3].textContent).toEqual('baz: lab = 0')

    expect(document._alerts.length).toEqual(0)

    document.querySelectorAll('h2')[0].click()

    await wait(() => {
        expect(document.querySelectorAll('h2')[0].textContent).toEqual('foo: bob = 1')
        expect(document.querySelectorAll('h2')[1].textContent).toEqual('foo: lob = 0')
        expect(document.querySelectorAll('h2')[2].textContent).toEqual('baz: bab = 0')
        expect(document.querySelectorAll('h2')[3].textContent).toEqual('baz: lab = 0')

        expect(document._alerts.length).toEqual(1)
        expect(document._alerts[0]).toEqual('foo: bob = 1')
    })

    document.querySelectorAll('h2')[2].click()

    await wait(() => {
        expect(document.querySelectorAll('h2')[0].textContent).toEqual('foo: bob = 1')
        expect(document.querySelectorAll('h2')[1].textContent).toEqual('foo: lob = 0')
        expect(document.querySelectorAll('h2')[2].textContent).toEqual('baz: bab = 1')
        expect(document.querySelectorAll('h2')[3].textContent).toEqual('baz: lab = 0')

        expect(document._alerts.length).toEqual(2)
        expect(document._alerts[0]).toEqual('foo: bob = 1')
        expect(document._alerts[1]).toEqual('baz: bab = 1')
    })

    document.querySelectorAll('h2')[0].click()

    await wait(() => {
        expect(document.querySelectorAll('h2')[0].textContent).toEqual('foo: bob = 2')
        expect(document.querySelectorAll('h2')[1].textContent).toEqual('foo: lob = 0')
        expect(document.querySelectorAll('h2')[2].textContent).toEqual('baz: bab = 1')
        expect(document.querySelectorAll('h2')[3].textContent).toEqual('baz: lab = 0')

        expect(document._alerts.length).toEqual(3)
        expect(document._alerts[0]).toEqual('foo: bob = 1')
        expect(document._alerts[1]).toEqual('baz: bab = 1')
        expect(document._alerts[2]).toEqual('foo: bob = 2')
    })
})

test('make sure new elements with different keys added to the beginning of a loop are initialized instead of just updated', async () => {
    let clickCount = 0
    window.registerClick = () => {
        clickCount++
    }

    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button @click="items = ['bar']">Change</button>

            <template x-for="item in items" :key="item">
                <h1 @click="registerClick()"></h1>
            </template>
        </div>
    `

    Alpine.start()

    document.querySelector('h1').click()

    expect(clickCount).toEqual(1)

    document.querySelector('button').click()

    document.querySelector('h1').click()

    expect(clickCount).toEqual(2)
})

test('x-for over range using i in x syntax', async () => {
    document.body.innerHTML = `
        <div x-data>
            <template x-for="i in 10">
                <span x-text="i"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(10)
})

test('x-for over range using i in x syntax with data property', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 10 }">
            <template x-for="i in count">
                <span x-text="i"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(10)
})

test('x-for with an array of numbers', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: [] }">
            <template x-for="i in items">
                <span x-text="i"></span>
            </template>
            <button id="push-2" @click="items.push(2)"></button>
            <button id="push-3" @click="items.push(3)"></button>
        </div>
    `

    Alpine.start()

    document.querySelector('#push-2').click()

    await wait(() => {
        expect(document.querySelector('span').textContent).toEqual('2')
    })

    document.querySelector('#push-3').click()

    await wait(() => {
        expect(document.querySelectorAll('span').length).toEqual(2)
        expect(document.querySelectorAll('span')[1].textContent).toEqual('3')
    })
})
