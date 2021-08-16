import { haveText, test, html } from '../../utils'

test('can intersect',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div x-intersect="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
    },
)

test('It should evaluate with ":enter" only when the component is intersected',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div x-intersect:enter="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
    },
)

test('It should evaluate with ":leave" only when the component is not intersected',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div x-intersect:leave="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('3'))
    },
)

test('.once',
    [html`
    <div x-data="{ count: 0 }" x-init="setTimeout(() => count++, 300)">
        <span x-text="count"></span>

        <div x-intersect.once="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
    },
)
