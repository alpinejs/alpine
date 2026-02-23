// @vitest-environment jsdom

import { beforeAll, describe, expect, it } from 'vitest'
import Alpine from '../../packages/alpinejs/src/index.js'

let safeParseBoolean

beforeAll(async () => {
    Alpine.start()
    safeParseBoolean = (await import('../../packages/alpinejs/src/utils/bind.js')).safeParseBoolean
})

describe('safeParseBoolean', () => {
    it('handles mixed case and surrounding whitespace for known values', () => {
        expect(safeParseBoolean(' TRUE ')).toBe(true)
        expect(safeParseBoolean(' yes ')).toBe(true)
        expect(safeParseBoolean(' 1 ')).toBe(true)

        expect(safeParseBoolean(' FALSE ')).toBe(false)
        expect(safeParseBoolean(' off ')).toBe(false)
        expect(safeParseBoolean(' 0 ')).toBe(false)
    })

    it('keeps legacy fallback behavior for unknown values', () => {
        expect(safeParseBoolean('unknown')).toBe(true)
        expect(safeParseBoolean('')).toBe(null)
    })
})
