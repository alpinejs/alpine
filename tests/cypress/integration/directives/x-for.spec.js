import { beVisible, haveLength, haveText, html, notBeVisible, test } from '../../utils'

test('renders loops with x-for',
    html`
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = ['foo', 'bar']">click me</button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(haveText('foo'))
        get('span:nth-of-type(2)').should(notBeVisible())
        get('button').click()
        get('span:nth-of-type(1)').should(haveText('foo'))
        get('span:nth-of-type(2)').should(haveText('bar'))
    }
)

test('renders loops with x-for that have space or newline',
    html`
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = ['foo', 'bar']">click me</button>

            <div x-bind:id="1">
                <template x-for="
                    (
                        item
                    ) in items
                ">
                    <span x-text="item"></span>
                </template>
            </div>

            <div x-bind:id="2">
                <template x-for=" (
                        item,
                        index
                    ) in items
                ">
                    <span x-text="item"></span>
                </template>
            </div>
        </div>
    `,
    ({ get }) => {
        get('#1 span:nth-of-type(1)').should(haveText('foo'))
        get('#1 span:nth-of-type(2)').should(notBeVisible())
        get('#2 span:nth-of-type(1)').should(haveText('foo'))
        get('#2 span:nth-of-type(2)').should(notBeVisible())
        get('button').click()
        get('#1 span:nth-of-type(1)').should(haveText('foo'))
        get('#1 span:nth-of-type(2)').should(haveText('bar'))
        get('#2 span:nth-of-type(1)').should(haveText('foo'))
        get('#2 span:nth-of-type(2)').should(haveText('bar'))
    }
)

test('can destructure arrays',
    html`
        <div x-data="{ items: [[1, 'foo'], [2, 'bar']] }">
            <template x-for="[id, label] in items">
                <div x-bind:id="id">
                    <span x-text="id"></span>
                    <h1 x-text="label"></h1>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('#1 span').should(haveText('1'))
        get('#1 h1').should(haveText('foo'))
        get('#2 span').should(haveText('2'))
        get('#2 h1').should(haveText('bar'))
    }
)

test('can destructure object',
    html`
        <div x-data="{ items: [{ foo: 'oof', bar: 'rab' }, { foo: 'ofo', bar: 'arb' }] }">
            <template x-for="({ foo, bar }, i) in items">
                <div x-bind:id="i + 1">
                    <span x-text="foo"></span>
                    <h1 x-text="bar"></h1>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('#1 span').should(haveText('oof'))
        get('#1 h1').should(haveText('rab'))
        get('#2 span').should(haveText('ofo'))
        get('#2 h1').should(haveText('arb'))
    }
)

test('removes all elements when array is empty and previously had one item',
    html`
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = []">click me</button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('button').click()
        get('span').should(notBeVisible())
    }
)

test('removes all elements when array is empty and previously had multiple items',
    html`
        <div x-data="{ items: ['foo', 'bar', 'world'] }">
            <button x-on:click="items = []">click me</button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(beVisible())
        get('span:nth-of-type(2)').should(beVisible())
        get('span:nth-of-type(3)').should(beVisible())
        get('button').click()
        get('span:nth-of-type(1)').should(notBeVisible())
        get('span:nth-of-type(2)').should(notBeVisible())
        get('span:nth-of-type(3)').should(notBeVisible())
    }
)

test('elements inside of loop are reactive',
    html`
        <div x-data="{ items: ['first'], foo: 'bar' }">
            <button x-on:click="foo = 'baz'">click me</button>

            <template x-for="item in items">
                <span>
                    <h1 x-text="item"></h1>
                    <h2 x-text="foo"></h2>
                </span>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('h1').should(haveText('first'))
        get('h2').should(haveText('bar'))
        get('button').click()
        get('span').should(beVisible())
        get('h1').should(haveText('first'))
        get('h2').should(haveText('baz'))
    }
)

test('components inside of loop are reactive',
    html`
        <div x-data="{ items: ['first'] }">
            <template x-for="item in items">
                <div x-data="{foo: 'bar'}" class="child">
                    <span x-text="foo"></span>
                    <button x-on:click="foo = 'bob'">click me</button>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('bob'))
    }
)

test('components inside a plain element of loop are reactive',
    html`
        <div x-data="{ items: ['first'] }">
            <template x-for="item in items">
                <ul>
                    <div x-data="{foo: 'bar'}" class="child">
                        <span x-text="foo"></span>
                        <button x-on:click="foo = 'bob'">click me</button>
                    </div>
                </ul>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('bob'))
    }
)

