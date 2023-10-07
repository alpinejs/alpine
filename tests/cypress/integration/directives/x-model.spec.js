import { haveData, haveText, haveValue, html, test } from '../../utils'

test('The name of the test',
    html`<h1 x-data x-text="'HEY'"></h1>`,
    ({ get }) => get('h1').should(haveText('HEY'))
)

test('x-model has value binding when initialized',
    html`
    <div x-data="{ foo: 'bar' }">
        <input x-model="foo"></input>
    </div>
    `,
    ({ get }) => { get('input').should(haveValue('bar')) }
)

test('x-model updates value when updated via input event',
    html`
    <div x-data="{ foo: 'bar' }">
        <input x-model="foo"></input>
        <span x-text="foo"></span>
    </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('input').type('baz')
        get('span').should(haveText('barbaz'))
    }
)

test('x-model has value binding when updated',
    html`
    <div x-data="{ foo: 'bar' }">
        <input x-model="foo"></input>

        <button x-on:click="foo = 'baz'">click me</button>
    </div>
    `,
    ({ get }) => {
        get('input').should(haveValue('bar'))
        get('button').click()
        get('input').should(haveValue('baz'))
    }
)

test('x-model casts value to number if number modifier is present',
    html`
    <div x-data="{ foo: null }">
        <input type="number" x-model.number="foo"></input>
    </div>
    `,
    ({ get }) => {
        get('input').type('123')
        get('div').should(haveData('foo', 123))

    }
)

test('x-model with number modifier returns: null if empty, original value if casting fails, numeric value if casting passes',
    html`
    <div x-data="{ foo: 0, bar: '' }">
        <input type="number" x-model.number="foo"></input>
        <input x-model.number="bar"></input>
    </div>
    `,
    ({ get }) => {
        get('input:nth-of-type(1)').clear()
        get('div').should(haveData('foo', null))
        get('input:nth-of-type(1)').clear().type('-')
        get('div').should(haveData('foo', null))
        get('input:nth-of-type(1)').clear().type('-123')
        get('div').should(haveData('foo', -123))
        get('input:nth-of-type(2)').type(123).clear()
        get('div').should(haveData('bar', null))
        get('input:nth-of-type(2)').clear().type('-')
        get('div').should(haveData('bar', '-'))
        get('input:nth-of-type(2)').clear().type('-123')
        get('div').should(haveData('bar', -123))
    }
)

test('x-model trims value if trim modifier is present',
    html`
    <div x-data="{ foo: '' }">
        <input x-model.trim="foo"></input>

        <span x-text="foo"></span>
    </div>
    `,
    ({ get }) => {
        get('input').type('bar     ')
        get('div').should(haveData('foo', 'bar'))
    }
)

test('x-model can be accessed programmatically',
    html`
    <div x-data="{ foo: 'bar' }" x-model="foo">
        <input x-model="foo">

        <span x-text="$root._x_model.get()"></span>
        <button @click="$root._x_model.set('bob')">Set foo to bob</button>
    </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('input').type('baz')
        get('span').should(haveText('barbaz'))
        get('button').click()
        get('span').should(haveText('bob'))
    }
)

test('x-model updates value when the form is reset',
    html`
    <div x-data="{ foo: '' }">
        <form>
            <input x-model="foo"></input>
            <button type="reset">Reset</button>
        </form>
        <span x-text="foo"></span>
    </div>
    `,
    ({ get }) => {
        get('span').should(haveText(''))
        get('input').type('baz')
        get('span').should(haveText('baz'))
        get('button').click()
        get('span').should(haveText(''))
    }
)

