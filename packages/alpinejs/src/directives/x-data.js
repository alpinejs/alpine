import { directive, prefix } from '../directives'
import { initInterceptors } from '../interceptor'
import { injectDataProviders } from '../datas'
import { addRootSelector } from '../lifecycle'
import { interceptClone, isCloning, isCloningLegacy } from '../clone'
import { addScopeToNode } from '../scope'
import { injectMagics, magic } from '../magics'
import { reactive, raw } from '../reactivity'
import { evaluate } from '../evaluator'

addRootSelector(() => `[${prefix('data')}]`)

directive('data', ((el, { expression }, { cleanup }) => {
    if (shouldSkipRegisteringDataDuringClone(el)) return

    expression = expression === '' ? '{}' : expression

    let magicContext = {}
    injectMagics(magicContext, el)

    let dataProviderContext = {}
    injectDataProviders(dataProviderContext, magicContext)

    let data = evaluate(el, expression, { scope: dataProviderContext })

    if (data === undefined || data === true) data = {}

    // Check for previous reactive data (stashed before cleanup could remove it)
    let existingReactive = el._x_previousData

    if (existingReactive) {
        let rawExisting = raw(existingReactive)

        // Remove keys that no longer exist in the new expression
        Object.keys(rawExisting).forEach(key => {
            if (key.startsWith('$')) return
            if (key === 'init' || key === 'destroy') return
            if (!(key in data)) delete existingReactive[key]
        })

        // Assign new/updated values — triggers reactive effects
        Object.assign(existingReactive, data)

        // Re-add scope (cleanup already removed it via undo())
        let undo = addScopeToNode(el, existingReactive)

        // Skip initInterceptors — interceptors like $persist were already
        // initialized on the first run and their state should be preserved.

        // Note: init() intentionally re-fires on the root element (not children).
        // In practice, Livewire/morphing x-data expressions are plain data objects
        // that won't have init, so this is a no-op for the primary use case.
        existingReactive['init'] && evaluate(el, existingReactive['init'])

        cleanup(() => {
            existingReactive['destroy'] && evaluate(el, existingReactive['destroy'])
            undo()
        })

        return
    }

    injectMagics(data, el)

    let reactiveData = reactive(data)

    initInterceptors(reactiveData)

    let undo = addScopeToNode(el, reactiveData)

    // Stash for future in-place mutations
    el._x_previousData = reactiveData

    reactiveData['init'] && evaluate(el, reactiveData['init'])

    cleanup(() => {
        reactiveData['destroy'] && evaluate(el, reactiveData['destroy'])

        undo()
    })
}))

interceptClone((from, to) => {
    // Transfer over existing runtime Alpine state from
    // the existing dom tree over to the new one...
    if (from._x_dataStack) {
        to._x_dataStack = from._x_dataStack

        // Set a flag to signify the new tree is using
        // pre-seeded state (used so x-data knows when
        // and when not to initialize state)...
        to.setAttribute('data-has-alpine-state', true)
    }
})

// If we are cloning a tree, we only want to evaluate x-data if another
// x-data context DOESN'T exist on the component.
// The reason a data context WOULD exist is that we graft root x-data state over
// from the live tree before hydrating the clone tree.
function shouldSkipRegisteringDataDuringClone(el) {
    if (! isCloning) return false
    if (isCloningLegacy) return true

    return el.hasAttribute('data-has-alpine-state')
}
