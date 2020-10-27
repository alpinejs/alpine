import Alpine from 'alpinejs'
import { wait, fireEvent } from '@testing-library/dom'

global.MutationObserver = class {
    observe() { }
}

test('x-model has value binding when initialized', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input x-model="foo"></input>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('bar')
})

test('x-model updates value when updated via input event', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input x-model="foo"></input>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'baz' } })

    await wait(() => { expect(document.querySelector('input').value).toEqual('baz') })
})

test('x-model reflects data changed elsewhere', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input x-model="foo"></input>

            <button x-on:click="foo = 'baz'"></button>
        </div>
    `

    Alpine.start()

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('input').value).toEqual('baz') })
})

test('x-model casts value to number if number modifier is present', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: null }">
            <input type="number" x-model.number="foo"></input>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: '123' } })

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.foo).toEqual(123) })
})

test('x-model with number modifier returns: null if empty, original value if casting fails, numeric value if casting passes', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 0, bar: '' }">
            <input type="number" x-model.number="foo"></input>
            <input x-model.number="bar"></input>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelectorAll('input')[0], { target: { value: '' } })

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.foo).toEqual(null) })

    fireEvent.input(document.querySelectorAll('input')[0], { target: { value: '-' } })

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.foo).toEqual(null) })

    fireEvent.input(document.querySelectorAll('input')[0], { target: { value: '-123' } })

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.foo).toEqual(-123) })

    fireEvent.input(document.querySelectorAll('input')[1], { target: { value: '' } })

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.bar).toEqual(null) })

    fireEvent.input(document.querySelectorAll('input')[1], { target: { value: '-' } })

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.bar).toEqual('-') })

    fireEvent.input(document.querySelectorAll('input')[1], { target: { value: '-123' } })

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.bar).toEqual(-123) })
})

test('x-model trims value if trim modifier is present', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '' }">
            <input x-model.trim="foo"></input>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar   ' } })

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('bar') })
})

test('x-model updates value when updated via changed event when lazy modifier is present', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input x-model.lazy="foo"></input>
        </div>
    `

    Alpine.start()

    fireEvent.change(document.querySelector('input'), { target: { value: 'baz' } })

    await wait(() => { expect(document.querySelector('input').value).toEqual('baz') })
})

test('x-model binds checkbox value', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: true }">
            <input type="checkbox" x-model="foo"></input>

            <span x-bind:bar="JSON.stringify(foo)"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').checked).toEqual(true)
    expect(document.querySelector('span').getAttribute('bar')).toEqual("true")

    fireEvent.change(document.querySelector('input'), { target: { checked: false } })

    await wait(() => { expect(document.querySelector('span').getAttribute('bar')).toEqual("false") })
})

test('x-model binds checkbox value to array', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: ['bar'] }">
            <input type="checkbox" x-model="foo" value="bar"></input>
            <input type="checkbox" x-model="foo" value="baz"></input>

            <span x-bind:bar="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].checked).toEqual(true)
    expect(document.querySelectorAll('input')[1].checked).toEqual(false)
    expect(document.querySelector('span').getAttribute('bar')).toEqual("bar")

    fireEvent.change(document.querySelectorAll('input')['1'], { target: { checked: true } })

    await wait(() => {
        expect(document.querySelectorAll('input')[0].checked).toEqual(true)
        expect(document.querySelectorAll('input')[1].checked).toEqual(true)
        expect(document.querySelector('span').getAttribute('bar')).toEqual("bar,baz")
    })
})

