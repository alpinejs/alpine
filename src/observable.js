import ObservableMembrane from 'observable-membrane'

export function wrap(data, mutationCallback) {
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
