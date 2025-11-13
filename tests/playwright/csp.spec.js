import { test, expect } from '@playwright/test';

const html = (s) => s[0]

test.beforeEach(async ({ page }) => await page.goto('/tests/playwright/csp.html'))

test('supports regular syntax', async ({ page }) => {
    await page.setContent(html`
        <div x-data="{ value: 0 }">
            <span x-text="value"></span>
            <button @click="value++">Increment</button>
        </div>
    `)
    let button = page.locator('button')
    let span = page.locator('span')

    await button.click()
    await expect(span).toHaveText('1')
})

test('throws when accessing document', async ({ page }) => {
    const logs = []

    page.on('console', msg => { logs.push(msg.text()) })

    await page.setContent(html`
        <div x-init="document"></div>
    `)

    await expect(logs[0]).toContain('Undefined variable: document')
})

test('returns undefined when accessing document via property', async ({ page }) => {
    await page.setContent(html`
        <span x-text="$el.ownerDocument === undefined ? 'is undefined': ''"></span>
    `)

    let span = page.locator('span')

    await expect(span).toHaveText('is undefined')
})

test('returns undefined when accessing document via computed property', async ({ page }) => {
    await page.setContent(html`
        <span x-text="$el['ownerDocument'] === undefined ? 'is undefined': ''"></span>
    `)

    let span = page.locator('span')

    await expect(span).toHaveText('is undefined')
})

test('returns undefined when document is returned from a function', async ({ page }) => {
    await page.setContent(html`
        <span x-text="$el.getRootNode() === undefined ? 'is undefined': ''"></span>
    `)

    let span = page.locator('span')

    await expect(span).toHaveText('is undefined')
})

test('prohibits assignment', async ({ page }) => {
    const logs = []

    page.on('console', msg => { logs.push(msg.text()) })

    await page.setContent(html`
        <div x-text="$el.innerText = 5"></div>
    `)

    await expect(logs[0]).toContain('Assignment is not allowed')
})

test('prohibits insertAdjacentHTML calls', async ({ page }) => {
    const logs = []

    page.on('console', msg => { logs.push(msg.text()) })

    await page.setContent(html`
        <div x-init="$el.insertAdjacentHTML('beforeend', '<iframe></iframe>')"></div>
    `)

    await expect(logs[0]).toContain('Value is not a function')
})

test('returns undefined when iframe is accessed', async ({ page }) => {
    await page.setContent(html`
        <div x-data>
            <span x-text="$refs.foo === undefined ? 'is undefined': ''"></span>
            <iframe x-ref="foo"></iframe>
        </div>
    `)

    let span = page.locator('span')

    await expect(span).toHaveText('is undefined')
})

test('returns undefined when iframe is accessed via computed property', async ({ page }) => {
    await page.setContent(html`
        <div x-data>
            <span x-text="$refs['foo'] === undefined ? 'is undefined': ''"></span>
            <iframe x-ref="foo"></iframe>
        </div>
    `)

    let span = page.locator('span')

    await expect(span).toHaveText('is undefined')
})

test('returns undefined when iframe is accessed via function', async ({ page }) => {
    await page.setContent(html`
        <div x-data>
            <span x-text="$el.parentElement.querySelector('iframe') === undefined ? 'is undefined': ''"></span>
            <iframe x-ref="foo"></iframe>
        </div>
    `)

    let span = page.locator('span')

    await expect(span).toHaveText('is undefined')
})

test('returns undefined when script is accessed', async ({ page }) => {
    await page.setContent(html`
        <div x-data>
            <span x-text="$refs.foo === undefined ? 'is undefined': ''"></span>
            <script x-ref="foo"></script>
        </div>
    `)

    let span = page.locator('span')

    await expect(span).toHaveText('is undefined')
})

test('throws when evaluating on an iframe', async ({ page }) => {
    const logs = []

    page.on('console', msg => { logs.push(msg.text()) })

    await page.setContent(html`
        <iframe x-init="$el.setAttribute('srcdoc', '')"></iframe>
    `)

    await expect(logs[0]).toContain('Cannot evaluate expressions on an iframe with the CSP build')
})

test('throws when evaluating on a script', async ({ page }) => {
    const logs = []

    page.on('console', msg => { logs.push(msg.text()) })

    await page.setContent(html`
        <script x-init="$el.setAttribute('nonce', '')"></script>
    `)

    await expect(logs[0]).toContain('Cannot evaluate expressions on a script with the CSP build')
})

test('throws when using x-html directive', async ({ page }) => {
    const logs = []

    page.on('console', msg => { logs.push(msg.text()) })

    await page.setContent(html`
        <div x-html="'<script></script>'"></div>
    `)

    await expect(logs[0]).toContain('x-html directive is not supported in the CSP build')
})