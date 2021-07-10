import { haveText, test, html } from '../../utils'

test('can intersect',
    [html`
    <div x-data="{ count: 0 }" x-init="setTimeout(() => count++, 300)">
        <span x-text="count"></span>

        <div x-intersect="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('0'))
        get('span').should(haveText('1'))
        get('#1').scrollIntoView()
        get('span').should(haveText('1'))
        get('span').scrollIntoView()
        get('span').should(haveText('1'))
        get('#1').scrollIntoView()
        get('span').should(haveText('2'))
    },
)

test('.once',
    [html`
    <div x-data="{ count: 0 }" x-init="setTimeout(() => count++, 300)">
        <span x-text="count"></span>

        <div x-intersect.once="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('0'))
        get('span').should(haveText('1'))
        get('#1').scrollIntoView()
        get('span').should(haveText('1'))
        get('span').scrollIntoView()
        get('span').should(haveText('1'))
        get('#1').scrollIntoView()
        get('span').should(haveText('1'))
    },
)