test('adding key attribute moves dom nodes properly',
    html`
        <div x-data="{ items: ['foo', 'bar'] }">
            <button x-on:click="items = ['bob', 'bar', 'foo', 'baz']" id="reorder">click me</button>
            <button x-on:click="$el.parentElement.querySelectorAll('span').forEach((el, index) => el.og_loop_index = index)" id="assign">click me</button>

            <template x-for="item in items" :key="item">
                <span x-text="item"></span>
            </template>
        </div>
    `,
    ({ get }) => {
        let haveOgIndex = index => el => expect(el[0].og_loop_index).to.equal(index)

        get('#assign').click()
        get('span:nth-of-type(1)').should(haveOgIndex(0))
        get('span:nth-of-type(2)').should(haveOgIndex(1))
        get('#reorder').click()
        get('span:nth-of-type(1)').should(haveOgIndex(undefined))
        get('span:nth-of-type(2)').should(haveOgIndex(1))
        get('span:nth-of-type(3)').should(haveOgIndex(0))
        get('span:nth-of-type(4)').should(haveOgIndex(undefined))
    }
)

test('can key by index',
    html`
        <div x-data="{ items: ['foo', 'bar'] }">
            <button x-on:click="items = ['bar', 'foo', 'baz']" id="reorder">click me</button>
            <button x-on:click="$el.parentElement.querySelectorAll('span').forEach((el, index) => el.og_loop_index = index)" id="assign">click me</button>

            <template x-for="(item, index) in items" :key="index">
                <span x-text="item"></span>
            </template>
        </div>
    `,
    ({ get }) => {
        let haveOgIndex = index => el => expect(el[0].og_loop_index).to.equal(index)

        get('#assign').click()
        get('span:nth-of-type(1)').should(haveOgIndex(0))
        get('span:nth-of-type(2)').should(haveOgIndex(1))
        get('#reorder').click()
        get('span:nth-of-type(1)').should(haveOgIndex(0))
        get('span:nth-of-type(2)').should(haveOgIndex(1))
        get('span:nth-of-type(3)').should(haveOgIndex(undefined))
    }
)

test('can use index inside of loop',
    html`
        <div x-data="{ items: ['foo'] }">
            <template x-for="(item, index) in items">
                <div>
                    <h1 x-text="items.indexOf(item)"></h1>
                    <h2 x-text="index"></h2>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText(0))
        get('h2').should(haveText(0))
    }
)

test('can use third iterator param (collection) inside of loop',
    html`
        <div x-data="{ items: ['foo'] }">
            <template x-for="(item, index, things) in items">
                <div>
                    <h1 x-text="items"></h1>
                    <h2 x-text="things"></h2>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
    }
)

test('listeners in loop get fresh iteration data even though they are only registered initially',
    html`
        <div x-data="{ items: ['foo'], output: '' }">
            <button x-on:click="items = ['bar']">click me</button>

            <template x-for="(item, index) in items">
                <span x-text="item" x-on:click="output = item"></span>
            </template>

            <h1 x-text="output"></h1>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText(''))
        get('span').click()
        get('h1').should(haveText('foo'))
        get('button').click()
        get('span').click()
        get('h1').should(haveText('bar'))
    }
)

test('nested x-for',
    html`
        <div x-data="{ foos: [ {bars: ['bob', 'lob']} ] }">
            <button x-on:click="foos = [ {bars: ['bob', 'lob']}, {bars: ['law']} ]">click me</button>
            <template x-for="foo in foos">
                <h1>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="bar"></h2>
                    </template>
                </h1>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1:nth-of-type(1) h2:nth-of-type(1)').should(beVisible())
        get('h1:nth-of-type(1) h2:nth-of-type(2)').should(beVisible())
        get('h1:nth-of-type(2) h2:nth-of-type(1)').should(notBeVisible())
        get('button').click()
        get('h1:nth-of-type(1) h2:nth-of-type(1)').should(beVisible())
        get('h1:nth-of-type(1) h2:nth-of-type(2)').should(beVisible())
        get('h1:nth-of-type(2) h2:nth-of-type(1)').should(beVisible())
    }
)

test('x-for updates the right elements when new item are inserted at the beginning of the list',
    html`
        <div x-data="{ items: [{name: 'one', key: '1'}, {name: 'two', key: '2'}] }">
            <button x-on:click="items = [{name: 'zero', key: '0'}, {name: 'one', key: '1'}, {name: 'two', key: '2'}]">click me</button>

            <template x-for="item in items" :key="item.key">
                <span x-text="item.name"></span>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(haveText('one'))
        get('span:nth-of-type(2)').should(haveText('two'))
        get('button').click()
        get('span:nth-of-type(1)').should(haveText('zero'))
        get('span:nth-of-type(2)').should(haveText('one'))
        get('span:nth-of-type(3)').should(haveText('two'))
    }
)

test('nested x-for access outer loop variable',
    html`
        <div x-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
            <template x-for="foo in foos">
                <h1>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="foo.name+': '+bar"></h2>
                    </template>
                </h1>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1:nth-of-type(1) h2:nth-of-type(1)').should(haveText('foo: bob'))
        get('h1:nth-of-type(1) h2:nth-of-type(2)').should(haveText('foo: lob'))
        get('h1:nth-of-type(2) h2:nth-of-type(1)').should(haveText('baz: bab'))
        get('h1:nth-of-type(2) h2:nth-of-type(2)').should(haveText('baz: lab'))
    }
)

