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

    expect(document.querySelector('span').classList.contains('foo')).toBeTruthy
})

test('class attribute bindings are synced by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 'bar baz'}">
            <span class="" x-bind:class="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').classList.contains('bar')).toBeTruthy
    expect(document.querySelector('span').classList.contains('baz')).toBeTruthy
})

test('style attribute bindings are merged by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span style="display: inline" x-bind:style="isOn ? 'margin-top: 10px': ''"></span>

            <button @click="isOn = ! isOn"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').style.display).toBeTruthy()
    expect(document.querySelector('span').style.display).toEqual('inline')
    expect(document.querySelector('span').style.marginTop).toBeFalsy()

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').style.display).toBeTruthy()
        expect(document.querySelector('span').style.display).toEqual('inline')
        expect(document.querySelector('span').style.marginTop).toBeTruthy()
        expect(document.querySelector('span').style.marginTop).toEqual('10px')
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').style.display).toBeTruthy()
        expect(document.querySelector('span').style.display).toEqual('inline')
        expect(document.querySelector('span').style.marginTop).toBeFalsy()
    })
})

test('style attribute bindings are merged by array syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ isOn: false }">
            <span
                style="display: inline"
                x-bind:style="isOn ? ['display: hidden; width: 200px;', 'height: 20px;']: ['margin-left: 150px;']"
            ></span>

            <button @click="isOn = ! isOn"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').style.display).toBeTruthy()
    expect(document.querySelector('span').style.display).toEqual('inline')
    expect(document.querySelector('span').style.width).toBeFalsy()
    expect(document.querySelector('span').style.height).toBeFalsy()
    expect(document.querySelector('span').style.marginLeft).toBeTruthy()
    expect(document.querySelector('span').style.marginLeft).toEqual('150px')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').style.display).toBeTruthy()
    expect(document.querySelector('span').style.display).toEqual('hidden')
    expect(document.querySelector('span').style.width).toBeTruthy()
    expect(document.querySelector('span').style.width).toEqual('200px')
    expect(document.querySelector('span').style.height).toBeTruthy()
    expect(document.querySelector('span').style.height).toEqual('20px')
    expect(document.querySelector('span').style.marginLeft).toBeFalsy()
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').style.display).toBeTruthy()
        expect(document.querySelector('span').style.display).toEqual('inline')
        expect(document.querySelector('span').style.width).toBeFalsy()
        expect(document.querySelector('span').style.height).toBeFalsy()
        expect(document.querySelector('span').style.marginLeft).toBeTruthy()
        expect(document.querySelector('span').style.marginLeft).toEqual('150px')
    })
})

test('style attribute bindings are removed by object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ display: false }">
            <span style="display: inline" x-bind:style="{ display: false }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').style.display).toBeFalsy()
})

test('style attribute bindings are added by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ initialStyles: 'display: hidden' }">
            <span x-bind:style="initialStyles"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').style.display).toBeTruthy()
    expect(document.querySelector('span').style.display).toEqual('hidden')
})

test('style attribute bindings are added by object syntax, concatenation works & name is camelized', async () => {
    document.body.innerHTML = `
        <div x-data="{ numberValue: 20 }">
            <span x-bind:style="{ 'padding-left': numberValue + 'px' }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').style.paddingLeft).toBeTruthy()
    expect(document.querySelector('span').style.paddingLeft).toEqual('20px')
})

test('style attribute bindings are added by nested object syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{ nested: { styleValue: '12px' } }">
            <span x-bind:style="{ paddingLeft: nested.styleValue }"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').style.paddingLeft).toBeTruthy()
    expect(document.querySelector('span').style.paddingLeft).toEqual('12px')
})

test('style attribute bindings are added by array syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <span class="" x-bind:style="['display: inline;', 'padding-top: 100px']"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').style.display).toBeTruthy()
    expect(document.querySelector('span').style.display).toEqual('inline')
    expect(document.querySelector('span').style.paddingTop).toBeTruthy()
    expect(document.querySelector('span').style.paddingTop).toEqual('100px')
})

test('style attribute bindings are synced by string syntax', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 'display: hidden; cursor: pointer;'}">
            <span style="display: inline" x-bind:style="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').style.display).toBeTruthy()
    expect(document.querySelector('span').style.display).toEqual('hidden')
    expect(document.querySelector('span').style.cursor).toBeTruthy()
    expect(document.querySelector('span').style.cursor).toEqual('pointer')
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