
export function swapPage(Alpine, html, beforeInit = () => {}) {
    let newDocument = (new DOMParser()).parseFromString(html, "text/html")
    let newBody = document.adoptNode(newDocument.body)
    let newHead = document.adoptNode(newDocument.head)

    Alpine.stopObservingMutations()

    persistElements(() => {
        mergeNewHead(newHead)
        prepNewScriptTagsToRun(newBody)

        document.body.replaceWith(newBody)
    })

    // For some reason this is triggering an error with one of my chrome extensions.
    // autofocusEl()

    beforeInit()

    setTimeout(() => {
        Alpine.startObservingMutations()

        Alpine.initTree(document.body)
    })
}

function persistElements(callback) {
    let els = {}

    document.querySelectorAll('[x-navigate\\:persist]').forEach(i => {
        console.log(i)
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

        i.replaceWith(cloneScriptTag(i))
    })
}

function mergeNewHead(newHead) {
    let headChildrenHtmlLookup = Array.from(document.head.children).map(i => i.outerHTML)

    // Only add scripts and styles that aren't already loaded on the page.
    let garbageCollector = document.createDocumentFragment()

    for (child of Array.from(newHead.children)) {
        if (isAsset(child)) {
            if (! headChildrenHtmlLookup.includes(child.outerHTML)) {
                if (isScript(child)) {
                    document.head.appendChild(cloneScriptTag(child))
                } else {
                    document.head.appendChild(child)
                }
            } else {
                garbageCollector.appendChild(child)
            }
        }
    }

    // How to free up the garbage collector?

    // Remove existing non-asset elements like meta, base, title, template.
    for (child of Array.from(document.head.children)) {
        if (! isAsset(child)) child.remove()
    }

    // Add new non-asset elements left over in the new head element.
    for (child of Array.from(newHead.children)) {
        document.head.appendChild(child)
    }
}

function cloneScriptTag(el) {
    let script = document.createElement('script')

    script.textContent = el.textContent
    script.async = el.async

    for (attr of el.attributes) {
        script.setAttribute(attr.name, attr.value)
    }

    return script
}

function isAsset (el) {
    return (el.tagName.toLowerCase() === 'link' && el.getAttribute('rel').toLowerCase() === 'stylesheet')
        || el.tagName.toLowerCase() === 'style'
        || el.tagName.toLowerCase() === 'script'
}

function isScript (el)   {
    return el.tagName.toLowerCase() === 'script'
}

function autofocusEl() {
    document.querySelector('[autofocus]') && document.querySelector('[autofocus]').focus()
}
