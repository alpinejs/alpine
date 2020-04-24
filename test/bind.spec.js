import Alpine from 'alpinejs'
import { fireEvent, wait } from '@testing-library/dom'

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

test('multiple classes are added by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span class="foo bar" x-bind:class="{ 'foo bar': isOn }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('foo')).toBeFalsy()
    expect(document.querySelector('span').classList.contains('bar')).toBeFalsy()
})

test('multiple classes are removed by object syntax', async () => {
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

test('boolean attributes set to false are removed from element', async () => {
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

    expect(document.querySelectorAll('input')[0].disabled).toBeFalsy()
    expect(document.querySelectorAll('input')[1].checked).toBeFalsy()
    expect(document.querySelectorAll('input')[2].required).toBeFalsy()
    expect(document.querySelectorAll('input')[3].readOnly).toBeFalsy()
    expect(document.querySelectorAll('input')[4].hidden).toBeFalsy()
    expect(document.querySelectorAll('details')[0].open).toBeFalsy()
    expect(document.querySelectorAll('option')[0].selected).toBeFalsy()
    expect(document.querySelectorAll('select')[0].multiple).toBeFalsy()
    expect(document.querySelectorAll('textarea')[0].autofocus).toBeFalsy()
    expect(document.querySelectorAll('dl')[0].attributes.itemscope).toBeFalsy()
    expect(document.querySelectorAll('form')[0].attributes.novalidate).toBeFalsy()
    expect(document.querySelectorAll('iframe')[0].attributes.allowfullscreen).toBeFalsy()
    expect(document.querySelectorAll('iframe')[0].attributes.allowpaymentrequest).toBeFalsy()
    expect(document.querySelectorAll('button')[0].attributes.formnovalidate).toBeFalsy()
    expect(document.querySelectorAll('audio')[0].attributes.autoplay).toBeFalsy()
    expect(document.querySelectorAll('audio')[0].attributes.controls).toBeFalsy()
    expect(document.querySelectorAll('audio')[0].attributes.loop).toBeFalsy()
    expect(document.querySelectorAll('audio')[0].attributes.muted).toBeFalsy()
    expect(document.querySelectorAll('video')[0].attributes.playsinline).toBeFalsy()
    expect(document.querySelectorAll('track')[0].attributes.default).toBeFalsy()
    expect(document.querySelectorAll('img')[0].attributes.ismap).toBeFalsy()
    expect(document.querySelectorAll('ol')[0].attributes.reversed).toBeFalsy()
    expect(document.querySelectorAll('script')[0].attributes.async).toBeFalsy()
    expect(document.querySelectorAll('script')[0].attributes.defer).toBeFalsy()
    expect(document.querySelectorAll('script')[0].attributes.nomodule).toBeFalsy()
})

test('boolean attributes set to true are added to element', async () => {
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

test('binding supports short syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span :class="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy()
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

test('cursor position is preserved on selectable text input', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input type="text" x-model="foo" @select="foo = 'baz'">
        </div>
    `

    Alpine.start()

    document.querySelector('input').focus()

    expect(document.querySelector('input').value).toEqual('bar')
    expect(document.querySelector('input').selectionStart).toEqual(0)
    expect(document.querySelector('input').selectionEnd).toEqual(0)
    expect(document.querySelector('input').selectionDirection).toEqual('none')

    document.querySelector('input').setSelectionRange(0, 3, 'backward')

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('baz')
        expect(document.querySelector('input').selectionStart).toEqual(0)
        expect(document.querySelector('input').selectionEnd).toEqual(3)
        expect(document.querySelector('input').selectionDirection).toEqual('backward')
    })
})

// input elements that are not 'text', 'search', 'url', 'password' types
// will throw an exception when calling their setSelectionRange() method
// see issues #401 #404 #405
test('setSelectionRange is not called for inapplicable input types', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input type="hidden" x-model="foo">
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'baz' } })

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('baz')
    })
})
