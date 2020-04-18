import { transitionIn, transitionOut, getXAttrs } from '../utils'

export function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
    warnIfNotTemplateTag(templateEl)

    let iteratorNames = parseForExpression(expression)

    let items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars)

    // As we walk the array, we'll also walk the DOM (updating/creating as we go).
    let currentEl = templateEl
    items.forEach((item, index) => {
        let iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index, items, extraVars())
        let currentKey = generateKeyForIteration(component, templateEl, index, iterationScopeVariables)
        let nextEl = currentEl.nextElementSibling

        // If there's no previously x-for processed element ahead, add one.
        if (! nextEl || nextEl.__x_for_key === undefined) {
            nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl)

            // And transition it in if it's not the first page load.
            transitionIn(nextEl, () => {}, initialUpdate)

            nextEl.__x_for = iterationScopeVariables
            component.initializeElements(nextEl, () => nextEl.__x_for)
        } else {
            nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey)

            // If we haven't found a matching key, just insert the element at the current position
            if (! nextEl) {
                nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl)
            }

            // Temporarily remove the key indicator to allow the normal "updateElements" to work
            delete nextEl.__x_for_key

            nextEl.__x_for = iterationScopeVariables
            component.updateElements(nextEl, () => nextEl.__x_for)
        }

        currentEl = nextEl
        currentEl.__x_for_key = currentKey
    })

    removeAnyLeftOverElementsFromPreviousUpdate(currentEl)
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
    let bindKeyAttribute = getXAttrs(el, 'bind').filter(attr => attr.value === 'key')[0]

    // If the dev hasn't specified a key, just return the index of the iteration.
    if (! bindKeyAttribute) return index

    return component.evaluateReturnExpression(el, bindKeyAttribute.expression, () => iterationScopeVariables)
}

function warnIfNotTemplateTag(el) {
    if (el.tagName.toLowerCase() !== 'template') console.warn('Alpine: [x-for] directive should only be added to <template> tags.')
}

function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
    let ifAttribute = getXAttrs(el, 'if')[0]

    if (ifAttribute && ! component.evaluateReturnExpression(el, ifAttribute.expression)) {
        return []
    }

    return component.evaluateReturnExpression(el, iteratorNames.items, extraVars)
}

function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
    let clone = document.importNode(templateEl.content, true  )

    if (clone.childElementCount !== 1) console.warn('Alpine: <template> tag with [x-for] encountered with multiple element roots. Make sure <template> only has a single child node.')

    currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling)

    return currentEl.nextElementSibling
}

function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
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

function removeAnyLeftOverElementsFromPreviousUpdate(currentEl) {
    var nextElementFromOldLoop = (currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== undefined) ? currentEl.nextElementSibling : false

    while (nextElementFromOldLoop) {
        let nextElementFromOldLoopImmutable = nextElementFromOldLoop
        let nextSibling = nextElementFromOldLoop.nextElementSibling
        transitionOut(nextElementFromOldLoop, () => {
            nextElementFromOldLoopImmutable.remove()
        })
        nextElementFromOldLoop = (nextSibling && nextSibling.__x_for_key !== undefined) ? nextSibling : false
    }
}
