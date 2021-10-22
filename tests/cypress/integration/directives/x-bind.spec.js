import { beHidden, beVisible, haveText, beChecked, haveAttribute, haveClasses, haveValue, notBeChecked, notHaveAttribute, notHaveClasses, test, html } from '../../utils'

test('sets attribute bindings on initialize',
    html`
        <div x-data="{ foo: 'bar' }">
            <span x-ref="me" x-bind:foo="foo">[Subject]</span>
        </div>
    `,
    ({ get }) => get('span').should(haveAttribute('foo', 'bar'))
)

test('sets undefined nested keys to empty string',
    html`
        <div x-data="{ nested: {} }">
            <span x-bind:foo="nested.field">
        </div>
    `,
    ({ get }) => get('span').should(haveAttribute('foo', ''))
)

test('style attribute bindings are added by string syntax',
    html`
        <div x-data="{ initialClass: 'foo' }">
            <span x-bind:class="initialClass"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveClasses(['foo']))
)

test('aria-pressed/checked attribute boolean values are cast to a true/false string',
    html`
        <div x-data="{ open: true }">
            <span x-bind:aria-pressed="open"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveAttribute('aria-pressed', 'true'))
)

test('non-boolean attributes set to null/undefined/false are removed from the element',
    html`
        <div x-data="{}">
            <a href="#hello" x-bind:href="null">null</a>
            <a href="#hello" x-bind:href="false">false</a>
            <a href="#hello" x-bind:href="undefined">undefined</a>
            <!-- custom attribute see https://github.com/alpinejs/alpine/issues/280 -->
            <span visible="true" x-bind:visible="null">null</span>
            <span visible="true" x-bind:visible="false">false</span>
            <span visible="true" x-bind:visible="undefined">undefined</span>
        </div>
    `,
    ({ get }) => {
        get('a:nth-child(1)').should(notHaveAttribute('href'))
        get('a:nth-child(2)').should(notHaveAttribute('href'))
        get('a:nth-child(3)').should(notHaveAttribute('href'))
        get('span:nth-child(1)').should(notHaveAttribute('visible'))
        get('span:nth-child(2)').should(notHaveAttribute('visible'))
        get('span:nth-child(3)').should(notHaveAttribute('visible'))
    }
)

test('non-boolean empty string attributes are not removed',
    html`
        <div x-data>
            <a href="#hello" x-bind:href="''"></a>
        </div>
    `,
    ({ get }) => get('a').should(haveAttribute('href', ''))
)

test('boolean attribute values are set to their attribute name if true and removed if false',
    html`
        <div x-data="{ isSet: true }">
            <span @click="isSet = false" id="setToFalse">Set To False</span>

            <input x-bind:disabled="isSet"></input>
            <input x-bind:checked="isSet"></input>
            <input x-bind:required="isSet"></input>
            <input x-bind:readonly="isSet"></input>
            <details x-bind:open="isSet"></details>
            <select x-bind:multiple="isSet"></select>
            <option x-bind:selected="isSet"></option>
            <textarea x-bind:autofocus="isSet"></textarea>
            <dl x-bind:itemscope="isSet"></dl>
            <form x-bind:novalidate="isSet"></form>
            <iframe
                x-bind:allowfullscreen="isSet"
                x-bind:allowpaymentrequest="isSet"
            ></iframe>
            <button x-bind:formnovalidate="isSet"></button>
            <audio
                x-bind:autoplay="isSet"
                x-bind:controls="isSet"
                x-bind:loop="isSet"
                x-bind:muted="isSet"
            ></audio>
            <video x-bind:playsinline="isSet"></video>
            <track x-bind:default="isSet" />
            <img x-bind:ismap="isSet" />
            <ol x-bind:reversed="isSet"></ol>
        </div>
    `,
    ({ get }) => {
        get('input:nth-of-type(1)').should(haveAttribute('disabled', 'disabled'))
        get('input:nth-of-type(2)').should(haveAttribute('checked', 'checked'))
        get('input:nth-of-type(3)').should(haveAttribute('required', 'required'))
        get('input:nth-of-type(4)').should(haveAttribute('readonly', 'readonly'))
        get('details').should(haveAttribute('open', 'open'))
        get('select').should(haveAttribute('multiple', 'multiple'))
        get('option').should(haveAttribute('selected', 'selected'))
        get('textarea').should(haveAttribute('autofocus', 'autofocus'))
        get('dl').should(haveAttribute('itemscope', 'itemscope'))
        get('form').should(haveAttribute('novalidate', 'novalidate'))
        get('iframe').should(haveAttribute('allowfullscreen', 'allowfullscreen'))
        get('iframe').should(haveAttribute('allowpaymentrequest', 'allowpaymentrequest'))
        get('button').should(haveAttribute('formnovalidate', 'formnovalidate'))
        get('audio').should(haveAttribute('autoplay', 'autoplay'))
        get('audio').should(haveAttribute('controls', 'controls'))
        get('audio').should(haveAttribute('loop', 'loop'))
        get('audio').should(haveAttribute('muted', 'muted'))
        get('video').should(haveAttribute('playsinline', 'playsinline'))
        get('track').should(haveAttribute('default', 'default'))
        get('img').should(haveAttribute('ismap', 'ismap'))
        get('ol').should(haveAttribute('reversed', 'reversed'))

        get('#setToFalse').click()

        get('input:nth-of-type(1)').should(notHaveAttribute('disabled'))
        get('input:nth-of-type(2)').should(notHaveAttribute('checked'))
        get('input:nth-of-type(3)').should(notHaveAttribute('required'))
        get('input:nth-of-type(4)').should(notHaveAttribute('readonly'))
        get('details').should(notHaveAttribute('open'))
        get('select').should(notHaveAttribute('multiple'))
        get('option').should(notHaveAttribute('selected'))
        get('textarea').should(notHaveAttribute('autofocus'))
        get('dl').should(notHaveAttribute('itemscope'))
        get('form').should(notHaveAttribute('novalidate'))
        get('iframe').should(notHaveAttribute('allowfullscreen'))
        get('iframe').should(notHaveAttribute('allowpaymentrequest'))
        get('button').should(notHaveAttribute('formnovalidate'))
        get('audio').should(notHaveAttribute('autoplay'))
        get('audio').should(notHaveAttribute('controls'))
        get('audio').should(notHaveAttribute('loop'))
        get('audio').should(notHaveAttribute('muted'))
        get('video').should(notHaveAttribute('playsinline'))
        get('track').should(notHaveAttribute('default'))
        get('img').should(notHaveAttribute('ismap'))
        get('ol').should(notHaveAttribute('reversed'))
        get('script').should(notHaveAttribute('async'))
        get('script').should(notHaveAttribute('defer'))
        get('script').should(notHaveAttribute('nomodule'))
    }
)

