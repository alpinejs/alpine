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

test('can use morphBetween with comment markers',
    [html`
        <div>
            <h2>Header</h2>
            <!--start-->
            <p>Original content</p>
            <!--end-->
            <h2>Footer</h2>
        </div>
    `],
    ({ get }, reload, window, document) => {
        // Find the comment markers
        let startMarker, endMarker;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === 'start') startMarker = node;
            if (node.textContent === 'end') endMarker = node;
        }

        window.Alpine.morphBetween(startMarker, endMarker, '<p>New content</p><p>More content</p>')

        get('h2:nth-of-type(1)').should(haveText('Header'))
        get('h2:nth-of-type(2)').should(haveText('Footer'))
        get('p').should(haveLength(2))
        get('p:nth-of-type(1)').should(haveText('New content'))
        get('p:nth-of-type(2)').should(haveText('More content'))
    },
)

test('morphBetween preserves Alpine state',
    [html`
        <div x-data="{ count: 1 }">
            <button @click="count++">Inc</button>
            <!--morph-start-->
            <p x-text="count"></p>
            <input x-model="count">
            <!--morph-end-->
            <span>Static content</span>
        </div>
    `],
    ({ get }, reload, window, document) => {
        // Find markers
        let startMarker, endMarker;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === 'morph-start') startMarker = node;
            if (node.textContent === 'morph-end') endMarker = node;
        }

        get('p').should(haveText('1'))
        get('button').click()
        get('p').should(haveText('2'))

        window.Alpine.morphBetween(startMarker, endMarker, `
            <p x-text="count"></p>
            <article>New element</article>
            <input x-model="count">
        `)

        get('p').should(haveText('2'))
        get('article').should(haveText('New element'))
        get('input').should(haveValue('2'))
        get('input').clear().type('5')
        get('p').should(haveText('5'))
    },
)

test('morphBetween with keyed elements',
    [html`
        <ul>
            <!--items-start-->
            <li key="1">foo<input></li>
            <li key="2">bar<input></li>
            <!--items-end-->
        </ul>
    `],
    ({ get }, reload, window, document) => {
        // Find markers
        let startMarker, endMarker;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === 'items-start') startMarker = node;
            if (node.textContent === 'items-end') endMarker = node;
        }

        get('li:nth-of-type(1) input').type('first')
        get('li:nth-of-type(2) input').type('second')

        get('ul').then(([el]) => window.Alpine.morphBetween(startMarker, endMarker, `
            <li key="3">baz<input></li>
            <li key="1">foo<input></li>
            <li key="2">bar<input></li>
        `, { key(el) { return el.getAttribute('key') } }))

        get('li').should(haveLength(3))
        get('li:nth-of-type(1)').should(haveText('baz'))
        get('li:nth-of-type(2)').should(haveText('foo'))
        get('li:nth-of-type(3)').should(haveText('bar'))
        // Need to verify by the key attribute since the elements have been reordered
        get('li[key="1"] input').should(haveValue('first'))
        get('li[key="2"] input').should(haveValue('second'))
        get('li[key="3"] input').should(haveValue(''))
    },
)

test('morphBetween with custom key function',
    [html`
        <div>
            <!--start-->
            <div data-id="a">Item A<input></div>
            <div data-id="b">Item B<input></div>
            <!--end-->
        </div>
    `],
    ({ get }, reload, window, document) => {
        // Find markers
        let startMarker, endMarker;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === 'start') startMarker = node;
            if (node.textContent === 'end') endMarker = node;
        }

        get('div[data-id="a"] input').type('aaa')
        get('div[data-id="b"] input').type('bbb')

        window.Alpine.morphBetween(startMarker, endMarker, `
            <div data-id="b">Item B Updated<input></div>
            <div data-id="c">Item C<input></div>
            <div data-id="a">Item A Updated<input></div>
        `, {
            key(el) { return el.dataset.id }
        })

        get('div[data-id]').should(haveLength(3))
        get('div[data-id="b"]').should(haveText('Item B Updated'))
        get('div[data-id="a"]').should(haveText('Item A Updated'))
        get('div[data-id="a"] input').should(haveValue('aaa'))
        get('div[data-id="b"] input').should(haveValue('bbb'))
        get('div[data-id="c"] input').should(haveValue(''))
    },
)

