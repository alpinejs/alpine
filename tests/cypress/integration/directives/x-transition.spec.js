import { beHidden, beVisible, haveClasses, html, notBeVisible, notHaveClasses, test } from '../../utils'

test('transition in',
    html`
        <style>
            .transition { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
            .duration-100 { transition-duration: 100ms; }
        </style>
        <div x-data="{ show: false }">
            <button x-on:click="show = ! show"></button>

            <span
                x-show="show"
                x-transition:enter="transition duration-100 enter"
                x-transition:enter-start="enter-start"
                x-transition:enter-end="enter-end"
            >thing</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(beHidden())
        get('span').should(notHaveClasses(['enter', 'enter-start', 'enter-end']))
        get('button').click()
        get('span').should(beVisible())
        get('span').should(notHaveClasses(['enter-start']))
        get('span').should(haveClasses(['enter', 'enter-end']))
    }
)

test('transition out',
    html`
        <style>
            .transition { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
            .duration-100 { transition-duration: 100ms; }
        </style>
        <div x-data="{ show: true }">
            <button x-on:click="show = ! show"></button>

            <span
                x-show="show"
                x-transition:leave="transition duration-100 leave"
                x-transition:leave-start="leave-start"
                x-transition:leave-end="leave-end"
            >thing</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('span').should(notHaveClasses(['leave', 'leave-start', 'leave-end']))
        get('button').click()
        get('span').should(beVisible())
        get('span').should(notHaveClasses(['leave-start']))
        get('span').should(haveClasses(['leave', 'leave-end']))
        get('span').should(beHidden())
    }
)
