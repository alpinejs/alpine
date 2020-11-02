import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('attribute bindings are set on initialize', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-bind:foo="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('foo')).toEqual('bar')
})

test('class attribute bindings are merged by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="isOn ? 'bar': ''"></span>

            <button @click="isOn = ! isOn"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('bar')).toBeFalsy()

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('bar')).toBeFalsy()
    })
})

test('class attribute bindings are merged by array syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="isOn ? ['bar', 'baz']: ['bar']"></span>

            <button @click="isOn = ! isOn"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('baz')).toBeFalsy()

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('baz')).toBeTruthy()
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('baz')).toBeFalsy()
    })
})

test('class attribute bindings are removed by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo" x-bind:class="{ 'foo': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy()
})

test('class attribute bindings are added by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ initialClass: 'foo' }">
            <span x-bind:class="initialClass"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
})

test('class attribute bindings are added by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: true }">
            <span x-bind:class="{ 'foo': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
})

test('multiple classes are removed by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo bar" x-bind:class="{ 'foo bar': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy()
    expect(document.querySelector('span').classList.contains('bar')).toBeFalsy()
})

test('multiple classes are added by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: true }">
            <span x-bind:class="{ 'foo bar': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
})

test('class attribute bindings are added by nested object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ nested: { isOn: true } }">
            <span x-bind:class="{ 'foo': nested.isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
})

test('class attribute bindings are added by array syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <span class="" x-bind:class="['foo']"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
})

test('class attribute bindings are synced by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 'bar baz'}">
            <span class="" x-bind:class="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('baz')).toBeTruthy()
})

test('non-boolean attributes set to null/undefined/false are removed from the element', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <a href="#hello" x-bind:href="null"></a>
            <a href="#hello" x-bind:href="false"></a>
            <a href="#hello" x-bind:href="undefined"></a>
            <!-- custom attribute see https://github.com/alpinejs/alpine/issues/280 -->
            <span visible="true" x-bind:visible="null"></span>
            <span visible="true" x-bind:visible="false"></span>
            <span visible="true" x-bind:visible="undefined"></span>
        </div>
    `
    Alpine.start()

    expect(document.querySelectorAll('a')[0].getAttribute('href')).toBeNull()
    expect(document.querySelectorAll('a')[1].getAttribute('href')).toBeNull()
    expect(document.querySelectorAll('a')[2].getAttribute('href')).toBeNull()
    expect(document.querySelectorAll('span')[0].getAttribute('visible')).toBeNull()
    expect(document.querySelectorAll('span')[1].getAttribute('visible')).toBeNull()
    expect(document.querySelectorAll('span')[2].getAttribute('visible')).toBeNull()
})

test('non-boolean empty string attributes are not removed', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <a href="#hello" x-bind:href="''"></a>
        </div>
    `
    Alpine.start()

    expect(document.querySelectorAll('a')[0].getAttribute('href')).toEqual('')
})

