import { haveText, html, test } from '../../utils'

test('$dispatch dispatches events properly',
    html`
        <div x-data="{ foo: 'bar' }" x-on:custom-event="foo = $event.detail.newValue">
            <span x-text="foo"></span>

            <button x-on:click="$dispatch('custom-event', {newValue: 'baz'})">click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('$dispatch with bubbles overwrite to false shouldn\'t bubble (event handling on parent)',
    html`
        <div x-data="{ foo: 'bar' }" x-on:custom-event="foo = $event.detail.newValue">
            <span x-text="foo"></span>

            <button x-on:click="$dispatch('custom-event', {newValue: 'baz'}, {bubbles: false})">click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('bar'))
    }
)

test('$dispatch with bubbles overwrite to false shouldn\'t bubble (event handling on same element)',
    html`
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>

            <button
                x-on:custom-event="foo = $event.detail.newValue"
                x-on:click="$dispatch('custom-event', {newValue: 'baz'}, {bubbles: false})">click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('$dispatch cancelable should be cancelable by $event.preventDefault()',
    html`
        <div x-data="{ foo: 'bar' }"
             x-on:prevented-event="$event.preventDefault()">
            <span x-text="foo"></span>

            <button x-on:click="if($dispatch('not-prevented-event')){ foo = 'baz'; } if($dispatch('prevented-event')){ foo = 'bar'; }">
                click me
            </button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)
