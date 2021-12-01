import { beEqualTo, beVisible, haveText, html, notBeVisible, test } from '../../utils'

test('can use a x-teleport',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-teleport="#b">
                <span x-text="count"></span>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }) => {
        get('#b span').should(haveText('1'))
        get('button').click()
        get('#b span').should(haveText('2'))
    },
)

test('can teleport multiple',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-teleport="#b">
                <h1 x-text="count"></h1>
            </template>

            <template x-teleport="#b">
                <h2 x-text="count + 1"></h2>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }) => {
        get('#b h1').should(haveText('1'))
        get('#b h2').should(haveText('2'))
        get('button').click()
        get('#b h1').should(haveText('2'))
        get('#b h2').should(haveText('3'))
    },
)

test('teleported targets forward events to teleport source if listeners are attached',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-teleport="#b" @click="count++">
                <h1 x-text="count"></h1>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }) => {
        get('#b h1').should(haveText('1'))
        get('button').click()
        get('#b h1').should(haveText('2'))
        get('h1').click()
        get('#b h1').should(haveText('3'))
    },
)

test('removing teleport source removes teleported target',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="$refs.template.remove()">Remove</button>

            <template x-teleport="#b" @click="count++" x-ref="template">
                <h1 x-text="count"></h1>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }) => {
        get('#b h1').should(beVisible())
        get('button').click()
        get('#b h1').should(notBeVisible())
    },
)

test('$refs inside teleport can be accessed outside',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="$refs.count.remove()">Remove</button>

            <template x-teleport="#b">
                <h1 x-text="count" x-ref="count"></h1>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }) => {
        get('#b h1').should(beVisible())
        get('button').click()
        get('#b h1').should(notBeVisible())
    },
)

test('$root is accessed outside teleport',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <template x-teleport="#b">
                <h1 x-text="$root.id"></h1>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }) => {
        get('#b h1').should(beVisible())
        get('#b h1').should(haveText('a'))
    },
)

test('$id honors x-id outside teleport',
    [html`
        <div x-data="{ count: 1 }" id="a" x-id="['foo']">
            <h1 x-text="$id('foo')"></h1>

            <template x-teleport="#b">
                <h1 x-text="$id('foo')"></h1>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }) => {
        get('#b h1').should(haveText('foo-1'))
    },
)