test('morphBetween with hooks',
    [html`
        <div>
            <!--region-start-->
            <p>Old paragraph</p>
            <span>Old span</span>
            <!--region-end-->
        </div>
    `],
    ({ get }, reload, window, document) => {
        // Find markers
        let startMarker, endMarker;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === 'region-start') startMarker = node;
            if (node.textContent === 'region-end') endMarker = node;
        }

        let removedElements = []
        let addedElements = []

        window.Alpine.morphBetween(startMarker, endMarker, `
            <p>New paragraph</p>
            <article>New article</article>
        `, {
            removing(el) {
                if (el.nodeType === 1) removedElements.push(el.tagName)
            },
            adding(el) {
                if (el.nodeType === 1) addedElements.push(el.tagName)
            }
        })

        get('p').should(haveText('New paragraph'))
        get('article').should(haveText('New article'))

        // Check hooks were called
        cy.wrap(removedElements).should('deep.equal', ['SPAN'])
        cy.wrap(addedElements).should('deep.equal', ['ARTICLE'])
    },
)

test('morphBetween with empty content',
    [html`
        <div>
            <h3>Title</h3>
            <!--content-start-->
            <p>Content 1</p>
            <p>Content 2</p>
            <!--content-end-->
            <h3>End</h3>
        </div>
    `],
    ({ get }, reload, window, document) => {
        // Find markers
        let startMarker, endMarker;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === 'content-start') startMarker = node;
            if (node.textContent === 'content-end') endMarker = node;
        }

        window.Alpine.morphBetween(startMarker, endMarker, '')

        get('h3').should(haveLength(2))
        get('p').should(haveLength(0))

        // Verify markers are still there
        let found = false;
        const walker2 = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );
        while (node = walker2.nextNode()) {
            if (node.textContent === 'content-start' || node.textContent === 'content-end') {
                found = true;
            }
        }
        cy.wrap(found).should('be.true')
    },
)

test('morphBetween with nested Alpine components',
    [html`
        <div x-data="{ outer: 'foo' }">
            <!--nested-start-->
            <div x-data="{ inner: 'bar' }">
                <span x-text="outer"></span>
                <span x-text="inner"></span>
                <input x-model="inner">
            </div>
            <!--nested-end-->
        </div>
    `],
    ({ get }, reload, window, document) => {
        // Find markers
        let startMarker, endMarker;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === 'nested-start') startMarker = node;
            if (node.textContent === 'nested-end') endMarker = node;
        }

        get('span:nth-of-type(1)').should(haveText('foo'))
        get('span:nth-of-type(2)').should(haveText('bar'))
        get('input').clear().type('baz')
        get('span:nth-of-type(2)').should(haveText('baz'))

        window.Alpine.morphBetween(startMarker, endMarker, `
            <div x-data="{ inner: 'bar' }">
                <h4>New heading</h4>
                <span x-text="outer"></span>
                <span x-text="inner"></span>
                <input x-model="inner">
            </div>
        `)

        get('h4').should(haveText('New heading'))
        get('span:nth-of-type(1)').should(haveText('foo'))
        get('span:nth-of-type(2)').should(haveText('baz'))
        get('input').should(haveValue('baz'))
    },
)

test('morphBetween with conditional blocks',
    [html`
        <main>
            <!--section-start-->
            <!--[if BLOCK]><![endif]-->
            <div>conditional content<input></div>
            <!--[if ENDBLOCK]><![endif]-->
            <p>regular content<input></p>
            <!--section-end-->
        </main>
    `],
    ({ get }, reload, window, document) => {
        // Find markers
        let startMarker, endMarker;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === 'section-start') startMarker = node;
            if (node.textContent === 'section-end') endMarker = node;
        }

        get('div input').type('div-value')
        get('p input').type('p-value')

        window.Alpine.morphBetween(startMarker, endMarker, `
            <!--[if BLOCK]><![endif]-->
            <div>conditional content<input></div>
            <span>new conditional<input></span>
            <!--[if ENDBLOCK]><![endif]-->
            <p>regular content<input></p>
        `)

        get('div input').should(haveValue('div-value'))
        get('span input').should(haveValue(''))
        get('p input').should(haveValue('p-value'))
    },
)