test('x-model checkbox array binding supports .number modifier', async () => {
    document.body.innerHTML = `
        <div
            x-data="{
                selected: [2]
            }"
        >
            <input type="checkbox" value="1" x-model.number="selected" />
            <input type="checkbox" value="2" x-model.number="selected" />
            <input type="checkbox" value="3" x-model.number="selected" />

            <span x-bind:bar="JSON.stringify(selected)"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input[type=checkbox]')[0].checked).toEqual(false)
    expect(document.querySelectorAll('input[type=checkbox]')[1].checked).toEqual(true)
    expect(document.querySelectorAll('input[type=checkbox]')[2].checked).toEqual(false)
    expect(document.querySelector('span').getAttribute('bar')).toEqual("[2]")

    fireEvent.change(document.querySelectorAll('input[type=checkbox]')[2], { target: { checked: true } })

    await wait(() => { expect(document.querySelector('span').getAttribute('bar')).toEqual("[2,3]") })

    fireEvent.change(document.querySelectorAll('input[type=checkbox]')[0], { target: { checked: true } })

    await wait(() => { expect(document.querySelector('span').getAttribute('bar')).toEqual("[2,3,1]") })

    fireEvent.change(document.querySelectorAll('input[type=checkbox]')[0], { target: { checked: false } })
    fireEvent.change(document.querySelectorAll('input[type=checkbox]')[1], { target: { checked: false } })
    await wait(() => { expect(document.querySelector('span').getAttribute('bar')).toEqual("[3]") })
})

test('x-model checkbox array binding is consistent (if value is initially checked, it can be unchecked)', async () => {
    // https://github.com/alpinejs/alpine/issues/814
    document.body.innerHTML = `
        <div
            x-data="{
                selected: [2]
            }"
        >
            <input type="checkbox" value="2" x-model="selected" />

            <span x-bind:bar="JSON.stringify(selected)"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input[type=checkbox]').checked).toEqual(true)
    expect(document.querySelector('span').getAttribute('bar')).toEqual("[2]")

    fireEvent.change(document.querySelector('input[type=checkbox]'), { target: { checked: false } })
    await wait(() => { expect(document.querySelector('span').getAttribute('bar')).toEqual("[]") })
})

test('x-model binds radio value', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input type="radio" x-model="foo" value="bar"></input>
            <input type="radio" x-model="foo" value="baz"></input>

            <span x-bind:bar="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].checked).toEqual(true)
    expect(document.querySelectorAll('input')[1].checked).toEqual(false)
    expect(document.querySelector('span').getAttribute('bar')).toEqual('bar')

    fireEvent.change(document.querySelectorAll('input')[1], { target: { checked: true } })

    await wait(() => {
        expect(document.querySelectorAll('input')[0].checked).toEqual(false)
        expect(document.querySelectorAll('input')[1].checked).toEqual(true)
        expect(document.querySelector('span').getAttribute('bar')).toEqual('baz')
    })
})

test('x-model binds select dropdown', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <select x-model="foo">
                <option disabled value="">Please select one</option>
                <option>bar</option>
                <option>baz</option>
            </select>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('option')[0].selected).toEqual(false)
    expect(document.querySelectorAll('option')[1].selected).toEqual(true)
    expect(document.querySelectorAll('option')[2].selected).toEqual(false)
    expect(document.querySelector('span').textContent).toEqual('bar')

    fireEvent.change(document.querySelector('select'), { target: { value: 'baz' } });

    await wait(() => {
        expect(document.querySelectorAll('option')[0].selected).toEqual(false)
        expect(document.querySelectorAll('option')[1].selected).toEqual(false)
        expect(document.querySelectorAll('option')[2].selected).toEqual(true)
        expect(document.querySelector('span').textContent).toEqual('baz')
    })
})

test('x-model binds multiple select dropdown', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: ['bar'] }">
            <select x-model="foo" multiple>
                <option disabled value="">Please select one</option>
                <option>bar</option>
                <option>baz</option>
            </select>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('option')[0].selected).toEqual(false)
    expect(document.querySelectorAll('option')[1].selected).toEqual(true)
    expect(document.querySelectorAll('option')[2].selected).toEqual(false)
    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelectorAll('option')[2].selected = true
    fireEvent.change(document.querySelector('select'));

    await wait(() => {
        expect(document.querySelectorAll('option')[0].selected).toEqual(false)
        expect(document.querySelectorAll('option')[1].selected).toEqual(true)
        expect(document.querySelectorAll('option')[2].selected).toEqual(true)
        expect(document.querySelector('span').textContent).toEqual('bar,baz')
    })
})

