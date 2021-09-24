import { beChecked, notBeChecked, haveAttribute, haveData, haveText, test, beVisible, notBeVisible, html } from '../../utils'

test('data modified in event listener updates affected attribute bindings',
    html`
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>

            <span x-bind:foo="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('foo', 'bar'))
        get('button').click()
        get('span').should(haveAttribute('foo', 'baz'))
    }
)

test('can call a method without parenthesis',
    html`
        <div x-data="{ foo: 'bar', baz($event) { this.foo = $event.target.dataset.bob } }">
            <button x-on:click="baz" data-bob="lob"></button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('lob'))
    }
)

test('event object is not passed if other params are present',
    html`
        <div x-data="{ foo: 'bar', baz(word) { this.foo = word } }">
            <button x-on:click="baz('foo')" data-bob="lob"></button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('foo'))
    }
)

test('nested data modified in event listener updates affected attribute bindings',
    html`
        <div x-data="{ nested: { foo: 'bar' } }">
            <button x-on:click="nested.foo = 'baz'"></button>

            <span x-bind:foo="nested.foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('foo', 'bar'))
        get('button').click()
        get('span').should(haveAttribute('foo', 'baz'))
    }
)

test('.passive modifier should disable e.preventDefault()',
    html`
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
    `,
    ({ get }) => {
        get('button').click()
        get('div').should(haveData('defaultPrevented', false))
    }
)

test('.stop modifier',
    html`
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'">
                <h1>h1</h1>
                <h2 @click.stop>h2</h2>
            </button>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', 'bar'))
        get('h2').click()
        get('div').should(haveData('foo', 'bar'))
        get('h1').click()
        get('div').should(haveData('foo', 'baz'))
    }
)

test.only('.capture modifier',
    html`
        <div x-data="{ foo: 'bar' }">
            <button @click.capture="foo = 'baz'">
                <h1>h1</h1>
                <h2 @click="foo = 'bob'">h2</h2>
            </button>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', 'bar'))
        get('h2').click()
        get('div').should(haveData('foo', 'bob'))
    }
)

test('.self modifier',
    html`
        <div x-data="{ foo: 'bar' }">
            <h1 x-on:click.self="foo = 'baz'" id="selfTarget">
                content
                <button>click</button>
                content
            </h1>
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('bar'))
        get('h1').click()
        get('span').should(haveText('baz'))
    }
)

test('.prevent modifier',
    html`
        <div x-data="{}">
            <input type="checkbox" x-on:click.prevent>
        </div>
    `,
    ({ get }) => {
        get('input').check()
        get('input').should(notBeChecked())
    }
)

test('.window modifier',
    html`
        <div x-data="{ foo: 'bar' }">
            <div x-on:click.window="foo = 'baz'"></div>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('span').click()
        get('span').should(haveText('baz'))
    }
)

test('expressions can start with if',
    html`
        <div x-data="{ foo: 'bar' }">
            <button @click="if (foo === 'bar') foo = 'baz'">click</button>
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('unbind global event handler when element is removed',
    html`
        <div x-data="{ count: 0 }">
            <div x-on:click.window="count++" x-ref="rmMe"></div>

            <button @click="$refs.rmMe.remove()">click</button>
            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('span').click()
        get('span').should(haveText('1'))
    }
)

test('.document modifier',
    html`
       <div x-data="{ foo: 'bar' }">
            <div x-on:click.document="foo = 'baz'"></div>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('span').click()
        get('span').should(haveText('baz'))
    }
)

test('.once modifier',
    html`
        <div x-data="{ count: 0 }">
            <button x-on:click.once="count = count+1"></button>

            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('button').click()
        get('span').should(haveText('1'))
        get('button').click()
        get('span').should(haveText('1'))
    }
)

test('.once modifier with @keyup',
    html`
        <div x-data="{ count: 0 }">
            <input type="text" x-on:keyup.once="count = count+1">

            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('input').type('f')
        get('span').should(haveText('1'))
        get('input').type('o')
        get('span').should(haveText('1'))
    }
)

test('.debounce modifier',
    html`
        <div x-data="{ count: 0 }">
            <input x-on:input.debounce="count = count+1">

            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('input').type('f')
        get('span').should(haveText('1'))
        get('input').type('ffffffffffff')
        get('span').should(haveText('2'))
    }
)

