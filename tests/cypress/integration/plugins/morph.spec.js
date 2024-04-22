import { haveAttribute, haveLength, haveText, haveValue, haveHtml, html, test } from '../../utils'

test('can morph components and preserve Alpine state',
    [html`
        <div x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'">Change Foo</button>
            <span x-text="foo"></span>
        </div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = document.querySelector('div').outerHTML

        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('span').should(haveText('baz'))
    },
)

test('morphing target uses outer Alpine scope',
    [html`
        <article x-data="{ foo: 'bar' }">
            <div>
                <button @click="foo = 'baz'">Change Foo</button>
                <span x-text="foo"></span>
            </div>
        </article>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = document.querySelector('div').outerHTML

        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('span').should(haveText('baz'))
    },
)

test('can morph with HTML change and preserve Alpine state',
    [html`
        <div x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'">Change Foo</button>
            <span x-text="foo"></span>
        </div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = document.querySelector('div').outerHTML.replace('Change Foo', 'Changed Foo')

        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
        get('button').should(haveText('Change Foo'))

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('span').should(haveText('baz'))
        get('button').should(haveText('Changed Foo'))
    },
)

test('morphing an element with multiple nested Alpine components preserves scope',
    [html`
        <div x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'">Change Foo</button>
            <span x-text="foo"></span>

            <div x-data="{ bob: 'lob' }">
                <a href="#" @click.prevent="bob = 'law'">Change Bob</a>
                <h1 x-text="bob"></h1>
            </div>
        </div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = document.querySelector('div').outerHTML

        get('span').should(haveText('bar'))
        get('h1').should(haveText('lob'))
        get('button').click()
        get('a').click()
        get('span').should(haveText('baz'))
        get('h1').should(haveText('law'))

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('span').should(haveText('baz'))
        get('h1').should(haveText('law'))
    },
)

test('can morph teleports',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-teleport="#b">
                <div>
                    <h1 x-text="count"></h1>
                    <h2>hey</h2>
                </div>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-teleport="#b">
                <div>
                    <h1 x-text="count"></h1>
                    <h2>there</h2>
                </div>
            </template>
        </div>
        `
        get('h1').should(haveText('1'))
        get('h2').should(haveText('hey'))
        get('button').click()
        get('h1').should(haveText('2'))
        get('h2').should(haveText('hey'))

        get('div#a').then(([el]) => window.Alpine.morph(el, toHtml))

        get('h1').should(haveText('2'))
        get('h2').should(haveText('there'))
    },
)

test('can morph teleports in different places with IDs',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-teleport="#b" id="template">
                <div>
                    <h1 x-text="count"></h1>
                    <h2>hey</h2>
                </div>
            </template>

            <div>moving placeholder</div>
        </div>

        <div id="b"></div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <div>moving placeholder</div>

            <template x-teleport="#b" id="template">
                <div>
                    <h1 x-text="count"></h1>
                    <h2>there</h2>
                </div>
            </template>
        </div>
        `
        get('h1').should(haveText('1'))
        get('h2').should(haveText('hey'))
        get('button').click()
        get('h1').should(haveText('2'))
        get('h2').should(haveText('hey'))

        get('div#a').then(([el]) => window.Alpine.morph(el, toHtml))

        get('h1').should(haveText('2'))
        get('h2').should(haveText('there'))
    },
)

test('can morph',
    [html`
        <ul>
            <li>foo<input></li>
        </ul>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
            <ul>
                <li>bar<input></li>
                <li>foo<input></li>
            </ul>
        `

        get('input').type('foo')

        get('ul').then(([el]) => window.Alpine.morph(el, toHtml))

        get('li').should(haveLength(2))
        get('li:nth-of-type(1)').should(haveText('bar'))
        get('li:nth-of-type(2)').should(haveText('foo'))
        get('li:nth-of-type(1) input').should(haveValue('foo'))
        get('li:nth-of-type(2) input').should(haveValue(''))
    },
)

test('can morph using lookahead',
    [html`
        <ul>
            <li>foo<input></li>
        </ul>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
            <ul>
                <li>bar<input></li>
                <li>baz<input></li>
                <li>foo<input></li>
            </ul>
        `

        get('input').type('foo')

        get('ul').then(([el]) => window.Alpine.morph(el, toHtml, {lookahead: true}))

        get('li').should(haveLength(3))
        get('li:nth-of-type(1)').should(haveText('bar'))
        get('li:nth-of-type(2)').should(haveText('baz'))
        get('li:nth-of-type(3)').should(haveText('foo'))
        get('li:nth-of-type(1) input').should(haveValue(''))
        get('li:nth-of-type(2) input').should(haveValue(''))
        get('li:nth-of-type(3) input').should(haveValue('foo'))
    },
)

