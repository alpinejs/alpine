import { haveAttribute, haveText, html, test } from '../../utils'

test('$id generates a unique id',
    html`
        <div x-data x-id="['foo']" id="1">
            <div>
                <h1 :id="$id('foo')"></h1>
            </div>

            <span :aria-labelledby="$id('foo')"></span>
        </div>

        <div x-data x-id="['foo']" id="2">
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
        <div x-data x-id="['foo']" id="1">
            <!-- foo-1-3 -->
            <span :aria-activedescendant="$id('foo', 3)"></span>

            <ul>
                <li x-data :id="$id('foo', 1)"></li> <!-- foo-1-1 -->
                <li x-data :id="$id('foo', 2)"></li> <!-- foo-1-2 -->
                <li x-data :id="$id('foo', 3)"></li> <!-- foo-1-3 -->
            </ul>
        </div>

        <div x-data x-id="['foo']" id="2">
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
        get('#2 span').should(haveAttribute('aria-activedescendant', 'foo-2-3'))
        get('#2 li:nth-child(1)').should(haveAttribute('id', 'foo-2-1'))
        get('#2 li:nth-child(2)').should(haveAttribute('id', 'foo-2-2'))
        get('#2 li:nth-child(3)').should(haveAttribute('id', 'foo-2-3'))
    }
)

test('$id scopes are grouped by name',
    html`
        <div x-data x-id="['foo']">
            <!-- foo-1 -->
            <span :aria-activedescendant="$id('foo')"></span>

            <ul>
                <li x-data x-id="['bar']" :id="$id('bar')"></li> <!-- bar-1 -->
                <li x-data x-id="['bar']" :id="$id('bar')"></li> <!-- bar-2 -->
            </ul>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('aria-activedescendant', 'foo-1'))
        get('li:nth-child(1)').should(haveAttribute('id', 'bar-1'))
        get('li:nth-child(2)').should(haveAttribute('id', 'bar-2'))
    }
)

test('$ids are globally unique when outside x-id',
    html`
        <div x-data>
            <h1 :id="$id('foo')"></h1>
            <h2 :id="$id('foo')"></h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveAttribute('id', 'foo-1'))
        get('h2').should(haveAttribute('id', 'foo-2'))
    }
)

test('$id scopes can be reset',
    html`
        <div x-data x-id="['foo', 'bar']">
            <!-- foo-1 -->
            <span :aria-labelledby="$id('foo')"></span>

            <div x-data>
                <h1 :id="$id('foo')"></h1>
                <h5 :id="$id('bar')"></h5>
                
                <div x-id="['foo']">
                    <h2 :aria-labelledby="$id('foo')"></h2>
                    <h6 :aria-labelledby="$id('bar')"></h6>

                    <div x-data>
                        <h3 :id="$id('foo')"></h3>
                    </div>
                </div>

                <h4 :id="$id('foo')"></h4>
            </div>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('aria-labelledby', 'foo-1'))
        get('h1').should(haveAttribute('id', 'foo-1'))
        get('h2').should(haveAttribute('aria-labelledby', 'foo-2'))
        get('h3').should(haveAttribute('id', 'foo-2'))
        get('h4').should(haveAttribute('id', 'foo-1'))
        get('h5').should(haveAttribute('id', 'bar-1'))
        get('h6').should(haveAttribute('aria-labelledby', 'bar-1'))
    }
)
