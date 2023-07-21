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
    let headChildrenHtmlLookup = Array.prototype.map.call(
        document.head.childNodes,
        (i) => i.outerHTML
    );

    // Remove existing non-asset elements like meta, base, title, template.
    document.head.childNodes.forEach((child) => {
        if (!isAsset(child)) child.remove();
    });

    newHead.childNodes.forEach((child) => {
        if (!isAsset(child) || !headChildrenHtmlLookup.includes(child.outerHTML)) 
            document.head.appendChild(
                isScript(child) ? cloneScriptTag(child) : child
            );
    });
}

function cloneScriptTag(el) {
    let script = document.createElement('script')

    script.textContent = el.textContent
    script.async = el.async

    for (const attr of el.attributes) {
        script.setAttribute(attr.name, attr.value)
    }

    return script
}

function isAsset (el) {
    return (el instanceof HTMLLinkElement && el.getAttribute('rel').toLowerCase() === 'stylesheet')
        || el instanceof HTMLStyleElement
        || el instanceof HTMLScriptElement
}

function isScript (el)   {
    return el instanceof HTMLScriptElement
}

