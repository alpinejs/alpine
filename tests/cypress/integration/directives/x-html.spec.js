import { haveText, notHaveText, html, test } from '../../utils'

test('sets html on init',
    html`
        <div x-data="{ foo: '<h1>hey</h1>' }">
            <span x-html="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('hey'))
    }
)

test('sets html on update',
    html`
        <div x-data="{ foo: '' }">
            <button x-on:click="foo = '<h1>hey</h1>'">Show "bar"</button>

            <span x-html="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(notHaveText('hey'))
        get('button').click()
        get('h1').should(haveText('hey'))
    }
)

test('x-html allows alpine code within',
    html`
        <div x-data="{ foo: '<h1  x-text=&quot;bar&quot;></h1>', bar: 'baz' }" x-html="foo"></div>
    `,
    ({ get }) => {
        get('h1').should(haveText('baz'))
    }

)

test('x-html with alpine code within, as sibling of an x-if',
    html`
        <div x-data="{ foo: '<h2  x-text=&quot;bar&quot;></h2>',bar:'baz', show: true }">
            <template x-if="show">
                <h1>X-if template shown</h1>
            </template>
            <div x-html="foo"></div>
        </div>


    `,
    ({ get }) => {
        get('h1').should(haveText('X-if template shown'))
        get('h2').should(haveText('baz'))
    }

)

test('x-html with alpine code within, as sibling of an x-for',
    html`
        <div x-data="{ foo: '<h2  x-text=&quot;bar&quot;></h2>',bar:'baz', items: [1,2,3] }">
            <template x-for="(item,index) in items" :key="index">
                <div :id="'xfor'+item" x-text="item"></div>
            </template>
            <div x-html="foo"></div>
        </div>


    `,
    ({ get }) => {
        get('#xfor1').should(haveText('1'))
        get('#xfor2').should(haveText('2'))
        get('#xfor3').should(haveText('3'))
        get('h2').should(haveText('baz'))
    }

)
