// @vitest-environment jsdom

import { it, expect } from 'vitest';

it('does not read the globals that browsers report as deprecated', async () => {
    let read = []

    for (let key of ['styleMedia', 'sharedStorage', 'fence']) {
        Object.defineProperty(globalThis, key, {
            configurable: true,
            get() {
                read.push(key)
            },
        })
    }

    await import('../../packages/csp/src/parser.js')

    expect(read).toEqual([])
})
