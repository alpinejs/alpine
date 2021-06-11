import { haveText, html, test } from '../utils'

test('can clone a component',
    html`
        <script>
            document.addEventListener('alpine:initialized', () => {
                window.original = document.getElementById('original')
                window.copy = document.getElementById('copy')

                window.copy.removeAttribute('x-ignore')
                delete window.copy._x_ignore
            })
        </script>

        <button x-data @click="Alpine.clone(original, copy)">click</button>

        <div x-data="{ foo: 'bar' }" id="original">
            <h1 @click="foo = 'baz'">click me</h1>

            <span x-text="foo"></span>
        </div>

        <div x-data="{ foo: 'bar' }" id="copy" x-ignore>
            <h1 @click="foo = 'baz'">click me</h1>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('#original h1').click()
        get('#original span').should(haveText('baz'))
        get('#copy span').should(haveText(''))
        get('button').click()
        get('#copy span').should(haveText('baz'))
    }
)

test('wont run init on clone',
    html`
        <script>
            document.addEventListener('alpine:initialized', () => {
                window.original = document.getElementById('original')
                window.copy = document.getElementById('copy')

                window.copy.removeAttribute('x-ignore')
                delete window.copy._x_ignore
            })
        </script>

        <button x-data @click="Alpine.clone(original, copy)">click</button>

        <div x-data="{ count: 0 }" x-init="count++" id="original">
            <span x-text="count"></span>
        </div>

        <div x-data="{ count: 0 }" x-init="count++" id="copy" x-ignore>
            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('#original span').should(haveText('1'))
        get('#copy span').should(haveText(''))
        get('button').click()
        get('#copy span').should(haveText('1'))
    }
)

test('wont register listeners on clone',
    html`
        <script>
            document.addEventListener('alpine:initialized', () => {
                window.original = document.getElementById('original')
                window.copy = document.getElementById('copy')

                window.copy.removeAttribute('x-ignore')
                delete window.copy._x_ignore
            })
        </script>

        <button x-data @click="Alpine.clone(original, copy)">click</button>

        <div x-data="{ count: 0 }" x-init="count++" id="original">
            <span x-text="count"></span>
        </div>

        <div x-data="{ count: 0 }" x-init="count++" id="copy" x-ignore>
            <h1 @click="count++">inc</h1>
            <span x-text="count"></span>
        </div>
    `,
    ({ get }) => {
        get('#original span').should(haveText('1'))
        get('#copy span').should(haveText(''))
        get('button').click()
        get('#copy span').should(haveText('1'))
        get('#copy h1').click()
        get('#copy span').should(haveText('1'))
    }
)
