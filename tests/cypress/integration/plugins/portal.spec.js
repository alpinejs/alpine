import { beEqualTo, beVisible, haveText, html, notBeVisible, test } from '../../utils'

test('can use a portal',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-portal="foo">
                <span x-text="count"></span>
            </template>
        </div>

        <div id="b">
            <template x-portal-target="foo"></template>
        </div>
    `],
    ({ get }) => {
        get('#b span').should(haveText('1'))
        get('button').click()
        get('#b span').should(haveText('2'))
    },
)

test('can send multiple to a portal',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-portal="foo">
                <h1 x-text="count"></h1>
            </template>

            <template x-portal="foo">
                <h2 x-text="count + 1"></h2>
            </template>
        </div>

        <div id="b">
            <template x-portal-target="foo"></template>
        </div>
    `],
    ({ get }) => {
        get('#b h1').should(haveText('1'))
        get('#b h2').should(haveText('2'))
        get('button').click()
        get('#b h1').should(haveText('2'))
        get('#b h2').should(haveText('3'))
    },
)

test('portal targets forward events to portal source if listeners are attached',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-portal="foo" @click="count++">
                <h1 x-text="count"></h1>
            </template>
        </div>

        <div id="b">
            <template x-portal-target="foo"></template>
        </div>
    `],
    ({ get }) => {
        get('#b h1').should(haveText('1'))
        get('button').click()
        get('#b h1').should(haveText('2'))
        get('h1').click()
        get('#b h1').should(haveText('3'))
    },
)

test('removing portal source removes portal target',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="$refs.template.remove()">Remove</button>

            <template x-portal="foo" @click="count++" x-ref="template">
                <h1 x-text="count"></h1>
            </template>
        </div>

        <div id="b">
            <template x-portal-target="foo"></template>
        </div>
    `],
    ({ get }) => {
        get('#b h1').should(beVisible())
        get('button').click()
        get('#b h1').should(notBeVisible())
    },
)

test('$refs inside portal can be accessed outside',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="$refs.count.remove()">Remove</button>

            <template x-portal="foo">
                <h1 x-text="count" x-ref="count"></h1>
            </template>
        </div>

        <div id="b">
            <template x-portal-target="foo"></template>
        </div>
    `],
    ({ get }) => {
        get('#b h1').should(beVisible())
        get('button').click()
        get('#b h1').should(notBeVisible())
    },
)

test('$root is accessed outside portal',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <template x-portal="foo">
                <h1 x-text="$root.id"></h1>
            </template>
        </div>

        <div id="b">
            <template x-portal-target="foo"></template>
        </div>
    `],
    ({ get }) => {
        get('#b h1').should(beVisible())
        get('#b h1').should(haveText('a'))
    },
)

test('$id honors x-id outside portal',
    [html`
        <div x-data="{ count: 1 }" id="a" x-id="['foo']">
            <h1 x-text="$id('foo')"></h1>

            <template x-portal="foo">
                <h1 x-text="$id('foo')"></h1>
            </template>
        </div>

        <div id="b">
            <template x-portal-target="foo"></template>
        </div>
    `],
    ({ get }) => {
        get('#b h1').should(haveText('foo-1'))
    },
)