test('truthy boolean attribute values are set to their attribute name', async () => {
    document.body.innerHTML = `
        <div x-data="{ isSet: true }">
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
            <script
                x-bind:async="isSet"
                x-bind:defer="isSet"
                x-bind:nomodule="isSet"
            ></script>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].disabled).toBeTruthy()
    expect(document.querySelectorAll('input')[1].checked).toBeTruthy()
    expect(document.querySelectorAll('input')[2].required).toBeTruthy()
    expect(document.querySelectorAll('input')[3].readOnly).toBeTruthy()
    expect(document.querySelectorAll('details')[0].open).toBeTruthy()
    expect(document.querySelectorAll('option')[0].selected).toBeTruthy()
    expect(document.querySelectorAll('select')[0].multiple).toBeTruthy()
    expect(document.querySelectorAll('textarea')[0].autofocus).toBeTruthy()
    expect(document.querySelectorAll('dl')[0].attributes.itemscope).toBeTruthy()
    expect(document.querySelectorAll('form')[0].attributes.novalidate).toBeTruthy()
    expect(document.querySelectorAll('iframe')[0].attributes.allowfullscreen).toBeTruthy()
    expect(document.querySelectorAll('iframe')[0].attributes.allowpaymentrequest).toBeTruthy()
    expect(document.querySelectorAll('button')[0].attributes.formnovalidate).toBeTruthy()
    expect(document.querySelectorAll('audio')[0].attributes.autoplay).toBeTruthy()
    expect(document.querySelectorAll('audio')[0].attributes.controls).toBeTruthy()
    expect(document.querySelectorAll('audio')[0].attributes.loop).toBeTruthy()
    expect(document.querySelectorAll('audio')[0].attributes.muted).toBeTruthy()
    expect(document.querySelectorAll('video')[0].attributes.playsinline).toBeTruthy()
    expect(document.querySelectorAll('track')[0].attributes.default).toBeTruthy()
    expect(document.querySelectorAll('img')[0].attributes.ismap).toBeTruthy()
    expect(document.querySelectorAll('ol')[0].attributes.reversed).toBeTruthy()
    expect(document.querySelectorAll('script')[0].attributes.async).toBeTruthy()
    expect(document.querySelectorAll('script')[0].attributes.defer).toBeTruthy()
    expect(document.querySelectorAll('script')[0].attributes.nomodule).toBeTruthy()
})

test('null, undefined, or false boolean attribute values are removed', async () => {
    document.body.innerHTML = `
        <div x-data="{ isSet: false }">
            <input x-bind:disabled="isSet"></input>
            <input x-bind:checked="isSet"></input>
            <input x-bind:required="isSet"></input>
            <input x-bind:readonly="isSet"></input>
            <input x-bind:hidden="isSet"></input>
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
            <script
                x-bind:async="isSet"
                x-bind:defer="isSet"
                x-bind:nomodule="isSet"
            ></script>
        </div>
    `
    Alpine.start()

    expect(document.querySelectorAll('input')[0].getAttribute('disabled')).toBeNull()
    expect(document.querySelectorAll('input')[1].getAttribute('checked')).toBeNull()
    expect(document.querySelectorAll('input')[2].getAttribute('required')).toBeNull()
    expect(document.querySelectorAll('input')[3].getAttribute('readOnly')).toBeNull()
    expect(document.querySelectorAll('input')[4].getAttribute('hidden')).toBeNull()
    expect(document.querySelectorAll('details')[0].getAttribute('open')).toBeNull()
    expect(document.querySelectorAll('option')[0].getAttribute('selected')).toBeNull()
    expect(document.querySelectorAll('select')[0].getAttribute('multiple')).toBeNull()
    expect(document.querySelectorAll('textarea')[0].getAttribute('autofocus')).toBeNull()
    expect(document.querySelectorAll('dl')[0].getAttribute('itemscope')).toBeNull()
    expect(document.querySelectorAll('form')[0].getAttribute('novalidate')).toBeNull()
    expect(document.querySelectorAll('iframe')[0].getAttribute('allowfullscreen')).toBeNull()
    expect(document.querySelectorAll('iframe')[0].getAttribute('allowpaymentrequest')).toBeNull()
    expect(document.querySelectorAll('button')[0].getAttribute('formnovalidate')).toBeNull()
    expect(document.querySelectorAll('audio')[0].getAttribute('autoplay')).toBeNull()
    expect(document.querySelectorAll('audio')[0].getAttribute('controls')).toBeNull()
    expect(document.querySelectorAll('audio')[0].getAttribute('loop')).toBeNull()
    expect(document.querySelectorAll('audio')[0].getAttribute('muted')).toBeNull()
    expect(document.querySelectorAll('video')[0].getAttribute('playsinline')).toBeNull()
    expect(document.querySelectorAll('track')[0].getAttribute('default')).toBeNull()
    expect(document.querySelectorAll('img')[0].getAttribute('ismap')).toBeNull()
    expect(document.querySelectorAll('ol')[0].getAttribute('reversed')).toBeNull()
    expect(document.querySelectorAll('script')[0].getAttribute('async')).toBeNull()
    expect(document.querySelectorAll('script')[0].getAttribute('defer')).toBeNull()
    expect(document.querySelectorAll('script')[0].getAttribute('nomodule')).toBeNull()
})

test('boolean empty string attributes are not removed', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <input x-bind:disabled="''">
        </div>
    `
    Alpine.start()

    expect(document.querySelectorAll('input')[0].disabled).toEqual(true)
})

test('binding supports short syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span :class="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
})

test('checkbox is unchecked by default', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: {bar: 'baz'}}">
            <input type="checkbox" x-bind:value="''"></input>
            <input type="checkbox" x-bind:value="'test'"></input>
            <input type="checkbox" x-bind:value="foo.bar"></input>
            <input type="checkbox" x-bind:value="0"></input>
            <input type="checkbox" x-bind:value="10"></input>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[1].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[2].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[3].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[4].checked).toBeFalsy()
})

test('radio is unchecked by default', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: {bar: 'baz'}}">
            <input type="radio" x-bind:value="''"></input>
            <input type="radio" x-bind:value="'test'"></input>
            <input type="radio" x-bind:value="foo.bar"></input>
            <input type="radio" x-bind:value="0"></input>
            <input type="radio" x-bind:value="10"></input>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[1].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[2].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[3].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[4].checked).toBeFalsy()
})

