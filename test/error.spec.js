import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

jest.spyOn(window, 'setTimeout').mockImplementation((callback) => {
    callback()
})

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

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
    expect(mockConsoleError).toHaveBeenCalledWith(
        "Alpine: error in expression \"{ foo: 'bar' \" in component:",
        document.querySelector('[x-data]'),
        "due to \"SyntaxError: Unexpected token ')'\""
    )
})

test('error in x-bind eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: null }">
            <span x-bind:foo="foo.bar"></span>
        </div>
    `
    await Alpine.start()
    expect(mockConsoleError).toHaveBeenCalledWith(
        "Alpine: error in expression \"foo.bar\" in component:",
        document.querySelector('[x-bind:foo]'),
        "due to \"TypeError: Cannot read property 'bar' of null\""
    )
})

test('error in x-model eval contains element, expression and original error', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: null }">
            <input x-model="foo.bar">
        </div>
    `
    await Alpine.start()
    expect(mockConsoleError).toHaveBeenCalledWith(
        "Alpine: error in expression \"foo.bar\" in component:",
        document.querySelector('[x-model]'),
        "due to \"TypeError: Cannot read property 'bar' of null\""
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
    expect(mockConsoleError).toHaveBeenCalledWith(
        "Alpine: error in expression \"foo\" in component:",
        document.querySelector('[x-for]'),
        "due to \"ReferenceError: foo is not defined\""
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
        expect(mockConsoleError).toHaveBeenCalled()
    })
})
