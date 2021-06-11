
function createElement(htmlOrTemplate) {
    if (typeof htmlOrTemplate === 'string') {
        return document.createRange().createContextualFragment(htmlOrTemplate).firstElementChild
    }

    return htmlOrTemplate.content.firstElementChild.cloneNode(true)
}

module.exports = createElement
