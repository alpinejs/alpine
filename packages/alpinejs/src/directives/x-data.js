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

let dataToReconcile = new WeakMap

directive('data', ((el, { expression }, { cleanup }) => {
    if (shouldSkipRegisteringDataDuringClone(el)) return

    expression = expression === '' ? '{}' : expression

    let magicContext = {}
    injectMagics(magicContext, el)

    let dataProviderContext = {}
    injectDataProviders(dataProviderContext, magicContext)

    let data = evaluate(el, expression, { scope: dataProviderContext })

    if (data === undefined || data === true) data = {}

    injectMagics(data, el)

    let reactiveData = dataToReconcile.get(el)

    dataToReconcile.delete(el)

    if (reactiveData) {
        Object.keys(data).forEach(key => {
            let descriptor = Object.getOwnPropertyDescriptor(data, key)
            let existingDescriptor = Object.getOwnPropertyDescriptor(reactiveData, key)

            if (descriptor.get || descriptor.set || existingDescriptor?.get || existingDescriptor?.set) {
                if (existingDescriptor) delete reactiveData[key]
                if (! existingDescriptor) reactiveData[key] = undefined

                descriptor.get || descriptor.set
                    ? Object.defineProperty(reactiveData, key, descriptor)
                    : reactiveData[key] = data[key]
            } else {
                reactiveData[key] = data[key]
            }
        })

        Object.keys(reactiveData)
            .filter(key => ! Object.prototype.hasOwnProperty.call(data, key))
            .forEach(key => delete reactiveData[key])
    } else {
        reactiveData = reactive(data)
    }

    initInterceptors(reactiveData, cleanup)

    let undo = addScopeToNode(el, reactiveData)

    reactiveData['init'] && evaluate(el, reactiveData['init'])

    cleanup((isReplaced) => {
        reactiveData['destroy'] && evaluate(el, reactiveData['destroy'])

        undo()

        if (isReplaced) dataToReconcile.set(el, reactiveData)
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
