import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

jest.spyOn(window, 'setTimeout').mockImplementation((callback) => {
    callback()
})
const a = jest.fn();
process.on('unhandledRejection', (error) => {
    a(error)
})

test('error in x-data eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' ">
            <span x-bind:foo="foo.bar"></span>
        </div>
    `
    const startPromise = Alpine.start()
    await expect(startPromise).rejects.toThrow(`Could not run initialization on: <div x-data=\"{ foo: 'bar' \">
            <span x-bind:foo=\"foo.bar\"></span>
        </div>
SyntaxError: \"{ foo: 'bar' \" is invalid due to:
SyntaxError: Unexpected token ')'`)
})

test('error in x-bind eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: null }">
            <span x-bind:foo="foo.bar"></span>
        </div>
    `
    const startPromise = Alpine.start()
    await expect(startPromise).rejects.toThrow(`Could not run initialization on: <div x-data=\"{ foo: null }\">
            <span x-bind:foo=\"foo.bar\"></span>
        </div>
SyntaxError: \"foo.bar\" is invalid due to:
TypeError: Cannot read property 'bar' of null`)
})

test('error in x-model eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: null }">
            <input x-model="foo.bar">
        </div>
    `
    const startPromise = Alpine.start()
    await expect(startPromise).rejects.toThrow(`Could not run initialization on: <div x-data=\"{ foo: null }\">
            <input x-model="foo.bar">
        </div>
SyntaxError: "foo.bar" is invalid due to:
TypeError: Cannot read property 'bar' of null`)
})

test('error in x-for eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ arr: null }">
            <template x-for="element in arr">
                <span x-text="element"></span>
            </template>
        </div>
    `
    const startPromise = Alpine.start()
    await expect(startPromise).rejects.toThrow(`Could not run initialization on: <div x-data=\"{ arr: null }\">
            <template x-for=\"element in arr\">
                <span x-text=\"element\"></span>
            </template>
        </div>
TypeError: collection \"arr\" in x-for=\"element in arr\" is not an array, got "null"`)
})

// Skipped because the test fails due to an error being thrown and not being able to handle it.
test.skip('error in x-on eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div
            x-data="{hello: null}"
            x-on:click="hello.world"
        ></div>
    `
    await Alpine.start()
    document.querySelector('div').click()
    // a global error gets thrown, no way to stop it from failing the test
    await wait(() => {
        expect(a).toHaveBeenCalled()
    })
})
