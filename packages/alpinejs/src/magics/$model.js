import { accessor } from '../interceptor'
import { findClosest } from '../lifecycle'
import { magic } from '../magics'
import { reactive } from '../reactivity'

magic('model', (el, { cleanup }) => {
    let func = generateModelAccessor(el, cleanup)

    Object.defineProperty(func, 'closest', { get() {
        let func = generateModelAccessor(el.parentElement, cleanup)

        func._x_modelAccessor = true

        return accessor(func)
    }, })

    func._x_modelAccessor = true

    return accessor(func)
})

function generateModelAccessor(el, cleanup) {
    // Find the closest element with x-model on it, NOT including the current element...
    let closestModelEl = findClosest(el, i => {
        if (i._x_model) return true
    })

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