test('x-model binds nested keys', async () => {
    document.body.innerHTML = `
        <div x-data="{ some: { nested: { key: 'foo' } } }">
            <input type="text" x-model="some.nested.key">
            <span x-text="some.nested.key"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('foo')
    expect(document.querySelector('span').textContent).toEqual('foo')

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' } })

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('bar')
        expect(document.querySelector('span').textContent).toEqual('bar')
    })
})

test('x-model undefined nested model key defaults to empty string', async () => {
    document.body.innerHTML = `
        <div x-data="{ some: { nested: {} } }">
            <input type="text" x-model="some.nested.key">
            <span x-text="some.nested.key"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('')
    expect(document.querySelector('span').textContent).toEqual('')

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' } })

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('bar')
        expect(document.querySelector('span').textContent).toEqual('bar')
    })
})

test('x-model can listen for custom input event dispatches', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-model="foo">
            <button @click="$dispatch('input', 'baz')"></button>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').textContent).toEqual('baz')
    })
})

// <input type="color">
test('x-model bind color input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '#ff0000' }">
        <input type="color" x-model="key">
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('#ff0000')
    expect(document.querySelector('span').textContent).toEqual('#ff0000')

    fireEvent.input(document.querySelector('input'), { target: { value: '#00ff00' } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('#00ff00')
        expect(document.querySelector('span').textContent).toEqual('#00ff00')
    })

})

// <input type="button">
test('x-model bind button input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: 'foo' }">
        <input type="button" x-model="key">
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('foo')
    expect(document.querySelector('span').textContent).toEqual('foo')

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('bar')
        expect(document.querySelector('span').textContent).toEqual('bar')
    })
})

// <input type="date">
test('x-model bind date input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '2020-07-10' }">
      <input type="date" x-model="key" />
      <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('2020-07-10')
    expect(document.querySelector('span').textContent).toEqual('2020-07-10')

    fireEvent.input(document.querySelector('input'), { target: { value: '2021-01-01' } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('2021-01-01')
        expect(document.querySelector('span').textContent).toEqual('2021-01-01')
    })
})

// <input type="datetime-local">
test('x-model bind datetime-local input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '2020-01-01T20:00' }">
      <input type="datetime-local" x-model="key" />
      <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('2020-01-01T20:00')
    expect(document.querySelector('span').textContent).toEqual('2020-01-01T20:00')

    fireEvent.input(document.querySelector('input'), { target: { value: '2021-02-02T20:00' } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('2021-02-02T20:00')
        expect(document.querySelector('span').textContent).toEqual('2021-02-02T20:00')
    })
})

// <input type="email">
test('x-model bind email input', async () => {
})

