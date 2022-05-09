export function swapPage(Alpine, html, beforeInit = () => {}) {
    let newDocument = (new DOMParser()).parseFromString(html, "text/html")
    let newBody = document.adoptNode(newDocument.body)

    Alpine.stopObservingMutations()

    persistElements(() => {
        prepNewScriptTagsToRun(newBody)

        document.body.replaceWith(newBody)
    })

    beforeInit()

    setTimeout(() => {
        Alpine.startObservingMutations()

        Alpine.initTree(document.body)
    })
}

function persistElements(callback) {
    let els = {}

    document.querySelectorAll('[x-navigate\\:persist]').forEach(i => {
        els[i.getAttribute('x-navigate:persist')] = i
    })

    callback()

    document.querySelectorAll('[x-navigate\\:persist]').forEach(i => {
        let old = els[i.getAttribute('x-navigate:persist')]

        i.replaceWith(old)
    })
}

function prepNewScriptTagsToRun(newBody) {
    newBody.querySelectorAll('script').forEach(i => {
        if (i.hasAttribute('x-navigate:ignore')) return
        // Only re-run inline scripts.
        if (i.hasAttribute('src')) return

        let el = document.createElement('script')
        el.textContent = i.innerText
        el.async = false

        for (let { name, value } of i.attributes) {
            el.setAttribute(name, value)
        }

        i.replaceWith(el)
    })
}
