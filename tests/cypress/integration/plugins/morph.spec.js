import { haveText, html, test } from '../../utils'

test('can morph components',
    [html`
        <div x-data="{ frame: 0 }">
            <template x-ref="0">
                <h1><div></div>foo</h1>
            </template>

            <template x-ref="1">
                <h1><div x-data="{ text: 'yo' }" x-text="text"></div> foo</h1>
            </template>

            <template x-ref="2">
                <h1><div x-data="{ text: 'yo' }" x-text="text + 'yo'"></div> foo</h1>
            </template>

            <button @click="frame++">morph</button>

            <article x-morph="$refs[frame % 3].innerHTML"></article>
        </div>
    `],
    ({ get }) => {
        get('article h1').should(haveText('foo'))
        get('button').click()
        get('article h1').should(haveText('yo foo'))
        get('button').click()
        get('article h1').should(haveText('yoyo foo'))
    },
)

test('components within morph retain state between',
    [html`
        <div x-data="{ frame: 0 }">
            <template x-ref="0">
                <div x-data="{ count: 1 }">
                    <button @click="count++">inc</button>

                    <span x-text="String(frame) + count"></span>
                </div>
            </template>

            <template x-ref="1">
                <div x-data="{ count: 1 }">
                    <button @click="count++">inc</button>

                    <span x-text="String(frame) + 'foo' + count"></span>
                </div>
            </template>

            <button @click="frame++" id="morph">morph</button>

            <article x-morph="$refs[frame % 2].innerHTML"></article>
        </div>
    `],
    ({ get }) => {
        get('article span').should(haveText('01'))
        get('article button').click()
        get('article span').should(haveText('02'))
        get('#morph').click()
        get('article span').should(haveText('1foo2'))
        get('article button').click()
        get('article span').should(haveText('1foo3'))
    },
)