test('sibling x-for do not interact with each other',
    html`
        <div x-data="{ foos: [1], bars: [1, 2] }">
            <template x-for="foo in foos">
                <h1 x-text="foo"></h1>
            </template>
            <template x-for="bar in bars">
                <h2 x-text="bar"></h2>
            </template>
            <button @click="foos = [1, 2];bars = [1, 2, 3]">Change</button>
        </div>
    `,
    ({ get }) => {
        get('h1:nth-of-type(1)').should(haveText('1'))
        get('h2:nth-of-type(1)').should(haveText('1'))
        get('h2:nth-of-type(2)').should(haveText('2'))
        get('button').click()
        get('h1:nth-of-type(1)').should(haveText('1'))
        get('h1:nth-of-type(2)').should(haveText('2'))
        get('h2:nth-of-type(1)').should(haveText('1'))
        get('h2:nth-of-type(2)').should(haveText('2'))
        get('h2:nth-of-type(3)').should(haveText('3'))
    }
)

test('x-for over range using i in x syntax',
    html`
        <div x-data>
            <template x-for="i in 10">
                <span x-text="i"></span>
            </template>
        </div>
    `,
    ({ get }) => get('span').should(haveLength('10'))
)

test('x-for over range using i in property syntax',
    html`
        <div x-data="{ count: 10 }">
            <template x-for="i in count">
                <span x-text="i"></span>
            </template>
        </div>
    `,
    ({ get }) => get('span').should(haveLength('10'))
)

test.retry(2)('x-for with an array of numbers',
    `
        <div x-data="{ items: [] }">
            <template x-for="i in items">
                <span x-text="i"></span>
            </template>
            <button @click="items.push(2)" id="first">click me</button>
            <button @click="items.push(3)" id="second">click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveLength('0'))
        get('#first').click()
        get('span').should(haveLength('1'))
        get('#second').click()
        get('span').should(haveLength('2'))
    }
)

test('x-for works with undefined',
    `
        <div x-data="{ items: undefined }">
            <template x-for="i in items">
                <span x-text="i"></span>
            </template>
            <button @click="items = [2]" id="first">click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveLength('0'))
        get('#first').click()
        get('span').should(haveLength('1'))
    }
)

test('x-for works with variables that start with let',
    `
        <ul x-data="{ letters: ['a','b','c'] }">
          <template x-for="letter in letters">
            <li x-text="letter"></li>
          </template>
        </ul>
    `,
    ({ get }) => {
        get('li:nth-of-type(1)').should(haveText('a'))
        get('li:nth-of-type(2)').should(haveText('b'))
        get('li:nth-of-type(3)').should(haveText('c'))
    }
)

test('x-for works with variables that start with const',
    `
        <ul x-data="{ constants: ['a','b','c'] }">
          <template x-for="constant in constants">
            <li x-text="constant"></li>
          </template>
        </ul>
    `,
    ({ get }) => {
        get('li:nth-of-type(1)').should(haveText('a'))
        get('li:nth-of-type(2)').should(haveText('b'))
        get('li:nth-of-type(3)').should(haveText('c'))
    }
)

test('renders children in the right order when combined with x-if',
    html`
        <div x-data="{ items: ['foo', 'bar'] }">
            <template x-for="item in items">
                <template x-if="true">
                    <span x-text="item"></span>
                </template>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(haveText('foo'))
        get('span:nth-of-type(2)').should(haveText('bar'))
    }
)

test('correctly renders x-if children when reordered',
    html`
        <div x-data="{ items: ['foo', 'bar'] }">
            <button @click="items = ['bar', 'foo']">click me</button>
            <button @click="items = ['bar', 'baz', 'foo']">click me</button>
            <button @click="items = ['baz', 'foo']">click me</button>
            <template x-for="item in items" :key="item">
                <template x-if="true">
                    <span x-text="item"></span>
                </template>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(haveText('foo'))
        get('span:nth-of-type(2)').should(haveText('bar'))
        get('button:nth-of-type(1)').click()
        get('span').should(haveLength('2'))
        get('span:nth-of-type(1)').should(haveText('bar'))
        get('span:nth-of-type(2)').should(haveText('foo'))
        get('button:nth-of-type(2)').click()
        get('span').should(haveLength('3'))
        get('span:nth-of-type(1)').should(haveText('bar'))
        get('span:nth-of-type(2)').should(haveText('baz'))
        get('span:nth-of-type(3)').should(haveText('foo'))
        get('button:nth-of-type(3)').click()
        get('span').should(haveLength('2'))
        get('span:nth-of-type(1)').should(haveText('baz'))
        get('span:nth-of-type(2)').should(haveText('foo'))
    }
)
