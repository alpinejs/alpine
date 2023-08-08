import Alpine from "alpinejs/src/alpine"

let oldBodyScriptTagHashes = []

export function swapCurrentPageWithNewHtml(html, andThen) {
    let newDocument = (new DOMParser()).parseFromString(html, "text/html")
    let newBody = document.adoptNode(newDocument.body)
    let newHead = document.adoptNode(newDocument.head)

    oldBodyScriptTagHashes = oldBodyScriptTagHashes.concat(Array.from(document.body.querySelectorAll('script')).map(i => simpleHash(i.outerHTML)))

    mergeNewHead(newHead)

    prepNewBodyScriptTagsToRun(newBody, oldBodyScriptTagHashes)

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

function prepNewBodyScriptTagsToRun(newBody, oldBodyScriptTagHashes) {
    newBody.querySelectorAll('script').forEach(i => {
        // We don't want to re-run script tags marked as "data-navigate-once"...
        if (i.hasAttribute('data-navigate-once')) {
            // However, if they didn't exist on the previous page, we do.
            // Therefore, we'll check the "old body script hashes" to
            // see if it was already there before skipping it...
            let hash = simpleHash(i.outerHTML)

            if (oldBodyScriptTagHashes.includes(hash)) return
        }

        i.replaceWith(cloneScriptTag(i))
    })
}

function mergeNewHead(newHead) {
    let children = Array.from(document.head.children)
    let headChildrenHtmlLookup = children.map(i => i.outerHTML)

    // Only add scripts and styles that aren't already loaded on the page.
    let garbageCollector = document.createDocumentFragment()

    for (let child of Array.from(newHead.children)) {
        if (isAsset(child)) {
            if (! headChildrenHtmlLookup.includes(child.outerHTML)) {
                if (isTracked(child)) {
                    if (ifTheQueryStringChangedSinceLastRequest(child, children)) {
                        setTimeout(() => window.location.reload())
                    }
                }

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
    for (let child of Array.from(document.head.children)) {
        if (! isAsset(child)) child.remove()
    }

    // Add new non-asset elements left over in the new head element.
    for (let child of Array.from(newHead.children)) {
        document.head.appendChild(child)
    }
}

function cloneScriptTag(el) {
    let script = document.createElement('script')

    script.textContent = el.textContent
    script.async = el.async

    for (let attr of el.attributes) {
        script.setAttribute(attr.name, attr.value)
    }

    return script
}

function isTracked(el) {
    return el.hasAttribute('data-navigate-track')
}

function ifTheQueryStringChangedSinceLastRequest(el, currentHeadChildren) {
    let [uri, queryString] = extractUriAndQueryString(el)

    return currentHeadChildren.some(child => {
        if (! isTracked(child)) return false

        let [currentUri, currentQueryString] = extractUriAndQueryString(child)

        // Only consider a data-navigate-track element changed if the query string has changed (not the URI)...
        if (currentUri === uri && queryString !== currentQueryString) return true
    })
}

function extractUriAndQueryString(el) {
    let url = isScript(el) ? el.src : el.href

    return url.split('?')
}

function isAsset(el) {
    return (el.tagName.toLowerCase() === 'link' && el.getAttribute('rel').toLowerCase() === 'stylesheet')
        || el.tagName.toLowerCase() === 'style'
        || el.tagName.toLowerCase() === 'script'
}

function isScript(el)   {
    return el.tagName.toLowerCase() === 'script'
}

function simpleHash(str) {
    return str.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)

        return a & a
    }, 0);
}
