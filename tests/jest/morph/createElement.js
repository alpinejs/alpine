
function createElement(htmlOrTemplate, targetHtml = null) {
    const DOCUMENT_FRAGMENT_NODE = 11

    if (targetHtml && typeof htmlOrTemplate === 'string' && ['#document', 'HTML', 'BODY'].includes(targetHtml.nodeName)) {
        const html = document.createElement('html')

        html.innerHTML = htmlOrTemplate

        return html
    }

    if (typeof htmlOrTemplate === 'string') {
        const template = document.createElement('template')

        template.innerHTML = htmlOrTemplate

        return template.content.firstElementChild
    }

    if (to.nodeType === DOCUMENT_FRAGMENT_NODE) {
        return to.firstElementChild.cloneNode(true)
    }

    return htmlOrTemplate.content.firstElementChild.cloneNode(true)
}

module.exports = createElement