test('boolean empty string attributes are not removed',
    html`
        <div x-data="{}">
            <input x-bind:disabled="''">
        </div>
    `,
    ({ get }) => get('input').should(haveAttribute('disabled', 'disabled'))
)

test('binding supports short syntax',
    html`
        <div x-data="{ foo: 'bar' }">
            <span :class="foo"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveClasses(['bar']))
)

test('checkbox is unchecked by default',
    html`
        <div x-data="{foo: {bar: 'baz'}}">
            <input type="checkbox" x-bind:value="''"></input>
            <input type="checkbox" x-bind:value="'test'"></input>
            <input type="checkbox" x-bind:value="foo.bar"></input>
            <input type="checkbox" x-bind:value="0"></input>
            <input type="checkbox" x-bind:value="10"></input>
        </div>
    `,
    ({ get }) => {
        get('input:nth-of-type(1)').should(notBeChecked())
        get('input:nth-of-type(2)').should(notBeChecked())
        get('input:nth-of-type(3)').should(notBeChecked())
        get('input:nth-of-type(4)').should(notBeChecked())
        get('input:nth-of-type(5)').should(notBeChecked())
    }
)

test('radio is unchecked by default',
    html`
        <div x-data="{foo: {bar: 'baz'}}">
            <input type="radio" x-bind:value="''"></input>
            <input type="radio" x-bind:value="'test'"></input>
            <input type="radio" x-bind:value="foo.bar"></input>
            <input type="radio" x-bind:value="0"></input>
            <input type="radio" x-bind:value="10"></input>
        </div>
    `,
    ({ get }) => {
        get('input:nth-of-type(1)').should(notBeChecked())
        get('input:nth-of-type(2)').should(notBeChecked())
        get('input:nth-of-type(3)').should(notBeChecked())
        get('input:nth-of-type(4)').should(notBeChecked())
        get('input:nth-of-type(5)').should(notBeChecked())
    }
)

test('checkbox values are set correctly',
    html`
        <div x-data="{ stringValue: 'foo', trueValue: true, falseValue: false }">
            <input type="checkbox" name="stringCheckbox" :value="stringValue" />
            <input type="checkbox" name="trueCheckbox" :value="trueValue" />
            <input type="checkbox" name="falseCheckbox" :value="falseValue" />
        </div>
    `,
    ({ get }) => {
        get('input:nth-of-type(1)').should(haveValue('foo'))
        get('input:nth-of-type(2)').should(haveValue('on'))
        get('input:nth-of-type(3)').should(haveValue('on'))
    }
)

test('radio values are set correctly',
    html`
        <div x-data="{lists: [{id: 1}, {id: 8}], selectedListID: '8'}">
            <template x-for="list in lists" :key="list.id">
                <input x-model="selectedListID" type="radio" :value="list.id.toString()" :id="'list-' + list.id">
            </template>
            <input type="radio" id="list-test" value="test" x-model="selectedListID">
        </div>
    `,
    ({ get }) => {
        get('#list-1').should(haveValue('1'))
        get('#list-1').should(notBeChecked())
        get('#list-8').should(haveValue('8'))
        get('#list-8').should(beChecked())
        get('#list-test').should(haveValue('test'))
        get('#list-test').should(notBeChecked())
    }
)

test('.camel modifier correctly sets name of attribute',
    html`
        <div x-data>
            <svg x-bind:view-box.camel="'0 0 42 42'"></svg>
        </div>
    `,
    ({ get }) => get('svg').should(haveAttribute('viewBox', '0 0 42 42'))
)

test('attribute binding names can contain numbers',
    html`
        <svg x-data>
            <line x1="1" y1="2" :x2="3" x-bind:y2="4" />
        </svg>
    `,
    ({ get }) => {
        get('line').should(haveAttribute('x2', '3'))
        get('line').should(haveAttribute('y2', '4'))
    }
)

test('non-string and non-boolean attributes are cast to string when bound to checkbox',
    html`
        <div x-data="{ number: 100, zero: 0, bool: true, nullProp: null }">
            <input type="checkbox" id="number" :value="number">
            <input type="checkbox" id="zero" :value="zero">
            <input type="checkbox" id="boolean" :value="bool">
            <input type="checkbox" id="null" :value="nullProp">
        </div>
    `,
    ({ get }) => {
        get('input:nth-of-type(1)').should(haveValue('100'))
        get('input:nth-of-type(2)').should(haveValue('0'))
        get('input:nth-of-type(3)').should(haveValue('on'))
        get('input:nth-of-type(4)').should(haveValue('on'))
    }
)

test('can bind an object of directives',
    html`
        <script>
            window.modal = function () {
                return {
                    foo: 'bar',
                    trigger: {
                        ['x-on:click']() { this.foo = 'baz' },
                    },
                    dialogue: {
                        ['x-text']() { return this.foo },
                    },
                }
            }
        </script>

        <div x-data="window.modal()">
            <button x-bind="trigger">Toggle</button>

            <span x-bind="dialogue">Modal Body</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('x-bind object syntax supports normal HTML attributes',
    html`
        <span x-data x-bind="{ foo: 'bar' }"></span>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('foo', 'bar'))
    }
)

test('x-bind object syntax supports normal HTML attributes mixed in with dynamic ones',
    html`
        <span x-data x-bind="{ 'x-bind:bob'() { return 'lob'; }, foo: 'bar', 'x-bind:bab'() { return 'lab' } }"></span>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('foo', 'bar'))
        get('span').should(haveAttribute('bob', 'lob'))
        get('span').should(haveAttribute('bab', 'lab'))
    }
)

