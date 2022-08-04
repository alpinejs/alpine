import { haveText, html, test } from '../../utils'

test('$fetch should get data from an api',
    html`
        <div x-data="{ apiResult: 'Empty' }">
            <button
                x-text="apiResult"
                @click="apiResult = await $fetch('https://weathermockapi.herokuapp.com/hello_world')"
            ></button>
        </div>
    `,
    ({ get }) => {
        get('button').should(haveText('Empty'))
        get('button').click()
        get('button').should(haveText('Hello, World!'))
    }
)
