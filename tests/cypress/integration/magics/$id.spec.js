import { haveAttribute, haveText, html, test } from '../../utils'

test('$id generates a unique id',
    html`
        <div x-data id="1">
            <span :aria-labelledby="$id('foo')"></span>

            <div>
                <h1 :id="$id('foo')"></h1>
            </div>
        </div>

        <div x-data id="2">
            <div>
                <h1 :id="$id('foo')"></h1>
            </div>

            <span :aria-labelledby="$id('foo')"></span>
        </div>
    `,
    ({ get }) => {
        get('#1 h1').should(haveAttribute('id', 'foo-1'))
        get('#1 span').should(haveAttribute('aria-labelledby', 'foo-1'))
        get('#2 h1').should(haveAttribute('id', 'foo-2'))
        get('#2 span').should(haveAttribute('aria-labelledby', 'foo-2'))
    }
)

test('$id works with keys and nested data scopes',
    html`
        <div x-data id="1">
            <!-- foo-1-3 -->
            <span :aria-activedescendant="$id('foo', 3)"></span>

            <ul>
                <li x-data :id="$id('foo', 1)"></li> <!-- foo-1-1 -->
                <li x-data :id="$id('foo', 2)"></li> <!-- foo-1-2 -->
                <li x-data :id="$id('foo', 3)"></li> <!-- foo-1-3 -->
            </ul>
        </div>

        <div x-data id="2">
            <!-- foo-2-3 -->
            <span :aria-activedescendant="$id('foo', 3)"></span>

            <ul>
                <li x-data :id="$id('foo', 1)"></li> <!-- foo-2-1 -->
                <li x-data :id="$id('foo', 2)"></li> <!-- foo-2-2 -->
                <li x-data :id="$id('foo', 3)"></li> <!-- foo-2-3 -->
            </ul>
        </div>
    `,
    ({ get }) => {
        get('#1 span').should(haveAttribute('aria-activedescendant', 'foo-1-3'))
        get('#1 li:nth-child(1)').should(haveAttribute('id', 'foo-1-1'))
        get('#1 li:nth-child(2)').should(haveAttribute('id', 'foo-1-2'))
        get('#1 li:nth-child(3)').should(haveAttribute('id', 'foo-1-3'))
    }
)
