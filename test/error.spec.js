import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

jest.spyOn(window, 'setTimeout').mockImplementation((callback) => {
    callback()
})

const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

beforeEach(() => {
    jest.clearAllMocks()
})

test('error in x-data eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' ">
            <span x-bind:foo="foo.bar"></span>
        </div>
    `
    await expect(Alpine.start()).rejects.toThrow()
    expect(mockConsoleWarn).toHaveBeenCalledWith(
        `Alpine Error: "SyntaxError: Unexpected token ')'"\n\nExpression: "{ foo: 'bar' "\nElement:`,
        document.querySelector('[x-data]'),
    )
})

test('error in x-init eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data x-init="foo.bar = 'baz'">
        </div>
    `
    await Alpine.start()
    expect(mockConsoleWarn).toHaveBeenCalledWith(
        `Alpine Error: "ReferenceError: foo is not defined"\n\nExpression: "foo.bar = 'baz'"\nElement:`,
        document.querySelector('[x-data]'),
    )
})

test('error in x-spread eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data x-spread="foo.bar">
        </div>
    `
    // swallow the rendering error
    await expect(Alpine.start()).rejects.toThrow()
    expect(mockConsoleWarn).toHaveBeenCalledWith(
        `Alpine Error: "ReferenceError: foo is not defined"\n\nExpression: "foo.bar"\nElement:`,
        document.querySelector('[x-data]'),
    )
})

test('error in x-bind eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: null }">
            <span x-bind:foo="foo.bar"></span>
        </div>
    `
    await Alpine.start()
    expect(mockConsoleWarn).toHaveBeenCalledWith(
        `Alpine Error: "TypeError: Cannot read property 'bar' of null"\n\nExpression: "foo.bar"\nElement:`,
        document.querySelector('[x-bind:foo]'),
    )
})

test('error in x-model eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: null }">
            <input x-model="foo.bar">
        </div>
    `
    await Alpine.start()
    expect(mockConsoleWarn).toHaveBeenCalledWith(
        `Alpine Error: "TypeError: Cannot read property 'bar' of null"\n\nExpression: "foo.bar"\nElement:`,
        document.querySelector('[x-model]',)
    )
})

test('error in x-for eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <template x-for="element in foo">
                <span x-text="element"></span>
            </template>
        </div>
    `
    await expect(Alpine.start()).rejects.toThrow()
    expect(mockConsoleWarn).toHaveBeenCalledWith(
        `Alpine Error: "ReferenceError: foo is not defined"\n\nExpression: "foo"\nElement:`,
        document.querySelector('[x-for]',)
    )
})

test('error in x-on eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div
            x-data="{hello: null}"
            x-on:click="hello.world"
        ></div>
    `
    await Alpine.start()
    document.querySelector('div').click()
    await wait(() => {
        expect(mockConsoleWarn).toHaveBeenCalledWith(
            `Alpine Error: "TypeError: Cannot read property 'world' of null"\n\nExpression: "hello.world"\nElement:`,
            document.querySelector('[x-data]',)
        )
    })
})
