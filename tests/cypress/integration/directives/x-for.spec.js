import { exist, haveLength, haveText, html, notExist, test } from '../../utils'

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
        get('span:nth-of-type(2)').should(notExist())
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
        get('#1 span:nth-of-type(2)').should(notExist())
        get('#2 span:nth-of-type(1)').should(haveText('foo'))
        get('#2 span:nth-of-type(2)').should(notExist())
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
        get('span').should(exist())
        get('button').click()
        get('span').should(notExist())
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
        get('span:nth-of-type(1)').should(exist())
        get('span:nth-of-type(2)').should(exist())
        get('span:nth-of-type(3)').should(exist())
        get('button').click()
        get('span:nth-of-type(1)').should(notExist())
        get('span:nth-of-type(2)').should(notExist())
        get('span:nth-of-type(3)').should(notExist())
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
        get('span').should(exist())
        get('h1').should(haveText('first'))
        get('h2').should(haveText('bar'))
        get('button').click()
        get('span').should(exist())
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
        get('h1:nth-of-type(1) h2:nth-of-type(1)').should(exist())
        get('h1:nth-of-type(1) h2:nth-of-type(2)').should(exist())
        get('h1:nth-of-type(2) h2:nth-of-type(1)').should(notExist())
        get('button').click()
        get('h1:nth-of-type(1) h2:nth-of-type(1)').should(exist())
        get('h1:nth-of-type(1) h2:nth-of-type(2)').should(exist())
        get('h1:nth-of-type(2) h2:nth-of-type(1)').should(exist())
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
//If an x-for element is removed from DOM, expectation is that the removed DOM element will not have any of its reactive expressions evaluated after removal.
test('x-for removed dom node does not evaluate child expressions after being removed',
    html`
        <div x-data="{ users: [{ name: 'lebowski' }] }">
            <template x-for="(user, idx) in users">
                <span x-text="users[idx].name"></span>
            </template>
            <button @click="users = []">Reset</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('lebowski'))

        /** Clicking button sets users=[] and thus x-for loop will remove all children.
            If the sub-expression x-text="users[idx].name" is evaluated, the button click
            will produce an error because users[idx] is no longer defined and the test will fail
        **/
        get('button').click()
        get('span').should('not.exist')
    }
)

test('renders children using directives injected by x-html correctly',
    html`
        <div x-data="{foo: 'bar'}">
            <template x-for="i in 2">
                <p x-html="'<span x-text=&quot;foo&quot;></span>'"></p>
            </template>
        </div>
    `,
    ({ get }) => {
        get('p:nth-of-type(1) span').should(haveText('bar'))
        get('p:nth-of-type(2) span').should(haveText('bar'))
    }
)

test(
    'handles x-data directly inside x-for',
    html`
        <div x-data="{ items: [{x:0, k:1},{x:1, k:2}] }">
            <button x-on:click="items = [{x:3, k:1},{x:4, k:2}]">update</button>
            <template x-for="item in items" :key="item.k">
                <div :id="'item-' + item.k" x-data="{ inner: true }">
                    <span x-text="item.x.toString()"></span>:
                    <span x-text="item.k"></span>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('#item-1 span:nth-of-type(1)').should(haveText('0'))
        get('#item-2 span:nth-of-type(1)').should(haveText('1'))
        get('button').click()
        get('#item-1 span:nth-of-type(1)').should(haveText('3'))
        get('#item-2 span:nth-of-type(1)').should(haveText('4'))
})

test('x-for throws descriptive error when key is undefined',
    html`
        <div x-data="{ items: [
            {
                id: 1,
                name: 'foo',
            },
            {
                id: 2,
                name: 'bar',
            },
            {
                id: 3,
                name: 'baz',
            },
        ]}">
            <template x-for="item in items" :key="item.doesntExist">
                <span x-text="i"></span>
            </template>
        </div>
    `,
    ({ get }) => {},
    true
)

test('iterates over a Set',
    html`
        <div x-data="{ items: new Set(['foo', 'bar']) }">
            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(haveText('foo'))
        get('span:nth-of-type(2)').should(haveText('bar'))
    }
)

test('iterates over a Map',
    html`
        <div x-data="{ items: new Map([['a', 'foo'], ['b', 'bar']]) }">
            <template x-for="[key, value] in items">
                <span x-text="key + ':' + value"></span>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(haveText('a:foo'))
        get('span:nth-of-type(2)').should(haveText('b:bar'))
    }
)

// If x-for removes a child, all cleanups in the tree should be handled.
test('x-for eagerly cleans tree',
    html`
        <div x-data="{ show: 0, counts: [0,0,0], items: [0,1,2] }">
            <button
                id="toggle"
                @click="show^=true"
                x-text="counts.reduce((a,b)=>a+b)">
                Toggle
            </button>
            <button id="remove" @click="items.pop()">Remove</button>
            <template x-for="num in items" :key="num">
                <div>
                <template x-for="n in show">
                    <p x-effect="if (show) counts[num]++">hello</p>
                </template>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('#toggle').should(haveText('0'))
        get('#toggle').click()
        get('#toggle').should(haveText('3'))
        get('#toggle').click()
        get('#toggle').should(haveText('3'))
        get('#toggle').click()
        get('#toggle').should(haveText('6'))
        get('#remove').click()
        get('#toggle').should(haveText('6'))
        get('#toggle').click()
        get('#toggle').should(haveText('6'))
        get('#toggle').click()
        get('#toggle').should(haveText('8'))
    }
)

// To support rerendering alongside x-sort
test('x-for handles moved elements correctly',
    html`
        <div x-data="{ items: [1,2,3] }">
            <button
                id="swap"
                @click="items.splice(0,0,...items.splice(1,1))">
                Swap first 2
            </button>
            <button id="move"
                @click="document.querySelector('[data-num]:nth-of-type(1)').before(document.querySelector('[data-num]:nth-of-type(2)'))">
                Move elements
            </button>
            <template x-for="num in items" :key="num">
                <div :data-num=num x-text="num"></div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('[data-num]:nth-of-type(1)').should(haveText('1'))
        get('[data-num]:nth-of-type(2)').should(haveText('2'))
        get('[data-num]:nth-of-type(3)').should(haveText('3'))
        get('button#move').click()
        get('[data-num]:nth-of-type(1)').should(haveText('2'))
        get('[data-num]:nth-of-type(2)').should(haveText('1'))
        get('[data-num]:nth-of-type(3)').should(haveText('3'))
        get('button#swap').click()
        get('[data-num]:nth-of-type(1)').should(haveText('2'))
        get('[data-num]:nth-of-type(2)').should(haveText('1'))
        get('[data-num]:nth-of-type(3)').should(haveText('3'))
    }
)
