import Alpine from "alpinejs/src/alpine"

let els = {}

export function storePersistantElementsForLater() {
    els = {}

    document.querySelectorAll('[x-persist]').forEach(i => {
        els[i.getAttribute('x-persist')] = i

        Alpine.mutateDom(() => {
            i.remove()
        })
    })
}

export function putPersistantElementsBack() {
    document.querySelectorAll('[x-persist]').forEach(i => {
        let old = els[i.getAttribute('x-persist')]

        // There might be a brand new x-persist element...
        if (! old) return

        old._x_wasPersisted = true

        Alpine.mutateDom(() => {
            i.replaceWith(old)
        })
    })
}