test('checkbox values are set correctly', async () => {
    document.body.innerHTML = `
        <div x-data="{ stringValue: 'foo', trueValue: true, falseValue: false }">
            <input type="checkbox" name="stringCheckbox" :value="stringValue" />
            <input type="checkbox" name="trueCheckbox" :value="trueValue" />
            <input type="checkbox" name="falseCheckbox" :value="falseValue" />
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input[name="trueCheckbox"]').value).toEqual('on')
    expect(document.querySelector('input[name="falseCheckbox"]').value).toEqual('on')
    expect(document.querySelector('input[name="stringCheckbox"]').value).toEqual('foo')
});

test('radio values are set correctly', async () => {
    document.body.innerHTML = `
        <div x-data="{lists: [{id: 1}, {id: 8}], selectedListID: '8'}">
            <template x-for="list in lists" :key="list.id">
                <input x-model="selectedListID" type="radio" :value="list.id.toString()" :id="'list-' + list.id">
            </template>
            <input type="radio" id="list-test" value="test" x-model="selectedListID">
        </div>
    `

    Alpine.start()

    expect(document.querySelector('#list-1').value).toEqual('1')
    expect(document.querySelector('#list-1').checked).toBeFalsy()
    expect(document.querySelector('#list-8').value).toEqual('8')
    expect(document.querySelector('#list-8').checked).toBeTruthy()
    expect(document.querySelector('#list-test').value).toEqual('test')
    expect(document.querySelector('#list-test').checked).toBeFalsy()
});

test('classes are removed before being added', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOpen: true }">
            <span :class="{ 'text-red block': isOpen, 'text-red hidden': !isOpen }">
                Span
            </span>
            <button @click="isOpen = !isOpen"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('block')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('text-red')).toBeTruthy()

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').classList.contains('block')).toBeFalsy()
        expect(document.querySelector('span').classList.contains('hidden')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('text-red')).toBeTruthy()
    })
});

test('extra whitespace in class binding object syntax is ignored', async () => {
    document.body.innerHTML = `
        <div x-data>
            <span x-bind:class="{ '  foo  bar  ': true }"></span>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
})

test('extra whitespace in class binding string syntax is ignored', async () => {
    document.body.innerHTML = `
        <div x-data>
            <span x-bind:class="'  foo  bar  '"></span>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy()
    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
})

test('undefined class binding resolves to empty string', async () => {
    jest.spyOn(window, 'setTimeout').mockImplementation((callback,time) => {
        callback()
    });

    document.body.innerHTML = `
        <div x-data="{ errorClass: (hasError) => { if (hasError) { return 'red' } } }">
            <span id="error" x-bind:class="errorClass(true)">should be red</span>
            <span id="empty" x-bind:class="errorClass(false)">should be empty</span>
        </div>
    `

    await expect(Alpine.start()).resolves.toBeUndefined()

    expect(document.querySelector('#error').classList.value).toEqual('red')
    expect(document.querySelector('#empty').classList.value).toEqual('')
})

test('.camel modifier correctly sets name of attribute', async () => {
    document.body.innerHTML = `
        <div x-data>
            <svg x-bind:view-box.camel="'0 0 42 42'"></svg>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('svg').getAttribute('viewBox')).toEqual('0 0 42 42')
})


test('attribute binding names can contain numbers', async () => {
    document.body.innerHTML = `
        <svg x-data>
            <line x1="1" y1="2" :x2="3" x-bind:y2="4" />
        </svg>
    `;

    Alpine.start();

    expect(document.querySelector('line').getAttribute('x2')).toEqual('3');
    expect(document.querySelector('line').getAttribute('y2')).toEqual('4');
})

test('non-string and non-boolean attributes are cast to string when bound to checkbox', () => {
    document.body.innerHTML = `
        <div x-data="{ number: 100, zero: 0, bool: true, nullProp: null }">
            <input type="checkbox" id="number" :value="number">
            <input type="checkbox" id="zero" :value="zero">
            <input type="checkbox" id="boolean" :value="bool">
            <input type="checkbox" id="null" :value="nullProp">
        </div>
    `

    Alpine.start()

    expect(document.querySelector('#number').value).toEqual('100')
    expect(document.querySelector('#zero').value).toEqual('0')
    expect(document.querySelector('#boolean').value).toEqual('on')
    expect(document.querySelector('#null').value).toEqual('on')
})
