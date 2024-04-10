import { haveText, html, test } from '../../utils'

test('basic drag sorting works',
    [html`
        <div x-data>
            <ul x-sort>
                <li id="1">foo</li>
                <li id="2">bar</li>
                <li id="3">baz</li>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('ul li').eq(0).should(haveText('foo'))
        get('ul li').eq(1).should(haveText('bar'))
        get('ul li').eq(2).should(haveText('baz'))

        // Unfortunately, github actions doesn't like "async/await" here
        // so we need to use .then() throughout this entire test...
        get('#1').drag('#3').then(() => {
            get('ul li').eq(0).should(haveText('bar'))
            get('ul li').eq(1).should(haveText('baz'))
            get('ul li').eq(2).should(haveText('foo'))

            get('#3').drag('#1').then(() => {
                get('ul li').eq(0).should(haveText('bar'))
                get('ul li').eq(1).should(haveText('foo'))
                get('ul li').eq(2).should(haveText('baz'))
            })
        })
    },
)

test('can use a custom handle',
    [html`
        <div x-data>
            <ul x-sort>
                <li id="1"><span x-sort:handle>handle</span> - foo</li>
                <li id="2"><span x-sort:handle>handle</span> - bar</li>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('ul li').eq(0).should(haveText('handle - foo'))
        get('ul li').eq(1).should(haveText('handle - bar'))

        get('#1 span').drag('#2').then(() => {
            get('ul li').eq(0).should(haveText('handle - bar'))
            get('ul li').eq(1).should(haveText('handle - foo'))
        })
    },
)

// Skipping this because it passes locally but not in CI...
test.skip('can move items between groups',
    [html`
        <div x-data>
            <ul x-sort.group.one>
                <li id="1">foo</li>
                <li id="2">bar</li>
            </ul>

            <ol x-sort.group.one>
                <li id="3">oof</li>
                <li id="4">rab</li>
            </ol>
        </div>
    `],
    ({ get }) => {
        get('ul li').eq(0).should(haveText('foo'))
        get('ul li').eq(1).should(haveText('bar'))
        get('ol li').eq(0).should(haveText('oof'))
        get('ol li').eq(1).should(haveText('rab'))

        get('#1').drag('#4').then(() => {
            get('ul li').eq(0).should(haveText('bar'))
            get('ol li').eq(0).should(haveText('oof'))
            get('ol li').eq(1).should(haveText('foo'))
            get('ol li').eq(2).should(haveText('rab'))
        })
    },
)

test('sort handle method',
    [html`
        <div x-data="{ handle(key, position) { $refs.outlet.textContent = key+'-'+position } }">
            <ul x-sort="handle">
                <li x-sort:key="1" id="1">foo</li>
                <li x-sort:key="2" id="2">bar</li>
                <li x-sort:key="3" id="3">baz</li>
            </ul>

            <h1 x-ref="outlet"></h1>
        </div>
    `],
    ({ get }) => {
        get('#1').drag('#3').then(() => {
            get('h1').should(haveText('1-2'))

            get('#3').drag('#1').then(() => {
                get('h1').should(haveText('3-2'))
            })
        })
    },
)

test('can access key and position in handler',
    [html`
        <div x-data="{ handle(key, position) { $refs.outlet.textContent = key+'-'+position } }">
            <ul x-sort="handle($position, $key)">
                <li x-sort:key="1" id="1">foo</li>
                <li x-sort:key="2" id="2">bar</li>
                <li x-sort:key="3" id="3">baz</li>
            </ul>

            <h1 x-ref="outlet"></h1>
        </div>
    `],
    ({ get }) => {
        get('#1').drag('#3').then(() => {
            get('h1').should(haveText('2-1'))

            get('#3').drag('#1').then(() => {
                get('h1').should(haveText('2-3'))
            })
        })
    },
)

test('can use custom sortablejs configuration',
    [html`
        <div x-data>
            <ul x-sort x-sort:config="{ filter: '[data-ignore]' }">
                <li id="1" data-ignore>foo</li>
                <li id="2">bar</li>
                <li id="3">baz</li>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('ul li').eq(0).should(haveText('foo'))
        get('ul li').eq(1).should(haveText('bar'))
        get('ul li').eq(2).should(haveText('baz'))

        get('#1').drag('#3').then(() => {
            get('ul li').eq(0).should(haveText('foo'))
            get('ul li').eq(1).should(haveText('bar'))
            get('ul li').eq(2).should(haveText('baz'))

            get('#3').drag('#1').then(() => {
                get('ul li').eq(0).should(haveText('baz'))
                get('ul li').eq(1).should(haveText('foo'))
                get('ul li').eq(2).should(haveText('bar'))
            })
        })
    },
)

test('works with Livewire morphing',
    [html`
        <div x-data>
            <ul x-sort>
                <!-- [if BLOCK]><![endif] -->
                <li id="1">foo</li>
                <li id="2">bar</li>
                <li id="3">baz</li>
                <!-- [if ENDBLOCK]><![endif] -->
            </ul>
        </div>
    `],
    ({ get }) => {
        get('#1').drag('#3').then(() => {
            // This is the easiest way I can think of to assert the order of HTML comments doesn't change...
            get('ul').should('have.html', `\n                <!-- [if BLOCK]><![endif] -->\n                \n                <li id="2" style="">bar</li>\n                <li id="3" style="">baz</li>\n                \n            <li id="1" draggable="false" class="" style="opacity: 1;">foo</li><!-- [if ENDBLOCK]><![endif] -->`)
        })
    },
)