test('x-model with fill modifier takes input value on null or empty string',
    html`
    <div x-data="{ a: 123, b: 0, c: '', d: null }">
      <input x-model.fill="a" value="123456" />
      <span id="a" x-text="a"></span>
      <input x-model.fill="b" value="123456" />
      <span id="b" x-text="b"></span>
      <input x-model.fill="c" value="123456" />
      <span id="c" x-text="c"></span>
      <input x-model.fill="d" value="123456" />
      <span id="d" x-text="d"></span>
    </div>
    `,
    ({ get }) => {
        get('#a').should(haveText('123'))
        get('#b').should(haveText('0'))
        get('#c').should(haveText('123456'))
        get('#d').should(haveText('123456'))
    }
)

test('x-model with fill modifier works with select/radio elements',
    html`
        <div x-data="{ a: null, b: null, c: null, d: null }">
            <select x-model.fill="a">
                <option value="123">123</option>
                <option value="456" selected>456</option>
            </select>
            <select x-model.fill="b" multiple>
                <option value="123" selected>123</option>
                <option value="456" selected>456</option>
            </select>
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveData('a', '456'));
        get('[x-data]').should(haveData('b', ['123', '456']));
    }
);

test('x-model with fill modifier respects number modifier',
    html`
        <div x-data="{ a: null, b: null, c: null, d: null }">
            <input type="text" x-model.fill.number="a" value="456" / >
            <select x-model.fill.number="b" multiple>
                <option value="123" selected>123</option>
                <option value="456" selected>456</option>
            </select>
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveData('a', 456));
        get('[x-data]').should(haveData('b', [123,456]));
    }
);

test(
    'x-model with fill applies on checkboxes bound to array',
    html`
        <div x-data="{ a: ['456'] }">
            <input type="checkbox" x-model.fill="a" value="123" checked />
            <input type="checkbox" x-model.fill="a" value="456" />
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveData('a', ['123']));
    }
);

test(
    'x-model with fill modifier add autofill x-data object (no need fill x-data)',
    html`
        <div x-data>
            <div>
                Text
                <input type="text" x-model.fill="test" placeholder="Enter text" value="String text input">
                <span x-text="test"></span>
            </div>
            <br>
            <div>
                Number
                <input type="number" x-model.fill="years" placeholder="Enter number" value="55">
                <span x-text="years"></span>
            </div>
            <br>
            <div>
                Single checkbox with boolean
                <input type="checkbox" value="red" x-model.fill="cb" checked>
                <span x-text="cb"></span>
            </div>
            <br>
            <div>
                Multiple checkboxes bound to array
                <input type="checkbox" value="red" x-model.fill="colors">
                <input type="checkbox" value="orange" x-model.fill="colors" checked>
                <input type="checkbox" value="yellow" x-model.fill="colors" checked>
                <span x-text="colors"></span>
            </div>
            <br>
            <div>
                Radio Button
                <input type="radio" value="rb1" x-model.fill="radio"> Radio Button 1
                <input type="radio" value="rb2" x-model.fill="radio" checked> Radio Button 2
                <span x-text="radio"></span>
            </div>
            <br>
            <div>
                Textarea
                <textarea x-model.fill="textarea">String textarea content</textarea>
                <span x-text="textarea"></span>
            </div>
            <br>
            <div>
                Select
                <select x-model.fill="color">
                    <option value="">Choose color</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="yellow" selected>Yellow</option>
                </select>
                Color: <span x-text="color"></span>
            </div>
            <br>
            <div>
                Multiple Select
                <select x-model.fill="colorList" multiple="">
                    <option value="red">Red</option>
                    <option value="orange" selected>Orange</option>
                    <option value="yellow" selected>Yellow</option>
                </select>
                Color: <span x-text="colorList"></span>
            </div>
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveData('test', 'String text input'));
        get('[x-data]').should(haveData('years', '55'));
        get('[x-data]').should(haveData('cb', true));
        get('[x-data]').should(haveData('colors', ['orange', 'yellow']));
        get('[x-data]').should(haveData('radio', 'rb2'));
        get('[x-data]').should(haveData('textarea', 'String textarea content'));
        get('[x-data]').should(haveData('color', 'yellow'));
        get('[x-data]').should(haveData('colorList', ['orange', 'yellow']));
    }
);
