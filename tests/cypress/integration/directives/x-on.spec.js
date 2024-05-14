import { beChecked, contain, notBeChecked, haveAttribute, haveData, haveText, test, beVisible, notBeVisible, html } from '../../utils'

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


test('.stop modifier with a .throttle',
    html`
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'">
                <h1>h1</h1>
                <h2 @click.stop.throttle>h2</h2>
            </button>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', 'bar'))
        get('h2').click()
        get('h2').click()
        get('div').should(haveData('foo', 'bar'))
        get('h1').click()
        get('div').should(haveData('foo', 'baz'))
    }
)

test('.capture modifier',
    html`
        <div x-data="{ foo: 'bar', count: 0 }">
            <button @click.capture="count = count + 1; foo = 'baz'">
                <h1>h1</h1>
                <h2 @click="foo = 'bob'">h2</h2>
            </button>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', 'bar'))
        get('h2').click()
        get('div').should(haveData('foo', 'bob'))
        get('div').should(haveData('count', 1))
    }
)

test('.capture modifier with @keyup',
    html`
        <div x-data="{ foo: 'bar', count: 0 }">
            <span @keyup.capture="count = count + 1; foo = 'span'">
                <input type="text" @keyup="foo = 'input'">
            </span>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', 'bar'))
        get('input').type('f')
        get('div').should(haveData('foo', 'input'))
        get('div').should(haveData('count', 1))
    }
)

test('.capture modifier with @keyup and specified key',
    html`
        <div x-data="{ foo: 'bar', count: 0 }">
            <span @keyup.enter.capture="count = count + 1; foo = 'span'">
                <input type="text" @keyup.enter="foo = 'input'">
            </span>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', 'bar'))
        get('input').type('{enter}')
        get('div').should(haveData('foo', 'input'))
        get('div').should(haveData('count', 1))
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

test(
    ".self.once modifiers",
    html`
        <div x-data="{ foo: 'bar' }">
            <h1 x-on:click.self.once="foo = 'baz'" id="selfTarget">
                content
                <button>click</button>
                content
            </h1>
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get("span").should(haveText("bar"));
        get("button").click();
        get("span").should(haveText("bar"));
        get("h1").click();
        get("span").should(haveText("baz"));
    }
);

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

test('.prevent modifier with a .debounce',
    html`
        <div x-data="{}">
            <input type="checkbox" x-on:click.prevent.debounce>
        </div>
    `,
    ({ get }) => {
        get('input').check()
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

test('.once modifier with @keyup and specified key',
    html`
        <div x-data="{ count: 0 }">
            <input type="text" x-on:keyup.enter.once="count = count+1">

            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('input').type('f')
        get('span').should(haveText('0'))
        get('input').type('{enter}')
        get('span').should(haveText('1'))
        get('input').type('{enter}')
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

test('.throttle modifier',
    html`
        <div x-data="{ count: 0 }">
            <input x-on:keyup.throttle.504ms="count = count+1">
            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('0'))
        get('input').type('f')
        get('span').should(haveText('1'))
        get('input').type('ffffffffffff')
        get('span').should(haveText('1'))
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
                x-on:keydown.comma="count++"
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
        get('input').type(',')
        get('span').should(haveText('29'))
    }
)

test('discerns between space minus underscore',
    html`
        <div x-data="{ count: 0 }">
            <input id="space" type="text" x-on:keydown.space="count++" />
            <input id="minus" type="text" x-on:keydown.-="count++" />
            <input id="underscore" type="text" x-on:keydown._="count++" />
            <span x-text="count"></span>
        </div>
    `,
    ({get}) => {
        get('span').should(haveText('0'))
        get('#space').type(' ')
        get('span').should(haveText('1'))
        get('#space').type('-')
        get('span').should(haveText('1'))
        get('#minus').type('-')
        get('span').should(haveText('2'))
        get('#minus').type(' ')
        get('span').should(haveText('2'))
        get('#underscore').type('_')
        get('span').should(haveText('3'))
        get('#underscore').type(' ')
        get('span').should(haveText('3'))
    })

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

test('@click.away.once works after clicking inside',
    html`
        <div x-data="{ foo: 'bar' }">
            <h1 @click.away.once="foo = 'baz'">h1</h1>

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
test('underscores are allowed in event names',
    html`
        <div x-data="{ foo: 'bar' }" x-on:event_name="foo = 'baz'">
            <button x-on:click="$dispatch('event_name')"></button>

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

test('handles await in handlers with invalid right hand expressions',
    html`
        <div x-data="{ text: 'original' }">
            <button @click="let value = 'new string'; text = await Promise.resolve(value)"></button>
            <span x-text="text"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('original'))
        get('button').click()
        get('span').should(haveText('new string'))
    }
)

test(
    "handles system modifier keys on key events",
    html`
        <div x-data="{ keys: {
            shift: false,
            ctrl: false,
            meta: false,
            alt: false,
            cmd: false
        } }">
            <input type="text"
                @keydown.capture="Object.keys(keys).forEach(key => keys[key] = false)"
                @keydown.meta.space="keys.meta = true"
                @keydown.ctrl.space="keys.ctrl = true"
                @keydown.shift.space="keys.shift = true"
                @keydown.alt.space="keys.alt = true"
                @keydown.cmd.space="keys.cmd = true"
            />
            <template x-for="key in Object.keys(keys)" :key="key">
                <input type="checkbox" :name="key" x-model="keys[key]">
            </template>
        </div>
    `,({ get }) => {
        get("input[name=shift]").as('shift').should(notBeChecked());
        get("input[name=ctrl]").as('ctrl').should(notBeChecked());
        get("input[name=meta]").as('meta').should(notBeChecked());
        get("input[name=alt]").as('alt').should(notBeChecked());
        get("input[name=cmd]").as('cmd').should(notBeChecked());
        get("input[type=text]").as('input').trigger("keydown", { key: 'space', shiftKey: true });
        get('@shift').should(beChecked());
        get("@input").trigger("keydown", { key: 'space', ctrlKey: true });
        get("@shift").should(notBeChecked());
        get("@ctrl").should(beChecked());
        get("@input").trigger("keydown", { key: 'space', metaKey: true });
        get("@ctrl").should(notBeChecked());
        get("@meta").should(beChecked());
        get("@cmd").should(beChecked());
        get("@input").trigger("keydown", { key: 'space', altKey: true });
        get("@meta").should(notBeChecked());
        get("@cmd").should(notBeChecked());
        get("@alt").should(beChecked());
        get("@input").trigger("keydown", { key: 'space' });
        get("@alt").should(notBeChecked());
        get("@input").trigger("keydown", { key: 'space',
        ctrlKey: true, shiftKey: true, metaKey: true, altKey: true });
        get("input[name=shift]").as("shift").should(beChecked());
        get("input[name=ctrl]").as("ctrl").should(beChecked());
        get("input[name=meta]").as("meta").should(beChecked());
        get("input[name=alt]").as("alt").should(beChecked());
        get("input[name=cmd]").as("cmd").should(beChecked());
    }
);

test(
    "handles system modifier keys on mouse events",
    html`
        <div x-data="{ keys: {
            shift: false,
            ctrl: false,
            meta: false,
            alt: false,
            cmd: false
        } }">
            <button type=button
                @click.capture="Object.keys(keys).forEach(key => keys[key] = false)"
                @click.shift="keys.shift = true"
                @click.ctrl="keys.ctrl = true"
                @click.meta="keys.meta = true"
                @click.alt="keys.alt = true"
                @click.cmd="keys.cmd = true">
                    change
            </button>
            <template x-for="key in Object.keys(keys)" :key="key">
                <input type="checkbox" :name="key" x-model="keys[key]">
            </template>
        </div>
    `,({ get }) => {
        get("input[name=shift]").as('shift').should(notBeChecked());
        get("input[name=ctrl]").as('ctrl').should(notBeChecked());
        get("input[name=meta]").as('meta').should(notBeChecked());
        get("input[name=alt]").as('alt').should(notBeChecked());
        get("input[name=cmd]").as('cmd').should(notBeChecked());
        get("button").as('button').trigger("click", { shiftKey: true });
        get('@shift').should(beChecked());
        get("@button").trigger("click", { ctrlKey: true });
        get("@shift").should(notBeChecked());
        get("@ctrl").should(beChecked());
        get("@button").trigger("click", { metaKey: true });
        get("@ctrl").should(notBeChecked());
        get("@meta").should(beChecked());
        get("@cmd").should(beChecked());
        get("@button").trigger("click", { altKey: true });
        get("@meta").should(notBeChecked());
        get("@cmd").should(notBeChecked());
        get("@alt").should(beChecked());
        get("@button").trigger("click", {});
        get("@alt").should(notBeChecked());
        get("@button").trigger("click", { ctrlKey: true, shiftKey: true, metaKey: true, altKey: true });
        get("@shift").as("shift").should(beChecked());
        get("@ctrl").as("ctrl").should(beChecked());
        get("@meta").as("meta").should(beChecked());
        get("@alt").as("alt").should(beChecked());
        get("@cmd").as("cmd").should(beChecked());
    }
);

test(
    "handles all mouse events with modifiers",
    html`
        <div x-data="{ keys: {
            shift: false,
            ctrl: false,
            meta: false,
            alt: false,
            cmd: false
        } }">
            <button type=button
                @click.capture="Object.keys(keys).forEach(key => keys[key] = false)"
                @contextmenu.prevent.shift="keys.shift = true"
                @auxclick.ctrl="keys.ctrl = true"
                @dblclick.meta="keys.meta = true"
                @mouseenter.alt="keys.alt = true"
                @mousemove.cmd="keys.cmd = true">
                    change
            </button>
            <template x-for="key in Object.keys(keys)" :key="key">
                <input type="checkbox" :name="key" x-model="keys[key]">
            </template>
        </div>
    `,({ get }) => {
        get("input[name=shift]").as('shift').should(notBeChecked());
        get("input[name=ctrl]").as('ctrl').should(notBeChecked());
        get("input[name=meta]").as('meta').should(notBeChecked());
        get("input[name=alt]").as('alt').should(notBeChecked());
        get("input[name=cmd]").as('cmd').should(notBeChecked());
        get("button").as('button').trigger("contextmenu", { shiftKey: true });
        get('@shift').should(beChecked());
        get("@button").trigger("click");
        get("@button").trigger("auxclick", { ctrlKey: true });
        get("@shift").should(notBeChecked());
        get("@ctrl").should(beChecked());
        get("@button").trigger("click");
        get("@button").trigger("dblclick", { metaKey: true });
        get("@ctrl").should(notBeChecked());
        get("@meta").should(beChecked());
        get("@button").trigger("click");
        get("@button").trigger("mouseenter", { altKey: true });
        get("@meta").should(notBeChecked());
        get("@alt").should(beChecked());
        get("@button").trigger("click");
        get("@button").trigger("mousemove", { metaKey: true });
        get("@alt").should(notBeChecked());
        get("@cmd").should(beChecked());
    }
);
