import { accessor } from '../interceptor'
import { findClosest } from '../lifecycle'
import { magic } from '../magics'
import { reactive } from '../reactivity'

magic('model', (el, { cleanup }) => {
    let func = generateModelAccessor(el.parentElement, cleanup)

    Object.defineProperty(func, 'self', { get() {
        return accessor(generateModelAccessor(el, cleanup))
    }, })

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

    accessor.exists = () => {
        return !! closestModelEl
    }

    accessor.get = () => {
        return closestModelEl._x_model.get()
    }

    accessor.set = (value) => {
        if (typeof value === 'function') {
            closestModelEl._x_model.set(value(accessor.get()))
        } else {
            closestModelEl._x_model.set(value)
        }
    }

    accessor.watch = (callback) => {
        cleanup(Alpine.watch(() => accessor.get(), callback))
    }

    return accessor
}
