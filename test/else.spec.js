import Alpine from 'alpinejs'

global.MutationObserver = class {
    observe() {}
}

const originalConsoleWarn = console.warn;

// array of warnings from console.warn() calls:
const warnings = [];

beforeEach(() => {
    console.warn = warning => warnings.push(warning)
    // Clear warnings:
    warnings.length = 0
});

afterEach(() => {
    // Reset console.warn() method back to original.
    console.warn = originalConsoleWarn;
});

// Test that the x-else is hidden, if the preceding x-if is shown.
test('x-else hidden', () => {
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
test('x-else visible', () => {
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

test('x-else does not display if first child', () => {
    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <template x-else>
                <p class="else"></pc>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p.else')).toBeNull()
    expect(warnings.length).toBe(1)
    expect(warnings[0]).toBe(
        'AlpineJS Warning: Cannot use [x-else] if there was no previous sibling'
    );
})

test('x-else requires previous element to have x-if attribute', () => {
    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <template>Previous Element without x-if</template>
            <template x-else>
                <p class="else"></pc>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p.else')).toBeNull()
    expect(warnings.length).toBe(1)
    expect(warnings[0]).toBe(
        'AlpineJS Warning: Cannot use [x-else] if previous element was not a' +
        ' <template> element with "x-if" attribute'
    );
})

test('x-else requires previous to be <template>', () => {
    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <div>Previous Element</div>
            <template x-else>
                <p class="else"></pc>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p.else')).toBeNull()
    expect(warnings.length).toBe(1)
    expect(warnings[0]).toBe(
        'AlpineJS Warning: Cannot use [x-else] if previous element was not a' +
        ' <template> element with "x-if" attribute'
    );
})
