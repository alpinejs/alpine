import { afterEach, describe, expect, it } from 'vitest'
import { dequeueJob, flushJobs, scheduler } from '../../packages/alpinejs/src/scheduler'

afterEach(() => flushJobs())

describe('scheduler priorities', () => {
    it('runs structural jobs before default jobs', () => {
        let runs = []
        let structural = () => runs.push('structural')
        structural._x_schedulerPriority = 'structural'

        scheduler(() => runs.push('default'))
        scheduler(structural)
        flushJobs()

        expect(runs).toEqual(['structural', 'default'])
    })

    it('runs older structural effects before structural effects they created', () => {
        let runs = []
        let child = () => runs.push('child')
        let parent = () => runs.push('parent')
        child._x_schedulerPriority = 'structural'
        child._x_schedulerOrder = 2
        parent._x_schedulerPriority = 'structural'
        parent._x_schedulerOrder = 1

        scheduler(child)
        scheduler(parent)
        flushJobs()

        expect(runs).toEqual(['parent', 'child'])
    })

    it('returns to structural work scheduled by a default job before continuing default work', () => {
        let runs = []

        scheduler(() => {
            runs.push('default one')
            let structural = () => runs.push('new structural')
            structural._x_schedulerPriority = 'structural'
            scheduler(structural)
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

    it('can dequeue pending work', () => {
        let runs = []
        let removed = () => runs.push('removed')

        scheduler(removed)
        scheduler(() => runs.push('kept'))
        dequeueJob(removed)
        flushJobs()

        expect(runs).toEqual(['kept'])
    })
})