test('keydown modifiers',
    html`
        <div x-data="{ count: 0 }">
            <input type="text"
                x-on:keydown="count++"
                x-on:keydown.enter="count++"
                x-on:keydown.space="count++"
                x-on:keydown.up="count++"
                x-on:keydown.down="count++"
                x-on:keydown.right="count++"
                x-on:keydown.left="count++"
                x-on:keydown.cmd="count++"
                x-on:keydown.meta="count++"
                x-on:keydown.escape="count++"
                x-on:keydown.esc="count++"
                x-on:keydown.ctrl="count++"
                x-on:keydown.slash="count++"
                x-on:keydown.period="count++"
                x-on:keydown.equal="count++"
            >

            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('input').type('f')
        get('span').should(haveText('1'))
        get('input').type('{enter}')
        get('span').should(haveText('3'))
        get('input').type(' ')
        get('span').should(haveText('5'))
        get('input').type('{leftarrow}')
        get('span').should(haveText('7'))
        get('input').type('{rightarrow}')
        get('span').should(haveText('9'))
        get('input').type('{uparrow}')
        get('span').should(haveText('11'))
        get('input').type('{downarrow}')
        get('span').should(haveText('13'))
        get('input').type('{meta}')
        get('span').should(haveText('16'))
        get('input').type('{esc}')
        get('span').should(haveText('19'))
        get('input').type('{ctrl}')
        get('span').should(haveText('21'))
        get('input').type('/')
        get('span').should(haveText('23'))
        get('input').type('=')
        get('span').should(haveText('25'))
        get('input').type('.')
        get('span').should(haveText('27'))
    }
)

test('keydown combo modifiers',
    html`
        <div x-data="{ count: 0 }">
            <input type="text" x-on:keydown.cmd.enter="count++">

            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('input').type('f')
        get('span').should(haveText('0'))
        get('input').type('{cmd}{enter}')
        get('span').should(haveText('1'))
    }
)

test('keydown with specified key and stop modifier only stops for specified key',
    html`
        <div x-data="{ count: 0 }">
            <article x-on:keydown="count++">
                <input type="text" x-on:keydown.enter.stop>
            </article>

            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('input').type('f')
        get('span').should(haveText('1'))
        get('input').type('{enter}')
        get('span').should(haveText('1'))
    }
)

test('@click.away',
    html`
        <div x-data="{ foo: 'bar' }">
            <h1 @click.away="foo = 'baz'">h1</h1>

            <h2>h2</h2>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('h1').click()
        get('span').should(haveText('bar'))
        get('h2').click()
        get('span').should(haveText('baz'))
    }
)

test('@click.away with x-show (prevent race condition)',
    html`
        <div x-data="{ show: false }">
            <button @click="show = true">Show</button>

            <h1 x-show="show" @click.away="show = false">h1</h1>

            <h2>h2</h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(notBeVisible())
        get('button').click()
        get('h1').should(beVisible())
    }
)

test('event with colon',
    html`
        <div x-data="{ foo: 'bar' }">
            <div x-on:my:event.document="foo = 'baz'"></div>

            <button @click="document.dispatchEvent(new CustomEvent('my:event', { bubbles: true }))">click</button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('event instance can be passed to method reference',
    html`
        <div x-data="{ foo: 'bar', changeFoo(e) { this.foo = e.target.id } }">
            <button x-on:click="changeFoo" id="baz"></button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('.camel modifier correctly binds event listener',
    html`
        <div x-data="{ foo: 'bar' }" x-on:event-name.camel="foo = 'baz'">
            <button x-on:click="$dispatch('eventName')"></button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('.camel modifier correctly binds event listener with namespace',
    html`
        <div x-data="{ foo: 'bar' }" x-on:ns:event-name.camel="foo = 'baz'">
            <button x-on:click="$dispatch('ns:eventName')"></button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('.dot modifier correctly binds event listener',
    html`
        <div x-data="{ foo: 'bar' }" x-on:event-name.dot="foo = 'baz'">
            <button x-on:click="$dispatch('event.name')"></button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('.dot modifier correctly binds event listener with namespace',
    html`
        <div x-data="{ foo: 'bar' }" x-on:ns:event-name.dot="foo = 'baz'">
            <button x-on:click="$dispatch('ns:event.name')"></button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)
