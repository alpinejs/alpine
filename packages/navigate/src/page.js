import Alpine from "alpinejs/src/alpine"

export function swapCurrentPageWithNewHtml(html, andThen) {
    let newDocument = (new DOMParser()).parseFromString(html, "text/html")
    let newBody = document.adoptNode(newDocument.body)
    let newHead = document.adoptNode(newDocument.head)

    mergeNewHead(newHead)
    prepNewScriptTagsToRun(newBody)

    transitionOut(document.body)

    // @todo: only setTimeout when applying transitions
    // setTimeout(() => {
        let oldBody = document.body

        document.body.replaceWith(newBody)

        Alpine.destroyTree(oldBody)

        transitionIn(newBody)

        andThen()
    // }, 0)
}

function transitionOut(body) {
    return;
    body.style.transition = 'all .5s ease'
    body.style.opacity = '0'
}

function transitionIn(body) {
    return;
    body.style.opacity = '0'
    body.style.transition = 'all .5s ease'

    requestAnimationFrame(() => {
        body.style.opacity = '1'
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

