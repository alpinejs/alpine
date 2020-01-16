import { transitionIn, transitionOut, getXAttrs } from '../utils'

export function handleForDirective(component, el, expression, initialUpdate) {
    const { single, bunch, iterator1, iterator2 } = parseFor(expression)

    var output = component.evaluateReturnExpression(bunch)

    var previousEl = el
    output.forEach((i, index, group) => {
        const nextEl = previousEl.nextElementSibling
        let currentEl = nextEl
        const keyAttr = getXAttrs(el, 'bind').filter(attr => attr.value === 'key')[0]

        let keyAliases = { [single]: i }
        if (iterator1) keyAliases[iterator1] = index
        if (iterator2) keyAliases[iterator2] = group

        const currentKey = keyAttr
            ? component.evaluateReturnExpression(keyAttr.expression, keyAliases)
            : index

        if (nextEl && nextEl.__x_for_key !== undefined) {
            // The key is not the same as the item in the dom.
            if (nextEl.__x_for_key !== currentKey) {
                // Let's see if it's somewhere else.
                var tmpCurrentEl = currentEl
                while(tmpCurrentEl) {
                    if (tmpCurrentEl.__x_for_key === currentKey) {
                        el.parentElement.insertBefore(tmpCurrentEl, currentEl)
                        currentEl = tmpCurrentEl
                        break
                    }

                    tmpCurrentEl = (tmpCurrentEl.nextElementSibling && tmpCurrentEl.nextElementSibling.__x_for_key !== undefined) ? tmpCurrentEl.nextElementSibling : false
                }

            }

            // Temporarily remove the key indicator to allow the normal "updateElements" to work
            delete currentEl.__x_for_key

            component.updateElements(currentEl, {'item': i})

            // Reset it for next time around.
            currentEl.__x_for_key = currentKey
        } else {
            const clone = document.importNode(el.content, true);
            el.parentElement.insertBefore(clone, nextEl)

            currentEl = previousEl.nextElementSibling

            transitionIn(currentEl, () => {}, initialUpdate)

            component.initializeElements(currentEl, {[single]: i})

            currentEl.__x_for_key = currentKey
        }

        previousEl = currentEl
    })

    // Clean up oldies
    var thing = (previousEl.nextElementSibling && previousEl.nextElementSibling.__x_for_key !== undefined) ? previousEl.nextElementSibling : false

    while(thing) {
        const thingImmutable = thing
        transitionOut(thing, () => {
            thingImmutable.remove()
        })

        thing = (thing.nextElementSibling && thing.nextElementSibling.__x_for_key !== undefined) ? thing.nextElementSibling : false
    }
}

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
