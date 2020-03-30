import ObservableMembrane from 'observable-membrane'

export function wrap(data, mutationCallback) {
    /* IE11-ONLY:START */
    return wrapForIe11(data, mutationCallback)
    /* IE11-ONLY:END */


    let membrane = new ObservableMembrane({
        valueMutated(target, key) {
            mutationCallback(target, key)
        },
    })

    return {
        data: membrane.getProxy(data),
        membrane: membrane,
    }
}

export function unwrap(membrane, observable) {
    let unwrappedData = membrane.unwrapProxy(observable)
    let copy = {}

    Object.keys(unwrappedData).forEach(key => {
        if (['$el', '$refs', '$nextTick', '$watch'].includes(key)) return

        copy[key] = unwrappedData[key]
    })

    return copy
}

function wrapForIe11(data, mutationCallback) {
    const proxyHandler = {
        set(target, key, value) {
            // Set the value converting it to a "Deep Proxy" when required
            // Note that if a project is not a valid object, it won't be converted to a proxy
            const setWasSuccessful = Reflect.set(target, key, deepProxy(value, proxyHandler))

            mutationCallback(target, key)

            return setWasSuccessful
        },
        get(target, key) {
            // Provide a way to determine if this object is an Alpine proxy or not.
            if (key === "$isAlpineProxy") return true

            // Just return the flippin' value. Gawsh.
            return target[key]
        }
    }

    return {
        data: deepProxy(data, proxyHandler),
        membrane: {
            unwrapProxy(proxy) {
                return proxy
            }
        },
    }
}

function deepProxy(target, proxyHandler) {
    // If target is null, return it.
    if (target === null) return target;

    // If target is not an object, return it.
    if (typeof target !== 'object') return target;

    // If target is a DOM node (like in the case of this.$el), return it.
    if (target instanceof Node) return target

    // If target is already an Alpine proxy, return it.
    if (target['$isAlpineProxy']) return target;

    // Otherwise proxy the properties recursively.
    // This enables reactivity on setting nested data.
    // Note that if a project is not a valid object, it won't be converted to a proxy
    for (let property in target) {
        target[property] = deepProxy(target[property], proxyHandler)
    }

    return new Proxy(target, proxyHandler)
}
