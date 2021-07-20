import { haveText, html, test, wait } from '../../utils'

test('can perist data',
    [html`
        <div x-data="{ count: $persist(1) }">
            <button @click="count++">Inc</button>
            <span x-text="count"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('1'))
        get('button').click()
        get('span').should(haveText('2'))
        reload()
        get('span').should(haveText('2'))
    },
)

test('can alias the localStorage key',
    [html`
        <div x-data="{ foo: $persist('bar').as('baz') }"></div>
    `],
    () => wait(100).then(() => {
        expect(localStorage.getItem('foo')).to.be.null
        expect(localStorage.getItem('baz')).to.eq('bar')
    }),
)
