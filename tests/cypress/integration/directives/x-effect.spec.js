import { html, test } from '../../utils'

test('effects that trigger each other do not requeue endlessly in the same flush',
    [html`
        <div x-data="{ a: 0, b: 0 }">
            <button @click="window.__allowCircularEffects = true; a++">start</button>

            <span x-effect="a; if (window.__allowCircularEffects) { if (++window.__circularEffectRuns > 4) throw new Error('Circular effects requeued endlessly'); b++ }"></span>
            <span x-effect="b; if (window.__allowCircularEffects) { if (++window.__circularEffectRuns > 4) throw new Error('Circular effects requeued endlessly'); a++ }"></span>
        </div>
    `,
    `
        window.__allowCircularEffects = false
        window.__circularEffectRuns = 0
    `],
    ({ get }) => {
        get('button').click()
    }
)
