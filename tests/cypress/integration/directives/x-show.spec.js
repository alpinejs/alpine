import { beHidden, beVisible, haveAttribute, html, test } from '../../utils'

test('x-show toggles display: none; with no other style attributes',
    html`
        <div x-data="{ show: true }">
            <span x-show="show">thing</span>

            <button x-on:click="show = false"></button>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('button').click()
        get('span').should(beHidden())
    }
)

test('x-show (with true default) toggles display: none; even if it exists with the page load',
    html`
        <div x-data="{ show: true }">
            <span x-show="show" style="display: none;">thing</span>

            <button x-on:click="show = false"></button>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('button').click()
        get('span').should(beHidden())
    }
)

test('x-show (with false default) toggles display: none; even if it exists with the page load',
    html`
        <div x-data="{ show: false }">
            <span x-show="show" style="display: none;">thing</span>

            <button x-on:click="show = true"></button>
        </div>
    `,
    ({ get }) => {
        get('span').should(beHidden())
        get('button').click()
        get('span').should(beVisible())
    }
)

test('x-show toggles display: none; with other style attributes',
    html`
        <div x-data="{ show: true }">
            <span x-show="show" style="color: blue;">thing</span>

            <button x-on:click="show = false"></button>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('span').should(haveAttribute('style', 'color: blue;'))
        get('button').click()
        get('span').should(beHidden())
        get('span').should(haveAttribute('style', 'color: blue; display: none;'))
    }
)

test('x-show waits for transitions within it to finish before hiding an elements',
    html`
        <style>
            .transition { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
            .duration-100 { transition-duration: 100ms; }
        </style>
        <div x-data="{ show: true }">
            <span x-show="show">
                <h1 x-show="show" x-transition:leave="transition duration-100">thing</h1>
            </span>

            <button x-on:click="show = false"></button>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('button').click()
        get('span').should(beVisible())
        get('h1').should(beHidden())
        get('span').should(beHidden())
    }
)

test('x-show does NOT wait for transitions to finish if .immediate is present',
    html`
        <style>
            .transition { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
            .duration-100 { transition-duration: 100ms; }
        </style>
        <div x-data="{ show: true }">
            <span x-show.immediate="show">
                <h1 x-show="show" x-transition:leave="transition duration-100">thing</h1>
            </span>

            <button x-on:click="show = false"></button>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('button').click()
        get('span').should(beHidden())
    }
)

test('x-show with x-bind:style inside x-for works correctly',
    html`
        <div x-data="{items: [{ cleared: false }, { cleared: false }]}">
            <template x-for="(item, index) in items" :key="index">
                <button x-show="! item.cleared"
                    x-bind:style="'background: #999'"
                    @click="item.cleared = true"
                >
                </button>
            </template>
        </div>
    `,
    ({ get }) => {
        get('button:nth-of-type(1)').should(beVisible())
        get('button:nth-of-type(1)').should(haveAttribute('style', 'background: #999'))
        get('button:nth-of-type(2)').should(beVisible())
        get('button:nth-of-type(2)').should(haveAttribute('style', 'background: #999'))
        get('button:nth-of-type(1)').click()
        get('button:nth-of-type(1)').should(beHidden())
        get('button:nth-of-type(1)').should(haveAttribute('style', 'background: rgb(153, 153, 153); display: none;'))
        get('button:nth-of-type(2)').should(beVisible())
        get('button:nth-of-type(2)').should(haveAttribute('style', 'background: #999'))
    }
)

test('x-show takes precedence over style bindings for display property',
    html`
        <div x-data="{ show: false }">
            <span x-show="show" :style="'color: red;'">thing</span>
            <span :style="'color: red;'" x-show="show">thing</span>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(haveAttribute('style', 'color: red; display: none;'))
        get('span:nth-of-type(2)').should(haveAttribute('style', 'color: red; display: none;'))
    }
)
