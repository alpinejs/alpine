import { directive, prefix } from '../directives'
import { initInterceptors } from '../interceptor'
import { injectDataProviders } from '../datas'
import { addRootSelector } from '../lifecycle'
import { interceptClone, isCloning, isCloningLegacy } from '../clone'
import { addScopeToNode } from '../scope'
import { injectMagics, magic } from '../magics'
import { reactive } from '../reactivity'
import { evaluate } from '../evaluator'

addRootSelector(() => `[${prefix('data')}]`)

let dataForReconciliation = Symbol()

directive('data', ((el, { expression }, { cleanup }) => {
    if (shouldSkipRegisteringDataDuringClone(el)) return

    let dataToReconcile = el[dataForReconciliation]

    // Multiple changes to the same attribute are collapsed into one mutation
    // batch. Only initialize the final expression once.
    if (dataToReconcile?.expression === expression) return

    expression = expression === '' ? '{}' : expression

    let magicContext = {}
    injectMagics(magicContext, el)

    let dataProviderContext = {}
    injectDataProviders(dataProviderContext, magicContext)

    let data = evaluate(el, expression, { scope: dataProviderContext })

    if (data === undefined || data === true) data = {}

    injectMagics(data, el)

    let reactiveData

    if (dataToReconcile?.reactiveData) {
        reactiveData = dataToReconcile.reactiveData
        reconcileData(reactiveData, data)

        let initialized = { expression }
        el[dataForReconciliation] = initialized

        queueMicrotask(() => {
            if (el[dataForReconciliation] === initialized) {
                delete el[dataForReconciliation]
            }
        })
    } else {
        reactiveData = reactive(data)
    }

    initInterceptors(reactiveData, cleanup)

    let undo = addScopeToNode(el, reactiveData)

    reactiveData['init'] && evaluate(el, reactiveData['init'])

    cleanup(() => {
        reactiveData['destroy'] && evaluate(el, reactiveData['destroy'])

        undo()

        // Attribute cleanup and re-initialization happen synchronously in the
        // same mutation flush. Keep the data around just long enough for a
        // replacement x-data directive to reuse it, but not a later addition.
        let removed = { reactiveData }
        el[dataForReconciliation] = removed

        queueMicrotask(() => {
            if (el[dataForReconciliation] === removed) {
                delete el[dataForReconciliation]
            }
        })
    })
}))

function reconcileData(target, source) {
    Object.keys(source).forEach(key => {
        let descriptor = Object.getOwnPropertyDescriptor(source, key)
        let existingDescriptor = Object.getOwnPropertyDescriptor(target, key)

        if (descriptor.get || descriptor.set || existingDescriptor?.get || existingDescriptor?.set) {
            if (existingDescriptor) delete target[key]
            if (! existingDescriptor) target[key] = undefined

            descriptor.get || descriptor.set
                ? Object.defineProperty(target, key, descriptor)
                : target[key] = source[key]
        } else {
            target[key] = source[key]
        }
    })

    Object.keys(target)
        .filter(key => ! Object.prototype.hasOwnProperty.call(source, key))
        .forEach(key => delete target[key])
}

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
