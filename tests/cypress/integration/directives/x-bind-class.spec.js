import { beHidden, beVisible, haveText, beChecked, haveAttribute, haveClasses, haveValue, notBeChecked, notHaveAttribute, notHaveClasses, test, html } from '../../utils'

test('class attribute bindings are merged by string syntax',
    html`
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="isOn ? 'bar': ''"></span>

            <button @click="isOn = ! isOn">button</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveClasses(['foo']))
        get('span').should(notHaveClasses(['bar']))
        get('button').click()
        get('span').should(haveClasses(['foo']))
        get('span').should(haveClasses(['bar']))
    }
)

test('class attribute bindings are added by string syntax',
    html`
        <div x-data="{ initialClass: 'foo' }">
            <span x-bind:class="initialClass"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveClasses(['foo']))
)

test('class attribute bindings are added by array syntax',
    html`
        <div x-data="{ initialClass: 'foo' }">
            <span x-bind:class="[initialClass, 'bar']"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveClasses(['foo', 'bar']))
)

test('class attribute bindings are added by object syntax',
    html`
        <div x-data="{ mode: 0 }">
            <span class="foo baz"
                  x-bind:class="{
                      'foo bar border-blue-900' : mode === 0,
                      'foo bar border-red-900' : mode === 1,
                      'bar border-red-900' : mode === 2,
                  }"
            ></span>

            <button @click="mode = (mode + 1) % 3">button</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveClasses(['foo', 'baz']))
        get('span').should(haveClasses(['bar', 'border-blue-900']))
        get('span').should(notHaveClasses(['border-red-900']))
        get('button').click()
        get('span').should(haveClasses(['foo', 'baz']))
        get('span').should(haveClasses(['bar', 'border-red-900']))
        get('span').should(notHaveClasses(['border-blue-900']))
        get('button').click()
        get('span').should(haveClasses(['baz']))
        get('span').should(haveClasses(['bar', 'border-red-900']))
        get('span').should(notHaveClasses(['foo']))
        get('span').should(notHaveClasses(['border-blue-900']))
    }
)

test('classes are removed before being added',
    html`
        <div x-data="{ isOpen: true }">
            <span class="text-red" :class="isOpen ? 'block' : 'hidden'">
                Span
            </span>
            <button @click="isOpen = !isOpen">click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveClasses(['block', 'text-red']))
        get('button').click()
        get('span').should(haveClasses(['hidden', 'text-red']))
        get('span').should(notHaveClasses(['block']))
    }
)

test('extra whitespace in class binding string syntax is ignored',
    html`
        <div x-data>
            <span x-bind:class="'  foo  bar  '"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveClasses(['foo', 'bar']))
)

test('undefined class binding resolves to empty string',
    html`
        <div x-data="{ errorClass: (hasError) => { if (hasError) { return 'red' } } }">
            <span id="error" x-bind:class="errorClass(true)">should be red</span>
            <span id="empty" x-bind:class="errorClass(false)">should be empty</span>
        </div>
    `,
    ({ get }) => {
        get('span:nth-of-type(1)').should(haveClasses(['red']))
        get('span:nth-of-type(2)').should(notHaveClasses(['red']))
    }
)
