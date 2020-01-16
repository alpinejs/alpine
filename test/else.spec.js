import Alpine from 'alpinejs'

global.MutationObserver = class {
    observe() {}
}

// Test that the x-else is hidden, if the preceding x-if is shown.
test('x-else hidden', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: false }">
            <template x-if="show">
                <p class="if"></pc>
            </template>
            <template x-else>
                <p class="else"></pc>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p.if')).toBeNull()
    expect(document.querySelector('p.else')).toBeTruthy()
})

// Test that the x-else is shown, if the preceding x-if is hidden.
test('x-else visible', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <template x-if="show">
                <p class="if"></pc>
            </template>
            <template x-else>
                <p class="else"></pc>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p.if')).toBeTruthy()
    expect(document.querySelector('p.else')).toBeNull()
})

// TODO - test when x-else is used after something that isn't a <template> tag
// TODO - test when x-else if used after something without x-if
// TODO - test when there was no previous element.
