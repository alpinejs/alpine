import { transitionIn, transitionOut, getXAttrs, warnIfMalformedTemplate, isNumeric } from '../utils'

export function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
    warnIfMalformedTemplate(templateEl, 'x-for')

    let iteratorNames = typeof expression === 'function'
        ? parseForExpression(component.evaluateReturnExpression(templateEl, expression))
        : parseForExpression(expression)

    let items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars)

    // As we walk the array, we'll also walk the DOM (updating/creating as we go).
    let currentEl = templateEl
    items.forEach((item, index) => {
        let iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index, items, extraVars())
        let currentKey = generateKeyForIteration(component, templateEl, index, iterationScopeVariables)
        let nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(currentEl.nextElementSibling, currentKey)

        // If we haven't found a matching key, insert the element at the current position.
        if (! nextEl) {
            nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl)

            // And transition it in if it's not the first page load.
            transitionIn(nextEl, () => {}, () => {}, component, initialUpdate)

            nextEl.__x_for = iterationScopeVariables
            component.initializeElements(nextEl, () => nextEl.__x_for)
        // Otherwise update the element we found.
        } else {
            // Temporarily remove the key indicator to allow the normal "updateElements" to work.
            delete nextEl.__x_for_key

            nextEl.__x_for = iterationScopeVariables
            component.updateElements(nextEl, () => nextEl.__x_for)
        }

        currentEl = nextEl
        currentEl.__x_for_key = currentKey
    })

    removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component)
}

// This was taken from VueJS 2.* core. Thanks Vue!
function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
    let stripParensRE = /^\(|\)$/g
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
    let inMatch = expression.match(forAliasRE)
    if (! inMatch) return
    let res = {}
    res.items = inMatch[2].trim()
    let item = inMatch[1].trim().replace(stripParensRE, '')
    let iteratorMatch = item.match(forIteratorRE)

    if (iteratorMatch) {
        res.item = item.replace(forIteratorRE, '').trim()
        res.index = iteratorMatch[1].trim()

        if (iteratorMatch[2]) {
            res.collection = iteratorMatch[2].trim()
        }
    } else {
        res.item = item
    }
    return res
}

function getIterationScopeVariables(iteratorNames, item, index, items, extraVars) {
    // We must create a new object, so each iteration has a new scope
    let scopeVariables = extraVars ? {...extraVars} : {}
    scopeVariables[iteratorNames.item] = item
    if (iteratorNames.index) scopeVariables[iteratorNames.index] = index
    if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items

    return scopeVariables
}

function generateKeyForIteration(component, el, index, iterationScopeVariables) {
    let bindKeyAttribute = getXAttrs(el, component, 'bind').filter(attr => attr.value === 'key')[0]

    // If the dev hasn't specified a key, just return the index of the iteration.
    if (! bindKeyAttribute) return index

    return component.evaluateReturnExpression(el, bindKeyAttribute.expression, () => iterationScopeVariables)
}

function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
    let ifAttribute = getXAttrs(el, component, 'if')[0]

    if (ifAttribute && ! component.evaluateReturnExpression(el, ifAttribute.expression)) {
        return []
    }

    let items = component.evaluateReturnExpression(el, iteratorNames.items, extraVars)

    // This adds support for the `i in n` syntax.
    if (isNumeric(items) && items > 0) {
        items = Array.from(Array(items).keys(), i => i + 1)
    }

    return items
}

function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
    let clone = document.importNode(templateEl.content, true  )

    currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling)

    return currentEl.nextElementSibling
}

function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
    if (! nextEl) return

    // If we are already past the x-for generated elements, we don't need to look ahead.
    if (nextEl.__x_for_key === undefined) return

    // If the the key's DO match, no need to look ahead.
    if (nextEl.__x_for_key === currentKey) return nextEl

    // If they don't, we'll look ahead for a match.
    // If we find it, we'll move it to the current position in the loop.
    let tmpNextEl = nextEl

    while(tmpNextEl) {
        if (tmpNextEl.__x_for_key === currentKey) {
            return tmpNextEl.parentElement.insertBefore(tmpNextEl, nextEl)
        }

        tmpNextEl = (tmpNextEl.nextElementSibling && tmpNextEl.nextElementSibling.__x_for_key !== undefined) ? tmpNextEl.nextElementSibling : false
    }
}

function removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component) {
    var nextElementFromOldLoop = (currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== undefined) ? currentEl.nextElementSibling : false

    while (nextElementFromOldLoop) {
        let nextElementFromOldLoopImmutable = nextElementFromOldLoop
        let nextSibling = nextElementFromOldLoop.nextElementSibling
        transitionOut(nextElementFromOldLoop, () => {
            nextElementFromOldLoopImmutable.remove()
        }, () => {}, component)
        nextElementFromOldLoop = (nextSibling && nextSibling.__x_for_key !== undefined) ? nextSibling : false
    }
}
