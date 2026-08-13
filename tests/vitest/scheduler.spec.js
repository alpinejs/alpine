import { afterEach, describe, expect, it } from 'vitest'
import { dequeueJob, flushJobs, scheduler } from '../../packages/alpinejs/src/scheduler'

afterEach(() => flushJobs())

describe('scheduler priorities', () => {
    let structural = (callback, priority = 0) => {
        callback._x_schedulerPriority = { el: null, order: priority }

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

    it('uses creation order to run structural parents before children at the same depth', () => {
        let runs = []
        let child = structural(() => runs.push('child'), 2)
        let parent = structural(() => runs.push('parent'), 1)

        scheduler(child)
        scheduler(parent)
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
})
