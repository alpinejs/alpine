import { transitionIn, transitionOut, getXAttrs } from '../utils'

export function handleForDirective(component, el, expression, initialUpdate, extraVars) {
    if (el.tagName.toLowerCase() !== 'template') console.warn('Alpine: [x-for] directive should only be added to <template> tags.')

    const { single, bunch, iterator1, iterator2 } = parseFor(expression)

    var items
    const ifAttr = getXAttrs(el, 'if')[0]
    if (ifAttr && ! component.evaluateReturnExpression(el, ifAttr.expression))  {
        // If there is an "x-if" attribute in conjunction with an x-for,
        // AND x-if resolves to false, just pretend the x-for is
        // empty, effectively hiding it.
        items = []
    } else {
        items = component.evaluateReturnExpression(el, bunch, extraVars)
    }

    // As we walk the array, we'll also walk the DOM (updating/creating as we go).
    var previousEl = el
    items.forEach((i, index, group) => {
        const currentKey = getThisIterationsKeyFromTemplateTag(component, el, single, iterator1, iterator2, i, index, group)
        let currentEl = previousEl.nextElementSibling

        // Let's check and see if the x-for has already generated an element last time it ran.
        if (currentEl && currentEl.__x_for_key !== undefined) {
            // If the the key's don't match.
            if (currentEl.__x_for_key !== currentKey) {
                // We'll look ahead to see if we can find it further down.
                var tmpCurrentEl = currentEl
                while(tmpCurrentEl) {
                    // If we found it later in the DOM.
                    if (tmpCurrentEl.__x_for_key === currentKey) {
                        // Move it to where it's supposed to be in the DOM.
                        el.parentElement.insertBefore(tmpCurrentEl, currentEl)
                        // And set it as the current element as if we just created it.
                        currentEl = tmpCurrentEl
                        break
                    }

                    tmpCurrentEl = (tmpCurrentEl.nextElementSibling && tmpCurrentEl.nextElementSibling.__x_for_key !== undefined) ? tmpCurrentEl.nextElementSibling : false
                }
            }

            // Temporarily remove the key indicator to allow the normal "updateElements" to work
            delete currentEl.__x_for_key

            let xForVars = {}
            xForVars[single] = i
            if (iterator1) xForVars[iterator1] = index
            if (iterator2) xForVars[iterator2] = group
            currentEl.__x_for = xForVars
            component.updateElements(currentEl, () => {
                return currentEl.__x_for
            })
        } else {
            // There are no more .__x_for_key elements, meaning the page is first loading, OR, there are
            // extra items in the array that need to be added as new elements.

            // Let's create a clone from the template.
            const clone = document.importNode(el.content, true)

            if (clone.childElementCount !== 1) console.warn('Alpine: <template> tag with [x-for] encountered with multiple element roots. Make sure <template> only has a single child node.')

            // Insert it where we are in the DOM.
            el.parentElement.insertBefore(clone, currentEl)

            // Set it as the current element.
            currentEl = previousEl.nextElementSibling

            // And transition it in if it's not the first page load.
            transitionIn(currentEl, () => {}, initialUpdate)

            // Now, let's walk the new DOM node and initialize everything,
            // including new nested components.
            // Note we are resolving the "extraData" alias stuff from the dom element value so that it's
            // always up to date for listener handlers that don't get re-registered.
            let xForVars = {}
            xForVars[single] = i
            if (iterator1) xForVars[iterator1] = index
            if (iterator2) xForVars[iterator2] = group
            currentEl.__x_for = xForVars
            component.initializeElements(currentEl, () => {
                return currentEl.__x_for
            })
        }

        currentEl.__x_for_key = currentKey

        previousEl = currentEl
    })

    // Now that we've added/updated/moved all the elements for the current state of the loop.
    // Anything left over, we can get rid of.
    var nextElementFromOldLoop = (previousEl.nextElementSibling && previousEl.nextElementSibling.__x_for_key !== undefined) ? previousEl.nextElementSibling : false

    while(nextElementFromOldLoop) {
        const nextElementFromOldLoopImmutable = nextElementFromOldLoop
        const nextSibling = nextElementFromOldLoop.nextElementSibling

        transitionOut(nextElementFromOldLoop, () => {
            nextElementFromOldLoopImmutable.remove()
        })

        nextElementFromOldLoop = (nextSibling && nextSibling.__x_for_key !== undefined) ? nextSibling : false
    }
}

// This was taken from VueJS 2.* core. Thanks Vue!
function parseFor (expression) {
    const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
    const stripParensRE = /^\(|\)$/g
    const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/

    const inMatch = expression.match(forAliasRE)
    if (! inMatch) return
    const res = {}
    res.bunch = inMatch[2].trim()
    const single = inMatch[1].trim().replace(stripParensRE, '')
    const iteratorMatch = single.match(forIteratorRE)
    if (iteratorMatch) {
        res.single = single.replace(forIteratorRE, '').trim()
        res.iterator1 = iteratorMatch[1].trim()
        if (iteratorMatch[2]) {
            res.iterator2 = iteratorMatch[2].trim()
        }
    } else {
        res.single = single
    }
    return res
  }

function getThisIterationsKeyFromTemplateTag(component, el, single, iterator1, iterator2, i, index, group) {
    const keyAttr = getXAttrs(el, 'bind').filter(attr => attr.value === 'key')[0]

    let keyAliases = { [single]: i }
    if (iterator1) keyAliases[iterator1] = index
    if (iterator2) keyAliases[iterator2] = group

    return keyAttr
        ? component.evaluateReturnExpression(el, keyAttr.expression, () => keyAliases)
        : index
}