test('can morph using keys',
    [html`
        <ul>
            <li key="1">foo<input></li>
        </ul>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
            <ul>
                <li key="2">bar<input></li>
                <li key="3">baz<input></li>
                <li key="1">foo<input></li>
            </ul>
        `

        get('input').type('foo')

        get('ul').then(([el]) => window.Alpine.morph(el, toHtml))

        get('li').should(haveLength(3))
        get('li:nth-of-type(1)').should(haveText('bar'))
        get('li:nth-of-type(2)').should(haveText('baz'))
        get('li:nth-of-type(3)').should(haveText('foo'))
        get('li:nth-of-type(1) input').should(haveValue(''))
        get('li:nth-of-type(2) input').should(haveValue(''))
        get('li:nth-of-type(3) input').should(haveValue('foo'))
    },
)

test('can morph using a custom key function',
    [html`
        <ul>
            <li data-key="1">foo<input></li>
        </ul>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
            <ul>
                <li data-key="2">bar<input></li>
                <li data-key="3">baz<input></li>
                <li data-key="1">foo<input></li>
            </ul>
        `

        get('input').type('foo')

        get('ul').then(([el]) => window.Alpine.morph(el, toHtml, {key(el) {return el.dataset.key}}))

        get('li').should(haveLength(3))
        get('li:nth-of-type(1)').should(haveText('bar'))
        get('li:nth-of-type(2)').should(haveText('baz'))
        get('li:nth-of-type(3)').should(haveText('foo'))
        get('li:nth-of-type(1) input').should(haveValue(''))
        get('li:nth-of-type(2) input').should(haveValue(''))
        get('li:nth-of-type(3) input').should(haveValue('foo'))
    },
)

test('can morph using keys with existing key to be moved up',
    [html`
        <ul>
            <li key="1">foo<input></li>
            <li key="2">bar<input></li>
            <li key="3">baz<input></li>
        </ul>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
            <ul>
                <li key="1">foo<input></li>
                <li key="3">baz<input></li>
            </ul>
        `

        get('li:nth-of-type(1) input').type('foo')
        get('li:nth-of-type(3) input').type('baz')

        get('ul').then(([el]) => window.Alpine.morph(el, toHtml))

        get('li').should(haveLength(2))
        get('li:nth-of-type(1)').should(haveText('foo'))
        get('li:nth-of-type(2)').should(haveText('baz'))
        get('li:nth-of-type(1) input').should(haveValue('foo'))
        get('li:nth-of-type(2) input').should(haveValue('baz'))
    },
)

test('can morph text nodes',
    [html`<h2>Foo <br> Bar</h2>`],
    ({ get }, reload, window, document) => {
        let toHtml = html`<h2>Foo <br> Baz</h2>`
        get('h2').then(([el]) => window.Alpine.morph(el, toHtml))
        get('h2').should(haveHtml('Foo <br> Baz'))
    },
)

test('can morph with added element before and siblings are different',
    [html`
        <button>
            <div>
                <div>second</div>
                <div data="false">third</div>
            </div>
        </button>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <button>
            <div>first</div>
            <div>
                <div>second</div>
                <div data="true">third</div>
            </div>
        </button>
        `

        get('button').then(([el]) => window.Alpine.morph(el, toHtml))

        get('button > div').should(haveLength(2))
        get('button > div:nth-of-type(1)').should(haveText('first'))
        get('button > div:nth-of-type(2)').should(haveHtml(`
                <div>second</div>
                <div data="true">third</div>
            `))
    },
)

test('can morph using different keys',
    [html`
        <ul>
            <li key="1">foo</li>
        </ul>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
            <ul>
                <li key="2">bar</li>
            </ul>
        `

        get('ul').then(([el]) => window.Alpine.morph(el, toHtml))

        get('li').should(haveLength(1))
        get('li:nth-of-type(1)').should(haveText('bar'))
        get('li:nth-of-type(1)').should(haveAttribute('key', '2'))
    },
)

test('can morph elements with dynamic ids',
    [html`
        <ul>
            <li x-data x-bind:id="'1'" >foo<input></li>
        </ul>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
            <ul>
                <li x-data x-bind:id="'1'" >foo<input></li>
            </ul>
        `

        get('input').type('foo')

        get('ul').then(([el]) => window.Alpine.morph(el, toHtml, {
            key(el) { return el.id }
        }))

        get('li:nth-of-type(1) input').should(haveValue('foo'))
    },
)

test('can morph different inline nodes',
    [html`
    <div id="from">
        Hello <span>World</span>
    </div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <div id="to">
            Welcome <b>Person</b>!
        </div>
        `

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('div').should(haveHtml('\n            Welcome <b>Person</b>!\n        '))
    },
)

test('can morph multiple nodes',
    [html`
        <div x-data>
            <p></p>
            <p></p>
        </div>
    `],
    ({ get }, reload, window, document) => {
        let paragraphs = document.querySelectorAll('p')
        window.Alpine.morph(paragraphs[0], '<p>1</p')
        window.Alpine.morph(paragraphs[1], '<p>2</p')
        get('p:nth-of-type(1)').should(haveText('1'))
        get('p:nth-of-type(2)').should(haveText('2'))
    },
)

test('can morph table tr',
    [html`
        <table>
            <tr><td>1</td></tr>
        </table>
    `],
    ({ get }, reload, window, document) => {
        let tr = document.querySelector('tr')
        window.Alpine.morph(tr, '<tr><td>2</td></tr>')
        get('td').should(haveText('2'))
    },
)

