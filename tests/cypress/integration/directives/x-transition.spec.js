import { beHidden, beVisible, haveClasses, haveComputedStyle, html, notBeVisible, notHaveClasses, notHaveComputedStyle, test } from '../../utils'

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

test('transition:enter in nested x-show visually runs',
    html`
        <style>
            .transition { transition: opacity 1s ease; }
            .opacity-0 {opacity: 0}
            .opacity-1 {opacity: 1}
        </style>
        <div x-data="{ show: false }">
            <span x-show="show">
                <h1 x-show="show"
                    x-transition:enter="transition"
                    x-transition:enter-start="opacity-0"
                    x-transition:enter-end="opacity-1">thing</h1>
            </span>

            <button x-on:click="show = true"></button>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('span').should(beVisible())
        get('h1').should(notHaveComputedStyle('opacity', '1')) // We expect a value between 0 and 1
        get('h1').should(haveComputedStyle('opacity', '1')) // Eventually opacity will be 1
    }
)

test('transition duration and delay with and without ms syntax',
    html`
        <div x-data="{ showMs: false, showBlank: false }">

            <span class="ms"
                  x-show="showMs"
                  x-transition.delay.80ms.duration.120ms>ms syntax</span>
            <span class="blank"
                  x-show="showBlank"
                  x-transition.delay.80.duration.120>blank syntax</span>

            <button class="ms"    x-on:click="showMs = true"></button>
            <button class="blank" x-on:click="showBlank = true"></button>
        </div>
    `,
    ({ get }) => {
        get('span.ms').should(notBeVisible())
        get('button.ms').click()
        get('span.ms').should(notBeVisible()) // Not visible due to delay
        get('span.ms').should(beVisible())
        get('span.ms').should(notHaveComputedStyle('opacity', '1')) // We expect a value between 0 and 1
        get('span.ms').should(haveComputedStyle('opacity', '1')) // Eventually opacity will be 1

        get('span.blank').should(notBeVisible())
        get('button.blank').click()
        get('span.blank').should(notBeVisible()) // Not visible due to delay
        get('span.blank').should(beVisible())
        get('span.blank').should(notHaveComputedStyle('opacity', '1')) // We expect a value between 0 and 1
        get('span.blank').should(haveComputedStyle('opacity', '1')) // Eventually opacity will be 1
    }
)

test(
    'bound x-transition can handle empty string and true values',
    html`
        <script>
            window.transitions = () => {
                return {
                    withEmptyString: {
                        ["x-transition.opacity"]: "",
                    },
                    withBoolean: {
                        ["x-transition.opacity"]: true,
                    },
                };
            };
        </script>
        <div x-data="transitions()">
            <button x-bind="withEmptyString"></button>
            <span x-bind="withBoolean">thing</span>
        </div>
    `,
    ({ get }) => 
        {
            get('span').should(beVisible())
            get('span').should(beVisible())
        }
    
);
