import { directives } from '../directives'
import { accessor } from '../interceptor'
import { findClosest } from '../lifecycle'
import { magic } from '../magics'
import { reactive } from '../reactivity'

magic('model', (el, { cleanup }) => {
    eagerlyRunXModelIfNeeded(el)

    let func = generateModelAccessor(el, cleanup)

    return accessor(func)
})

function generateModelAccessor(el, cleanup) {
    // Find the closest element with x-model on it, NOT including the current element...
    let closestModelEl = findClosest(el, i => {
        if (i._x_model) return true
    })

    closestModelEl && destroyModelListeners(closestModelEl)

    // Instead of simply returning the get/set object, we'll create a wrapping function
    // so that we have the option to add additional APIs without breaking anything...
    let accessor = function (fallbackStateInitialValue) {
        if (closestModelEl) return this

        return fallbackStateInitialValue
    }

    let model = () => {
        if (! closestModelEl) {
            throw 'Cannot find an available x-model directive to reference from $model.'
        }

        return closestModelEl._x_model
    }

    accessor.get = () => {
        return model().get()
    }

    accessor.set = (value) => {
        if (typeof value === 'function') {
            model().set(value(accessor.get()))
        } else {
            model().set(value)
        }
    }

    accessor.watch = (callback) => {
        cleanup(Alpine.watch(() => accessor.get(), callback))
    }

    return accessor
}

function eagerlyRunXModelIfNeeded(el) {
    // Looks like x-model has already been run so we're good...
    if (el._x_model) return

    // We only care to run x-model on elements WITH x-model...
    if (! el.hasAttribute('x-model')) return

    let attribute = { name: 'x-model', value: el.getAttribute('x-model') }

    directives(el, [attribute]).forEach((handle) => {
        handle()
    })
}

function destroyModelListeners(modelEl) {
    if (! modelEl._x_removeModelListeners) return

    if (isInputyElement(modelEl)) return

    modelEl._x_removeModelListeners['default']()
}

function isInputyElement(el) {
    let tag = el.tagName.toLowerCase()

    inputTags = ['input', 'textarea', 'select']

    return inputTags.includes(tag)
}
