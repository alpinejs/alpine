import { beEqualTo, beVisible, haveText, html, notBeVisible, test } from '../../utils'

test('can accept cookie',
    [html`
        <div x-data="{ accepted: $cookie() }">
            <button x-on:click="accepted='yes'">Accept Cookies</button>
            <span x-text="accepted"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText(''))
        get('button').click()
        get('span').should(haveText('yes'))
        reload()
        get('span').should(haveText('yes'))
    },
)

