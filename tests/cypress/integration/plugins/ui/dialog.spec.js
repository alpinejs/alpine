import { beVisible, haveAttribute, haveText, html, notBeVisible, notExist, test } from '../../../utils'

test('has accessibility attributes',
    [html`
        <div x-data="{ open: false }">
            <button @click="open = ! open">Toggle</button>

            <article x-dialog x-model="open">
                Dialog Contents!
            </article>
        </div>
    `],
    ({ get }) => {
        get('article').should(haveAttribute('role', 'dialog'))
        get('article').should(haveAttribute('aria-modal', 'true'))
    },
)

test('works with x-model',
    [html`
        <div x-data="{ open: false }">
            <button @click="open = ! open">Toggle</button>

            <article x-dialog x-model="open">
                Dialog Contents!
            </article>
        </div>
    `],
    ({ get }) => {
        get('article').should(notBeVisible())
        get('button').click()
        get('article').should(beVisible())
        get('button').click()
        get('article').should(notBeVisible())
    },
)

test('works with open prop and close event',
    [html`
        <div x-data="{ open: false }">
            <button @click="open = ! open">Toggle</button>

            <article x-dialog :open="open" @close="open = false">
                Dialog Contents!
            </article>
        </div>
    `],
    ({ get }) => {
        get('article').should(notBeVisible())
        get('button').click()
        get('article').should(beVisible())
    },
)

test('works with static prop',
    [html`
        <div x-data="{ open: false }">
            <button @click="open = ! open">Toggle</button>

            <template x-if="open">
                <article x-dialog static>
                    Dialog Contents!
                </article>
            </template>
        </div>
    `],
    ({ get }) => {
        get('article').should(notExist())
        get('button').click()
        get('article').should(beVisible())
    },
)

test('pressing escape closes modal',
    [html`
        <div x-data="{ open: false }">
            <button @click="open = ! open">Toggle</button>

            <article x-dialog x-model="open">
                Dialog Contents!
                <input type="text">
            </article>
        </div>
    `],
    ({ get }) => {
        get('article').should(notBeVisible())
        get('button').click()
        get('article').should(beVisible())
        get('input').type('{esc}')
        get('article').should(notBeVisible())
    },
)

test('x-dialog:panel allows for click away',
    [html`
        <div x-data="{ open: true }">
            <h1>Click away on me</h1>

            <article x-dialog x-model="open">
                <div x-dialog:panel>
                    Dialog Contents!
                </div>
            </article>
        </div>
    `],
    ({ get }) => {
        get('article').should(beVisible())
        get('h1').click()
        get('article').should(notBeVisible())
    },
)

test('x-dialog:overlay closes dialog when clicked on',
    [html`
        <div x-data="{ open: true }">
            <h1>Click away on me</h1>

            <article x-dialog x-model="open">
                <main x-dialog:overlay>
                    Some Overlay
                </main>

                <div>
                    Dialog Contents!
                </div>
            </article>
        </div>
    `],
    ({ get }) => {
        get('article').should(beVisible())
        get('h1').click()
        get('article').should(beVisible())
        get('main').click()
        get('article').should(notBeVisible())
    },
)

test('x-dialog:title',
    [html`
        <article x-data x-dialog>
            <h1 x-dialog:title>Dialog Title</h1>
        </article>
    `],
    ({ get }) => {
        get('article').should(haveAttribute('aria-labelledby', 'alpine-dialog-title-1'))
        get('h1').should(haveAttribute('id', 'alpine-dialog-title-1'))
    },
)

test('x-dialog:description',
    [html`
        <article x-data x-dialog>
            <p x-dialog:description>Dialog Title</p>
        </article>
    `],
    ({ get }) => {
        get('article').should(haveAttribute('aria-describedby', 'alpine-dialog-description-1'))
        get('p').should(haveAttribute('id', 'alpine-dialog-description-1'))
    },
)

test('$modal.open exposes internal "open" state',
    [html`
        <div x-data="{ open: false }">
            <button @click="open = ! open">Toggle</button>

            <article x-dialog x-model="open">
                Dialog Contents!
                <h2 x-text="$dialog.open"></h2>
            </article>
        </div>
    `],
    ({ get }) => {
        get('h2').should(haveText('false'))
        get('button').click()
        get('h2').should(haveText('true'))
    },
)

test('works with x-teleport',
    [html`
        <div x-data="{ open: false }">
            <button @click="open = ! open">Toggle</button>

            <template x-teleport="body">
                <article x-dialog x-model="open">
                    Dialog Contents!
                </article>
            </template>
        </div>
    `],
    ({ get }) => {
        get('article').should(notBeVisible())
        get('button').click()
        get('article').should(beVisible())
        get('button').click()
        get('article').should(notBeVisible())
    },
)

// Skipping these two tests as anything focus related seems to be flaky
// with cypress, but fine in a real browser.
// test('x-dialog traps focus'...
// test('initial-focus prop'...
