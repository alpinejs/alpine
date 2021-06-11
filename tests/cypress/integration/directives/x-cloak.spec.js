import { html, notHaveAttribute, test } from '../../utils'

test('x-cloak is removed',
    html`
        <div x-data="{ hidden: true }">
            <span x-cloak></span>
        </div>
    `,
    ({ get }) => get('span').should(notHaveAttribute('x-cloak'))
)
