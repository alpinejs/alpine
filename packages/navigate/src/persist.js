let els = {}

export function storePersistantElementsForLater() {
    els = {}

    document.querySelectorAll('[x-navigate\\:persist]').forEach(i => {
        els[i.getAttribute('x-navigate:persist')] = i
    })
}

export function putPersistantElementsBack() {
    document.querySelectorAll('[x-navigate\\:persist]').forEach(i => {
        let old = els[i.getAttribute('x-navigate:persist')]

        i.replaceWith(old)
    })
}
