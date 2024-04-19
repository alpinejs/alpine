import { beChecked, haveData, haveText, haveValue, html, notBeChecked, test } from '../../utils'

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

test('x-model casts value to boolean initially for radios',
    html`
    <div x-data="{ foo: true }">
        <input id="1" type="radio" value="true" name="foo" x-model.boolean="foo">
        <input id="2" type="radio" value="false" name="foo" x-model.boolean="foo">
    </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', true))
        get('#1').should(beChecked())
        get('#2').should(notBeChecked())
        get('#2').click()
        get('div').should(haveData('foo', false))
        get('#1').should(notBeChecked())
        get('#2').should(beChecked())
    }
)

test('x-model casts value to boolean if boolean modifier is present',
    html`
    <div x-data="{ foo: null, bar: null, baz: [] }">
        <input type="text" x-model.boolean="foo"></input>
        <input type="checkbox" x-model.boolean="foo"></input>
        <input type="radio" name="foo" x-model.boolean="foo" value="true"></input>
        <input type="radio" name="foo" x-model.boolean="foo" value="false"></input>
        <select x-model.boolean="bar">
            <option value="true">yes</option>
            <option value="false">no</option>
        </select>
    </div>
    `,
    ({ get }) => {
        get('input[type=text]').type('1')
        get('div').should(haveData('foo', true))
        get('input[type=text]').clear().type('0')
        get('div').should(haveData('foo', false))

        get('input[type=checkbox]').check()
        get('div').should(haveData('foo', true))
        get('input[type=checkbox]').uncheck()
        get('div').should(haveData('foo', false))

        get('input[type=radio][value="true"]').should(notBeChecked())
        get('input[type=radio][value="false"]').should(beChecked())
        get('input[type=radio][value="true"]').check()
        get('div').should(haveData('foo', true))
        get('input[type=radio][value="false"]').check()
        get('div').should(haveData('foo', false))

        get('select').select('false')
        get('div').should(haveData('bar', false))
        get('select').select('true')
        get('div').should(haveData('bar', true))
    }
)

test('x-model with boolean modifier returns: null if empty, original value if casting fails, numeric value if casting passes',
    html`
    <div x-data="{ foo: 0, bar: '' }">
        <input x-model.boolean="foo"></input>
    </div>
    `,
    ({ get }) => {
        get('input').clear()
        get('div').should(haveData('foo', null))
        get('input').clear().type('bar')
        get('div').should(haveData('foo', true))
        get('input').clear().type('1')
        get('div').should(haveData('foo', true))
        get('input').clear().type('1').clear()
        get('div').should(haveData('foo', null))
        get('input').clear().type('0')
        get('div').should(haveData('foo', false))
        get('input').clear().type('bar')
        get('div').should(haveData('foo', true))
        get('input').clear().type('0').clear()
        get('div').should(haveData('foo', null))
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

test(
    "x-model radio updates value when the form is reset",
    html`
    <div x-data="{ foo: undefined }">
        <form>
            <input type="radio" value="radio1" x-model.fill="foo"></input>
            <input type="radio" value="radio2" x-model.fill="foo" checked></input>
            <input type="radio" value="radio3" x-model.fill="foo"></input>
            <button type="reset">Reset</button>
        </form>
        <span x-text="foo"></span>
    </div>
    `,
    ({ get }) => {
        get("span").should(haveText("radio2"));
        get("input[value='radio1']").click();
        get("span").should(haveText("radio1"));
        get("button").click();
        get("span").should(haveText("radio2"));
    }
);

test(
    "x-model.number radio updates value when the form is reset",
    html`
    <div x-data="{ foo: undefined }">
        <form>
            <input type="radio" value="1" x-model.number.fill="foo"></input>
            <input type="radio" value="2" x-model.number.fill="foo" checked></input>
            <input type="radio" value="3" x-model.number.fill="foo"></input>
            <button type="reset">Reset</button>
        </form>
    </div>
    `,
    ({ get }) => {
        get("[x-data]").should(haveData("foo", 2));
        get("input[value='1']").click();
        get("[x-data]").should(haveData("foo", 1));
        get("button").click();
        get("[x-data]").should(haveData("foo", 2));
    }
);

test(
    "x-model.boolean radio updates value when the form is reset",
    html`
    <div x-data="{ foo: undefined }">
        <form>
            <input type="radio" value="true" x-model.boolean.fill="foo" checked></input>
            <input type="radio" value="false" x-model.boolean.fill="foo"></input>
            <button type="reset">Reset</button>
        </form>
    </div>
    `,
    ({ get }) => {
        get("[x-data]").should(haveData("foo", true));
        get("input[value='false']").click();
        get("[x-data]").should(haveData("foo", false));
        get("button").click();
        get("[x-data]").should(haveData("foo", true));
    }
);

test(
    "x-model checkbox array updates value when the form is reset",
    html`
    <div x-data="{ foo: [] }">
        <form>
            <input type="checkbox" value="checkbox1" x-model.fill="foo"></input>
            <input type="checkbox" value="checkbox2" x-model.fill="foo" checked></input>
            <input type="checkbox" value="checkbox3" x-model.fill="foo" checked></input>
            <input type="checkbox" value="checkbox4" x-model.fill="foo"></input>
            <button type="reset">Reset</button>
        </form>
        <span x-text="foo"></span>
    </div>
    `,
    ({ get }) => {
        get("span").should(haveText("checkbox2,checkbox3"));
        get("input[value='checkbox1']").click();
        get("span").should(haveText("checkbox2,checkbox3,checkbox1"));
        get("input[value='checkbox3']").click();
        get("span").should(haveText("checkbox2,checkbox1"));
        get("button").click();
        get("span").should(haveText("checkbox2,checkbox3"));
    }
);

test(
    "x-model.number checkbox array updates value when the form is reset",
    html`
    <div x-data="{ foo: [] }">
        <form>
            <input type="checkbox" value="1" x-model.number.fill="foo"></input>
            <input type="checkbox" value="2" x-model.number.fill="foo" checked></input>
            <input type="checkbox" value="3" x-model.number.fill="foo" checked></input>
            <input type="checkbox" value="4" x-model.number.fill="foo"></input>
            <button type="reset">Reset</button>
        </form>
    </div>
    `,
    ({ get }) => {
        get("[x-data]").should(haveData("foo", [2, 3]));
        get("input[value='1']").click();
        get("[x-data]").should(haveData("foo", [2, 3, 1]));
        get("input[value='3']").click();
        get("[x-data]").should(haveData("foo", [2, 1]));
        get("button").click();
        get("[x-data]").should(haveData("foo", [2, 3]));
    }
);

test(
    "x-model select updates value when the form is reset",
    html`
        <div x-data="{ a: null, b: null, c: null, d: null }">
            <form>
                <select id="a" x-model.fill="a">
                    <option value="123">123</option>
                    <option value="456" selected>456</option>
                    <option value="789">789</option>
                </select>
                <select id="b" x-model.fill="b" multiple>
                    <option value="123" selected>123</option>
                    <option value="456">456</option>
                    <option value="789" selected>789</option>
                </select>
                <select id="c" x-model.number.fill="c">
                    <option value="123">123</option>
                    <option value="456" selected>456</option>
                    <option value="789">789</option>
                </select>
                <select id="d" x-model.number.fill="d" multiple>
                    <option value="123" selected>123</option>
                    <option value="456">456</option>
                    <option value="789" selected>789</option>
                </select>
                <button type="reset">Reset</button>
            </form>
        </div>
    `,
    ({ get }) => {
        get("[x-data]").should(haveData("a", "456"));
        get("[x-data]").should(haveData("b", ["123", "789"]));
        get("[x-data]").should(haveData("c", 456));
        get("[x-data]").should(haveData("d", [123, 789]));
        get("select#a").select("789");
        get("select#b").select("456");
        get("select#c").select("789");
        get("select#d").select("456");
        get("[x-data]").should(haveData("a", "789"));
        get("[x-data]").should(haveData("b", ["456"]));
        get("[x-data]").should(haveData("c", 789));
        get("[x-data]").should(haveData("d", [456]));
        get("button").click();
        get("[x-data]").should(haveData("a", "456"));
        get("[x-data]").should(haveData("b", ["123", "789"]));
        get("[x-data]").should(haveData("c", 456));
        get("[x-data]").should(haveData("d", [123, 789]));
    }
);


test('x-model with fill modifier takes input value on null, empty string or undefined',
    html`
    <div x-data="{ a: 123, b: 0, c: '', d: null, e: {} }">
      <input x-model.fill="a" value="123456" />
      <span id="a" x-text="a"></span>
      <input x-model.fill="b" value="123456" />
      <span id="b" x-text="b"></span>
      <input x-model.fill="c" value="123456" />
      <span id="c" x-text="c"></span>
      <input x-model.fill="d" value="123456" />
      <span id="d" x-text="d"></span>
      <input x-model.fill="e.a" value="123456" />
      <span id="e" x-text="e.a"></span>
    </div>
    `,
    ({ get }) => {
        get('#a').should(haveText('123'))
        get('#b').should(haveText('0'))
        get('#c').should(haveText('123456'))
        get('#d').should(haveText('123456'))
        get('#e').should(haveText('123456'))
    }
)

test('x-model with fill modifier works with select elements',
    html`
        <div x-data="{ a: null, b: null, c: null, d: null, e: null, f: null }">
            <select x-model.fill="a">
                <option value="123">123</option>
                <option value="456" selected>456</option>
            </select>
            <select x-model.fill="b" multiple>
                <option value="123" selected>123</option>
                <option value="456" selected>456</option>
            </select>
            <select x-model.number.fill="c">
                <option value="123">123</option>
                <option value="456" selected>456</option>
            </select>
            <select x-model.number.fill="d" multiple>
                <option value="123" selected>123</option>
                <option value="456" selected>456</option>
            </select>
            <select x-model.boolean.fill="e">
                <option value="true" selected>true</option>
                <option value="false">false</option>
            </select>
            <select x-model.boolean.fill="f" multiple>
                <option value="true" selected>true</option>
                <option value="false" selected>false</option>
            </select>
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveData('a', '456'));
        get('[x-data]').should(haveData('b', ['123', '456']));
        get('[x-data]').should(haveData('c', 456));
        get('[x-data]').should(haveData('d', [123, 456]));
        get('[x-data]').should(haveData('e', true));
        get('[x-data]').should(haveData('f', [true, false]));
    }
);

