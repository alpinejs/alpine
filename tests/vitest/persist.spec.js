import { afterEach, describe, expect, it, vi } from 'vitest'
import persist from '../../packages/persist/src/index.js'

describe('persist', () => {
    afterEach(() => vi.unstubAllGlobals())

    it('supports Alpine versions without interceptor cleanup', () => {
        let values = new Map()
        let storage = {
            getItem: key => values.get(key) ?? null,
            setItem: (key, value) => values.set(key, value),
        }
        let data = { count: 0 }

        vi.stubGlobal('localStorage', storage)

        let Alpine = {
            effect(callback) {
                callback()
            },
            interceptor(callback, mutate) {
                let interceptor = {
                    initialize(data, path, key) {
                        return callback(
                            this.initialValue,
                            () => data[path],
                            value => data[path] = value,
                            path,
                            key,
                        )
                    },
                }

                mutate(interceptor)

                return initialValue => {
                    interceptor.initialValue = initialValue

                    return interceptor
                }
            },
            magic() {},
        }

        persist(Alpine)

        let value = Alpine.$persist(1)

        expect(value.initialize(data, 'count', 'count')).toBe(1)
        expect(data.count).toBe(1)
        expect(storage.getItem('_x_count')).toBe('1')
    })
})
