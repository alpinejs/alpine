import { haveText, html, test } from '../../utils'

test('value is reflected in query string upon changing',
    [html`
        <div x-data="{ count: $queryString(1) }">
            <button @click="count++">Inc</button>
            <h1 @click="count--">Dec</h1>
            <span x-text="count"></span>
        </div>
    `],
    ({ get, url, go }) => {
        get('span').should(haveText('1'))
        url().should('not.include', '?count=1')
        get('button').click()
        get('span').should(haveText('2'))
        url().should('include', '?count=2')
        get('button').click()
        get('span').should(haveText('3'))
        url().should('include', '?count=3')
        get('h1').click()
        get('h1').click()
        get('span').should(haveText('1'))
        url().should('not.include', '?count=1')
    },
)

test('can configure always making the query string value present',
    [html`
        <div x-data="{ count: $queryString(1).alwaysShow() }">
            <button @click="count++">Inc</button>
            <h1 @click="count--">Dec</h1>
            <span x-text="count"></span>
        </div>
    `],
    ({ get, url, go }) => {
        get('span').should(haveText('1'))
        url().should('include', '?count=1')
        get('button').click()
        get('span').should(haveText('2'))
        url().should('include', '?count=2')
        get('h1').click()
        get('span').should(haveText('1'))
        url().should('include', '?count=1')
    },
)

test('value is persisted across requests',
    [html`
        <div x-data="{ count: $queryString(1) }">
            <button @click="count++">Inc</button>
            <span x-text="count"></span>
        </div>
    `],
    ({ get, url, go }, reload) => {
        get('span').should(haveText('1'))
        url().should('not.include', '?count=1')
        get('button').click()
        get('span').should(haveText('2'))
        url().should('include', '?count=2')

        reload()

        url().should('include', '?count=2')
        get('span').should(haveText('2'))
    },
)

test('can provide an alias',
    [html`
        <div x-data="{ count: $queryString(1).as('tnuoc') }">
            <button @click="count++">Inc</button>
            <span x-text="count"></span>
        </div>
    `],
    ({ get, url, go }) => {
        get('span').should(haveText('1'))
        url().should('not.include', '?tnuoc=1')
        get('button').click()
        get('span').should(haveText('2'))
        url().should('include', '?tnuoc=2')
    },
)

test('can use pushState',
    [html`
        <div x-data="{ count: $queryString(1).usePush() }">
            <button @click="count++">Inc</button>
            <span x-text="count"></span>
        </div>
    `],
    ({ get, url, go }) => {
        get('span').should(haveText('1'))
        url().should('not.include', '?count=1')
        get('button').click()
        get('span').should(haveText('2'))
        url().should('include', '?count=2')
        go('back')
        get('span').should(haveText('1'))
        url().should('not.include', '?count=1')
        go('forward')
        get('span').should(haveText('2'))
        url().should('include', '?count=2')
    },
)

test('can go back and forth with multiple components',
    [html`
        <div x-data="{ foo: $queryString(1).usePush() }" id="foo">
            <button @click="foo++">Inc</button>
            <span x-text="foo"></span>
        </div>

        <div x-data="{ bar: $queryString(1).usePush() }" id="bar">
            <button @click="bar++">Inc</button>
            <span x-text="bar"></span>
        </div>
    `],
    ({ get, url, go }) => {
        get('#foo span').should(haveText('1'))
        url().should('not.include', 'foo=1')
        get('#foo button').click()
        get('#foo span').should(haveText('2'))
        url().should('include', 'foo=2')

        get('#bar span').should(haveText('1'))
        url().should('not.include', 'bar=1')
        get('#bar button').click()
        get('#bar span').should(haveText('2'))
        url().should('include', 'bar=2')

        go('back')

        get('#bar span').should(haveText('1'))
        url().should('not.include', 'bar=1')
        get('#foo span').should(haveText('2'))
        url().should('include', 'foo=2')

        go('back')

        get('#bar span').should(haveText('1'))
        url().should('not.include', 'bar=1')
        get('#foo span').should(haveText('1'))
        url().should('not.include', 'foo=1')
    },
)

test('supports arrays',
    [html`
        <div x-data="{ items: $queryString(['foo']) }">
            <button @click="items.push('bar')">Inc</button>
            <span x-text="JSON.stringify(items)"></span>
        </div>
    `],
    ({ get, url, go }, reload) => {
        get('span').should(haveText('["foo"]'))
        url().should('not.include', '?items')
        get('button').click()
        get('span').should(haveText('["foo","bar"]'))
        url().should('include', '?items[0]=foo&items[1]=bar')
        reload()
        url().should('include', '?items[0]=foo&items[1]=bar')
        get('span').should(haveText('["foo","bar"]'))
    },
)

test('supports deep arrays',
    [html`
        <div x-data="{ items: $queryString(['foo', ['bar', 'baz']]) }">
            <button @click="items[1].push('bob')">Inc</button>
            <span x-text="JSON.stringify(items)"></span>
        </div>
    `],
    ({ get, url, go }, reload) => {
        get('span').should(haveText('["foo",["bar","baz"]]'))
        url().should('not.include', '?items')
        get('button').click()
        get('span').should(haveText('["foo",["bar","baz","bob"]]'))
        url().should('include', '?items[0]=foo&items[1][0]=bar&items[1][1]=baz&items[1][2]=bob')
        reload()
        url().should('include', '?items[0]=foo&items[1][0]=bar&items[1][1]=baz&items[1][2]=bob')
        get('span').should(haveText('["foo",["bar","baz","bob"]]'))
    },
)

test('supports objects',
    [html`
        <div x-data="{ items: $queryString({ foo: 'bar' }) }">
            <button @click="items.bob = 'lob'">Inc</button>
            <span x-text="JSON.stringify(items)"></span>
        </div>
    `],
    ({ get, url, go }, reload) => {
        get('span').should(haveText('{"foo":"bar"}'))
        url().should('not.include', '?items')
        get('button').click()
        get('span').should(haveText('{"foo":"bar","bob":"lob"}'))
        url().should('include', '?items[foo]=bar&items[bob]=lob')
        reload()
        url().should('include', '?items[foo]=bar&items[bob]=lob')
        get('span').should(haveText('{"foo":"bar","bob":"lob"}'))
    },
)

test('encodes values according to RFC 1738 (plus signs for spaces)',
    [html`
        <div x-data="{ foo: $queryString('hey&there').alwaysShow(), bar: $queryString('hey there').alwaysShow() }">
            <span x-text="JSON.stringify(foo)+JSON.stringify(bar)"></span>
        </div>
    `],
    ({ get, url, go }, reload) => {
        url().should('include', '?foo=hey%26there&bar=hey+there')
        get('span').should(haveText('"hey&there""hey there"'))
        reload()
        url().should('include', '?foo=hey%26there&bar=hey+there')
        get('span').should(haveText('"hey&there""hey there"'))
    },
)
