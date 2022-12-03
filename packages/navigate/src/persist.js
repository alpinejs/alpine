import Alpine from "alpinejs/src/alpine"

let els = {}

export function storePersistantElementsForLater() {
    els = {}

    document.querySelectorAll('[x-navigate\\:persist]').forEach(i => {
        els[i.getAttribute('x-navigate:persist')] = i

        Alpine.mutateDom(() => {
            i.remove()
        })
    })
}

export function putPersistantElementsBack() {
    document.querySelectorAll('[x-navigate\\:persist]').forEach(i => {
        let old = els[i.getAttribute('x-navigate:persist')]

        old._x_wasPersisted = true

        Alpine.mutateDom(() => {
            i.replaceWith(old)
        })
    })
}