test('x-model with fill modifier works with radio elements',
    html`
        <div x-data="{ a: null, b: null, c: '101112', d: null }">
            <input x-model.fill="a" type="radio" value="123" />
            <input x-model.fill="a" type="radio" value="456" checked />
            <input x-model.fill="a" type="radio" value="789" />
            <input x-model.fill="a" type="radio" value="101112" />
            <input x-model.fill="a" type="radio" value="131415" />

            <input x-model.fill="b" name="b" type="radio" value="123" />
            <input x-model.fill="b" name="b" type="radio" value="456" />
            <input x-model.fill="b" name="b" type="radio" value="789" checked />
            <input x-model.fill="b" name="b" type="radio" value="101112" />
            <input x-model.fill="b" name="b" type="radio" value="131415" />

            <input x-model.fill="c" type="radio" value="123" />
            <input x-model.fill="c" type="radio" value="456" />
            <input x-model.fill="c" type="radio" value="789" />
            <input x-model.fill="c" type="radio" value="101112" />
            <input x-model.fill="c" type="radio" value="131415" />
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveData('a', '456'));
        get('[x-data]').should(haveData('b', '789'));
        get('[x-data]').should(haveData('c', '101112'));
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
    'x-model with fill and debounce still fills value',
    html`
        <div x-data="{ a: '' }">
            <input type="text" x-model.fill.debounce="a" value="hello" />
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveData('a', 'hello'));
    }
);