test('can morph with conditional markers',
    [html`
        <main>
            <!--[if BLOCK]><![endif]-->
            <div>foo<input></div>
            <!--[if ENDBLOCK]><![endif]-->
            <div>bar<input></div>
        </main>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <main>
            <!--[if BLOCK]><![endif]-->
            <div>foo<input></div>
            <div>baz<input></div>
            <!--[if ENDBLOCK]><![endif]-->
            <div>bar<input></div>
        </main>
        `

        get('div:nth-of-type(1) input').type('foo')
        get('div:nth-of-type(2) input').type('bar')

        get('main').then(([el]) => window.Alpine.morph(el, toHtml))

        get('div:nth-of-type(1) input').should(haveValue('foo'))
        get('div:nth-of-type(2) input').should(haveValue(''))
        get('div:nth-of-type(3) input').should(haveValue('bar'))
    },
)

test('can morph with flat-nested conditional markers',
    [html`
        <main>
            <!--[if BLOCK]><![endif]-->
            <div>foo<input></div>
            <!--[if BLOCK]><![endif]-->
            <!--[if ENDBLOCK]><![endif]-->
            <!--[if ENDBLOCK]><![endif]-->
            <div>bar<input></div>
        </main>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <main>
            <!--[if BLOCK]><![endif]-->
            <div>foo<input></div>
            <!--[if BLOCK]><![endif]-->
            <!--[if ENDBLOCK]><![endif]-->
            <div>baz<input></div>
            <!--[if ENDBLOCK]><![endif]-->
            <div>bar<input></div>
        </main>
        `

        get('div:nth-of-type(1) input').type('foo')
        get('div:nth-of-type(2) input').type('bar')

        get('main').then(([el]) => window.Alpine.morph(el, toHtml))

        get('div:nth-of-type(1) input').should(haveValue('foo'))
        get('div:nth-of-type(2) input').should(haveValue(''))
        get('div:nth-of-type(3) input').should(haveValue('bar'))
    },
)

// '@event' handlers cannot be assigned directly on the element without Alpine's internl monkey patching...
test('can morph @event handlers', [
    html`
        <div x-data="{ foo: 'bar' }">
            <button x-text="foo"></button>
        </div>
    `],
    ({ get, click }, reload, window, document) => {
        let toHtml = html`
            <button @click="foo = 'buzz'" x-text="foo"></button>
        `;

        get('button').should(haveText('bar'));

        get('button').then(([el]) => window.Alpine.morph(el, toHtml));
        get('button').click();
        get('button').should(haveText('buzz'));
    }
);

test('can morph menu',
    [html`
        <main x-data>
            <article x-menu>
                <button data-trigger x-menu:button x-text="'ready'"></button>

                <div x-menu:items>
                    <button x-menu:item href="#edit">
                        Edit
                        <input>
                    </button>
                </div>
            </article>
        </main>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
            <main x-data>
                <article x-menu>
                    <button data-trigger x-menu:button x-text="'ready'"></button>

                    <div x-menu:items>
                        <button x-menu:item href="#edit">
                            Edit
                            <input>
                        </button>
                    </div>
                </article>
            </main>
        `

        get('[data-trigger]').should(haveText('ready'));
        get('button[data-trigger').click()

        get('input').type('foo')

        get('main').then(([el]) => window.Alpine.morph(el, toHtml, {
            key(el) { return el.id }
        }))

        get('input').should(haveValue('foo'))
    },
)

test('can morph teleports with x-for',
    [html`
    <main x-data>
        <template x-teleport="body">
            <article>
                <template x-for="item in 3" :key="item">
                    <span x-text="item"></span>
                </template>
            </article>
        </template>

        <button x-data="{ count: 1 }" x-text="count" x-on:click="count++" type="button"></button>
    </main>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <main x-data>
            <template x-teleport="body">
                <article>
                    <template x-for="item in 3" :key="item">
                        <span x-text="item"></span>
                    </template>
                </article>
            </template>

            <button x-data="{ count: 1 }" x-text="count" x-on:click="count++" type="button"></button>
        </main>
        `

        get('button').should(haveText('1'));
        get('button').click()
        get('button').should(haveText('2'));

        get('main').then(([el]) => window.Alpine.morph(el, toHtml));

        get('button').should(haveText('2'));
        get('button').click()
        get('button').should(haveText('3'));
    },
)

test('can morph teleports with root-level state',
    [html`
    <main x-data>
        <template x-teleport="body">
            <div x-data="{ foo: 'bar' }">
                <h1 x-text="foo"></h1>
            </div>
        </template>
    </main>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <main x-data>
            <template x-teleport="body">
                <div x-data="{ foo: 'bar' }">
                    <h1 x-text="foo"></h1>
                </div>
            </template>
        </main>
        `

        get('h1').should(haveText('bar'));

        get('main').then(([el]) => window.Alpine.morph(el, toHtml));

        get('h1').should(haveText('bar'));
    },
)