// <input type="month">
test('x-model bind month input', async () => {
    document.body.innerHTML = `
        <div x-data="{ key: '2020-04' }">
        <input type="month" x-model="key" />
        <span x-text="key"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('2020-04')
    expect(document.querySelector('span').textContent).toEqual('2020-04')

    fireEvent.input(document.querySelector('input'), { target: { value: '2021-05' } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('2021-05')
        expect(document.querySelector('span').textContent).toEqual('2021-05')
    })
})


// <input type="number">
test('x-model bind number input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '11' }">
        <input type="number" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('11')
    expect(document.querySelector('span').textContent).toEqual('11')

    fireEvent.input(document.querySelector('input'), { target: { value: '2021' } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('2021')
        expect(document.querySelector('span').textContent).toEqual('2021')
    })
})

// <input type="password">
test('x-model bind password input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: 'SecretKey' }">
        <input type="password" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('SecretKey')
    expect(document.querySelector('span').textContent).toEqual('SecretKey')

    fireEvent.input(document.querySelector('input'), { target: { value: 'NewSecretKey' } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('NewSecretKey')
        expect(document.querySelector('span').textContent).toEqual('NewSecretKey')
    })
})

// <input type="range">
test('x-model bind range input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '10' }">
        <input type="range" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('10')
    expect(document.querySelector('span').textContent).toEqual('10')

    fireEvent.input(document.querySelector('input'), { target: { value: '20' } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('20')
        expect(document.querySelector('span').textContent).toEqual('20')
    })
})

// <input type="search">
test('x-model bind search input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '' }">
        <input type="search" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('')
    expect(document.querySelector('span').textContent).toEqual('')

    const newValue = 'Frontend Frameworks';
    fireEvent.input(document.querySelector('input'), { target: { value: newValue } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual(newValue)
        expect(document.querySelector('span').textContent).toEqual(newValue)
    })
})

// <input type="tel">
test('x-model bind tel input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '+12345678901' }">
        <input type="tel" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('+12345678901')
    expect(document.querySelector('span').textContent).toEqual('+12345678901')

    const newValue = '+1239874560';
    fireEvent.input(document.querySelector('input'), { target: { value: newValue } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual(newValue)
        expect(document.querySelector('span').textContent).toEqual(newValue)
    })
})

// <input type="tel">
test('x-model bind tel input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '+12345678901' }">
        <input type="tel" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('+12345678901')
    expect(document.querySelector('span').textContent).toEqual('+12345678901')

    const newValue = '+1239874560';
    fireEvent.input(document.querySelector('input'), { target: { value: newValue } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual(newValue)
        expect(document.querySelector('span').textContent).toEqual(newValue)
    })
})

// <input type="tel">
test('x-model bind time input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '22:00' }">
        <input type="time" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('22:00')
    expect(document.querySelector('span').textContent).toEqual('22:00')

    const newValue = '23:00';
    fireEvent.input(document.querySelector('input'), { target: { value: newValue } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual(newValue)
        expect(document.querySelector('span').textContent).toEqual(newValue)
    })
})

// <input type="time">
test('x-model bind time input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '22:00' }">
        <input type="time" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('22:00')
    expect(document.querySelector('span').textContent).toEqual('22:00')

    const newValue = '23:00';
    fireEvent.input(document.querySelector('input'), { target: { value: newValue } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual(newValue)
        expect(document.querySelector('span').textContent).toEqual(newValue)
    })
})

// <input type="week">
test('x-model bind week input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: '2020-W20' }">
        <input type="week" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('2020-W20')
    expect(document.querySelector('span').textContent).toEqual('2020-W20')

    const newValue = '2020-W30';
    fireEvent.input(document.querySelector('input'), { target: { value: newValue } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual(newValue)
        expect(document.querySelector('span').textContent).toEqual(newValue)
    })
})

// <input type="url">
test('x-model bind url input', async () => {
    document.body.innerHTML = `
    <div x-data="{ key: 'https://example.com' }">
        <input type="url" x-model="key" />
        <span x-text="key"></span>
    </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('https://example.com')
    expect(document.querySelector('span').textContent).toEqual('https://example.com')

    const newValue = 'https://alpine.io';
    fireEvent.input(document.querySelector('input'), { target: { value: newValue } });

    await wait(() => {
        expect(document.querySelector('input').value).toEqual(newValue)
        expect(document.querySelector('span').textContent).toEqual(newValue)
    })
})

test('x-model sets value before x-on directive expression is processed', async () => {
    window.selectValueA
    window.selectValueB

    document.body.innerHTML = `
        <div x-data="{ a: 'foo', b: 'foo' }">
            <select x-model="a" @change="window.selectValueA = a">
                <option>foo</option>
                <option>bar</option>
            </select>
            <select @change="window.selectValueB = b" x-model="b">
                <option>foo</option>
                <option>bar</option>
            </select>
        </div>
    `

    Alpine.start()

    fireEvent.change(document.querySelectorAll('select')[0], { target: { value: 'bar' } });
    fireEvent.change(document.querySelectorAll('select')[1], { target: { value: 'bar' } });

    await wait(() => {
        expect(window.selectValueA).toEqual('bar')
        expect(window.selectValueB).toEqual('bar')
    })
})
