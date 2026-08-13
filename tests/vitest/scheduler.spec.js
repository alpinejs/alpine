import { afterEach, describe, expect, it } from 'vitest'
import { dequeueJob, flushJobs, scheduler } from '../../packages/alpinejs/src/scheduler'

afterEach(() => flushJobs())

describe('scheduler priorities', () => {
    let structural = (callback, priority = 0, el = null) => {
        callback._x_schedulerPriority = { el, order: priority }

        return callback
    }

    it('preserves FIFO order for ordinary jobs', () => {
        let runs = []

        scheduler(() => runs.push('one'))
        scheduler(() => runs.push('two'))
        scheduler(() => runs.push('three'))
        flushJobs()

        expect(runs).toEqual(['one', 'two', 'three'])
    })

    it('runs structural jobs before default jobs', () => {
        let runs = []

        scheduler(() => runs.push('default'))
        scheduler(structural(() => runs.push('structural')))
        flushJobs()

        expect(runs).toEqual(['structural', 'default'])
    })

    it('preserves ordinary FIFO order when structural work is promoted', () => {
        let runs = []

        scheduler(() => runs.push('default one'))
        scheduler(() => runs.push('default two'))
        scheduler(structural(() => runs.push('structural')))
        flushJobs()

        expect(runs).toEqual(['structural', 'default one', 'default two'])
    })

    it('uses creation order to run structural parents before children at the same depth', () => {
        let runs = []
        let child = structural(() => runs.push('child'), 2)
        let parent = structural(() => runs.push('parent'), 1)

        scheduler(child)
        scheduler(parent)
        flushJobs()

        expect(runs).toEqual(['parent', 'child'])
    })

    it('uses current tree depth before creation order', () => {
        let runs = []
        let root = { parentElement: null }
        let parentElement = { parentElement: root }
        let childElement = { parentElement: parentElement }
        let olderChild = structural(() => runs.push('child'), 1, childElement)
        let newerParent = structural(() => runs.push('parent'), 2, parentElement)

        scheduler(olderChild)
        scheduler(newerParent)
        flushJobs()

        expect(runs).toEqual(['parent', 'child'])
    })

    it('returns to structural work scheduled by a default job before continuing default work', () => {
        let runs = []

        scheduler(() => {
            runs.push('default one')
            scheduler(structural(() => runs.push('new structural')))
        })
        scheduler(() => runs.push('default two'))
        flushJobs()

        expect(runs).toEqual(['default one', 'new structural', 'default two'])
    })

    it('reorders structural work added while draining structural work', () => {
        let runs = []
        let parent = structural(() => runs.push('parent'), 1)
        let child = structural(() => {
            runs.push('child')
            scheduler(parent)
        }, 2)

        scheduler(child)
        scheduler(() => runs.push('default'))
        flushJobs()

        expect(runs).toEqual(['child', 'parent', 'default'])
    })

    it('preserves whole-flush deduping after a job has run', () => {
        let runs = []
        let render = () => runs.push('render')

        scheduler(render)
        scheduler(() => scheduler(render))
        flushJobs()

        expect(runs).toEqual(['render'])
    })

    it('prevents self-triggering jobs from requeueing', () => {
        let runs = 0
        let job = () => {
            runs++
            scheduler(job)
        }

        scheduler(job)
        flushJobs()

        expect(runs).toBe(1)
    })

    it('prevents mutually-triggering jobs from requeueing', () => {
        let runs = []
        let one = () => {
            runs.push('one')
            scheduler(two)
        }
        let two = () => {
            runs.push('two')
            scheduler(one)
        }

        scheduler(one)
        flushJobs()

        expect(runs).toEqual(['one', 'two'])
    })

    it('can dequeue pending work', () => {
        let runs = []
        let removed = () => runs.push('removed')

        scheduler(removed)
        scheduler(() => runs.push('kept'))
        dequeueJob(removed)
        flushJobs()

        expect(runs).toEqual(['kept'])
    })

    it('can dequeue pending structural work', () => {
        let runs = []
        let removed = structural(() => runs.push('removed'))

        scheduler(removed)
        scheduler(() => runs.push('kept'))
        dequeueJob(removed)
        flushJobs()

        expect(runs).toEqual(['kept'])
    })

    it('preserves structural depth order and ordinary FIFO order across randomized queues', () => {
        let randomFor = seed => () => {
            seed |= 0
            seed = seed + 0x6D2B79F5 | 0
            let value = Math.imul(seed ^ seed >>> 15, 1 | seed)
            value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value

            return ((value ^ value >>> 14) >>> 0) / 4294967296
        }
        let shuffle = (values, random) => {
            for (let i = values.length - 1; i > 0; i--) {
                let swap = Math.floor(random() * (i + 1))
                let cached = values[i]
                values[i] = values[swap]
                values[swap] = cached
            }

            return values
        }
        let chain = depth => {
            let el = null

            for (let i = 0; i < depth; i++) el = { parentElement: el }

            return el
        }
        let elementAtLogicalDepth = (depth, teleported) => {
            if (! teleported) return chain(depth)

            return {
                parentElement: chain(20),
                _x_teleportBack: chain(depth - 1),
            }
        }

        for (let seed = 1; seed <= 32; seed++) {
            let random = randomFor(seed)
            let runs = []
            let jobs = Array.from({ length: 100 }, (_, index) => {
                let depth = Math.floor(random() * 12) + 1
                let isStructural = random() < .45
                let job = () => runs.push(index)

                if (isStructural) {
                    job._x_schedulerPriority = {
                        el: elementAtLogicalDepth(depth, depth > 1 && random() < .35),
                        order: index,
                    }
                }

                return { depth, index, isStructural, job, removed: random() < .12 }
            })
            let notified = shuffle([...jobs], random)

            notified.forEach(({ job }) => scheduler(job))
            notified.filter(({ removed }) => removed).forEach(({ job }) => dequeueJob(job))

            flushJobs()

            let remaining = notified.filter(({ removed }) => ! removed)
            let expected = [
                ...remaining
                    .filter(({ isStructural }) => isStructural)
                    .sort((a, b) => a.depth - b.depth || a.index - b.index),
                ...remaining.filter(({ isStructural }) => ! isStructural),
            ].map(({ index }) => index)

            expect(runs, `seed ${seed}`).toEqual(expected)
        }
    })
})
