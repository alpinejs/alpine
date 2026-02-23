// @vitest-environment jsdom

import { describe, it, expect, beforeAll } from 'vitest'
import Alpine from '../../packages/alpinejs/src/index.js'

let bind

beforeAll(async () => {
    Alpine.start()
    bind = (await import('../../packages/alpinejs/src/utils/bind.js')).default
})

describe('bind(value) with radio inputs', () => {
    it('does not update checked state outside x-model updates', () => {
        let radio = document.createElement('input')
        radio.type = 'radio'
        radio.value = 'true'
        radio.checked = false

        bind(radio, 'value', true)

        expect(radio.checked).toBe(false)
    })

    it('updates checked state when invoked by x-model updates', () => {
        let truthy = document.createElement('input')
        truthy.type = 'radio'
        truthy.value = 'true'

        let falsy = document.createElement('input')
        falsy.type = 'radio'
        falsy.value = 'false'

        bind(truthy, 'value', true, [], { fromModel: true })
        bind(falsy, 'value', true, [], { fromModel: true })

        expect(truthy.checked).toBe(true)
        expect(falsy.checked).toBe(false)
    })
})