test('x-bind object syntax supports x-for',
    html`
        <script>
            window.todos = () => { return {
                todos: ['foo', 'bar'],
                outputForExpression: {
                    ['x-for']: 'todo in todos',
                }
            }}
        </script>
        <div x-data="window.todos()">
            <ul>
                <template x-bind="outputForExpression">
                    <li x-text="todo"></li>
                </template>
            </ul>
        </div>
    `,
    ({ get }) => {
        get('li:nth-of-type(1)').should(haveText('foo'))
        get('li:nth-of-type(2)').should(haveText('bar'))
    }
)

test('x-bind object syntax syntax supports x-transition',
    html`
        <style>
            .transition { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
            .duration-100 { transition-duration: 100ms; }
        </style>
        <script>
            window.transitions = () => { return {
                show: true,
                outputClickExpression: {
                    ['@click']() { this.show = false },
                    ['x-text']() { return 'Click Me' },
                },
                outputTransitionExpression: {
                    ['x-show']() { return this.show },
                    ['x-transition:enter']: 'transition duration-100',
                    ['x-transition:leave']: 'transition duration-100',
                },
            }}
        </script>
        <div x-data="transitions()">
            <button x-bind="outputClickExpression"></button>

            <span x-bind="outputTransitionExpression">thing</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(beVisible())
        get('button').click()
        get('span').should(beVisible())
        get('span').should(beHidden())
    }
)

test('x-bind object syntax event handlers defined as functions receive the event object as their first argument',
    html`
        <script>
            window.data = () => { return {
                button: {
                    ['@click']() {
                        this.$refs.span.innerText = this.$el.id
                    }
                }
            }}
        </script>
        <div x-data="window.data()">
            <button x-bind="button" id="bar">click me</button>

            <span x-ref="span">foo</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('foo'))
        get('button').click()
        get('span').should(haveText('bar'))
    }
)
