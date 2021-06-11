import { haveText, html, test } from '../../utils'

test('$nextTick runs code on the next available managed tick',
    html`
        <div x-data="{foo: 'bar'}">
            <span x-text="foo" x-ref="span"></span>

            <button x-on:click="foo = 'baz'; $nextTick(() => {$refs.span.textContent = 'bob'})">click</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('bob'))
    }
)

test('$nextTick waits for x-for to finish rendering',
    html`
        <div x-data="{list: ['one', 'two'], check: 2}">
            <template x-for="item in list">
                <span x-text="item"></span>
            </template>

            <p x-text="check"></p>

            <button x-on:click="list = ['one', 'two', 'three']; $nextTick(() => {check = document.querySelectorAll('span').length})">click</button>
        </div>
    `,
    ({ get }) => {
        get('p').should(haveText('2'))
        get('button').click()
        get('p').should(haveText('3'))
    }
)

test('$nextTick works with transition',
    html`
        <div x-data="{ show: false, loggedDisplayStyle: null }" x-init="$nextTick(() => { loggedDisplayStyle = document.querySelector('h1').style.display })">
            <h1 x-show="show" x-transition:enter="animation-enter"></h1>

            <h2 x-text="loggedDisplayStyle"></h2>

            <button @click="show = true; $nextTick(() => { loggedDisplayStyle = document.querySelector('h1').style.display })">click</button>
        </div>
    `,
    ({ get }) => {
        get('h2').should(haveText('none'))
        get('button').click()
        get('h2').should(haveText(''))
    }
)
