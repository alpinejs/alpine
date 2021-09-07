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

test('.half',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div id="container" style="height: 400px; overflow-y: scroll;">
            <div style="height: 410px;">spacer</div>

            <div style="height: 400px" x-intersect.half="count++">
                <div style="text-align: center;">content</div>
            </div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 100, {duration: 100})
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 210, {duration: 100})
        get('span').should(haveText('1'))
    },
)

test('.full',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div id="container" style="height: 400px; overflow-y: scroll;">
            <div style="height: 401px;">spacer</div>

            <div style="height: 400px" x-intersect.full="count++">
                <div style="text-align: center;">content</div>
            </div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 200, {duration: 100})
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 400, {duration: 100})
        get('span').should(haveText('1'))
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
