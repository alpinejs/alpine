import { addScopeToNode } from '../scope'
import { evaluateLater } from '../evaluator'
import { directive } from '../directives'
import { reactive } from '../reactivity'
import { initTree, destroyTree } from '../lifecycle'
import { mutateDom } from '../mutation'
import { warn } from '../utils/warn'
import { skipDuringClone } from '../clone'

directive('for', (el, { expression }, { effect, cleanup }) => {
    let iteratorNames = parseForExpression(expression)

    let evaluateItems = evaluateLater(el, iteratorNames.items)
    let evaluateKey = evaluateLater(el,
        // the x-bind:key expression is stored for our use instead of evaluated.
        el._x_keyExpression || 'index'
    )

    el._x_lookup = new Map()

    effect(() => loop(el, iteratorNames, evaluateItems, evaluateKey))

    cleanup(() => {
        el._x_lookup.forEach(el =>
            mutateDom(() => {
                destroyTree(el)

                el.remove()
            })
        )

        delete el._x_lookup
    })
})

function refreshScope(scope) {
    return (newScope) => {
        Object.entries(newScope).forEach(([key, value]) => {
            scope[key] = value
        })
    }
}

function loop(templateEl, iteratorNames, evaluateItems, evaluateKey) {
    evaluateItems(items => {
        // Prepare yourself. There's a lot going on here. Take heart,
        // every bit of complexity in this function was added for
        // the purpose of making Alpine fast with large datas.

        // Support number literals. Ex: x-for="i in 100"
        if (isNumeric(items))
            items = Array.from({ length: items }, (_, i) => i + 1)

        if (items === undefined) items = []

        // Support Set and Map objects by converting to arrays.
        if (items instanceof Set) items = Array.from(items)
        if (items instanceof Map) items = Array.from(items)

        // In order to remove elements early we need to generate the key/scope
        // pairs up front, moving existing elements from the old lookup to the
        // new. This leaves only the elements to be removed in the old lookup.
        let oldLookup = templateEl._x_lookup
        let lookup = new Map()
        templateEl._x_lookup = lookup

        let hasStringKeys = isObject(items)
        let scopeEntries = Object.entries(items).map(([index, item]) => {
            if (! hasStringKeys) index = parseInt(index)
            let scope = getIterationScopeVariables(iteratorNames, item, index, items)
            let key
            evaluateKey(innerKey => {
                if (typeof innerKey === 'object')
                    warn('x-for key cannot be an object, it must be a string or an integer', templateEl)

                if (oldLookup.has(innerKey)) {
                    lookup.set(innerKey, oldLookup.get(innerKey))
                    oldLookup.delete(innerKey)
                }
                key = innerKey
            }, { scope: { index, ...scope } })
            return [key, scope]
        })

        mutateDom(() => {
            oldLookup.forEach((el) => {
                destroyTree(el)
                el.remove()
            })

            let added = new Set()

            let prev = templateEl
            scopeEntries.forEach(([key, scope]) => {
                if (lookup.has(key)) {
                    let el = lookup.get(key)
                    el._x_refreshXForScope(scope)

                    if (prev.nextElementSibling !== el) {
                        if (prev.nextElementSibling)
                            el.replaceWith(prev.nextElementSibling)
                        prev.after(el)
                    }
                    prev = el

                    if (el._x_currentIfEl) {
                        if (el.nextElementSibling !== el._x_currentIfEl)
                            prev.after(el._x_currentIfEl)
                        prev = el._x_currentIfEl
                    }
                    return
                }

                let clone = document.importNode(templateEl.content, true).firstElementChild
                let reactiveScope = reactive(scope)
                addScopeToNode(clone, reactiveScope, templateEl)
                clone._x_refreshXForScope = refreshScope(reactiveScope)

                lookup.set(key, clone)
                added.add(clone)

                prev.after(clone)
                prev = clone
            })
            skipDuringClone(() => added.forEach(clone => initTree(clone)))()
        })
    })
}

// This was taken from VueJS 2.* core. Thanks Vue!
function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
    let stripParensRE = /^\s*\(|\)\s*$/g
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
    let inMatch = expression.match(forAliasRE)

    if (! inMatch) return

    let res = {}
    res.items = inMatch[2].trim()
    let item = inMatch[1].replace(stripParensRE, '').trim()
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

function getIterationScopeVariables(iteratorNames, item, index, items) {
    // We must create a new object, so each iteration has a new scope
    let scopeVariables = {}

    // Support array destructuring ([foo, bar]).
    if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
        let names = iteratorNames.item.replace('[', '').replace(']', '').split(',').map(i => i.trim())

        names.forEach((name, i) => {
            scopeVariables[name] = item[i]
        })
    // Support object destructuring ({ foo: 'oof', bar: 'rab' }).
    } else if (/^\{.*\}$/.test(iteratorNames.item) && ! Array.isArray(item) && typeof item === 'object') {
        let names = iteratorNames.item.replace('{', '').replace('}', '').split(',').map(i => i.trim())

        names.forEach(name => {
            scopeVariables[name] = item[name]
        })
    } else {
        scopeVariables[iteratorNames.item] = item
    }

    if (iteratorNames.index) scopeVariables[iteratorNames.index] = index

    if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items

    return scopeVariables
}

function isNumeric(subject){
    return ! Array.isArray(subject) && ! isNaN(subject)
}

function isObject(subject) {
    return typeof subject === 'object' && ! Array.isArray(subject)
}
