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
        el._x_lookup.forEach(entry =>
            mutateDom(() => {
                if (entry.startComment) {
                    entry.elements.forEach(child => {
                        destroyTree(child)
                        child.remove()
                    })
                    entry.startComment.remove()
                    entry.endComment.remove()
                } else {
                    destroyTree(entry)
                    entry.remove()
                }
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
    let isFragment = templateEl.content.children.length > 1

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
            // Cleanup removed items
            oldLookup.forEach((entry) => {
                if (isFragment) {
                    entry.elements.forEach(el => {
                        destroyTree(el)
                        el.remove()
                    })
                    entry.startComment.remove()
                    entry.endComment.remove()
                } else {
                    destroyTree(entry)
                    entry.remove()
                }
            })

            let added = new Set()

            let prev = templateEl
            scopeEntries.forEach(([key, scope]) => {
                if (lookup.has(key)) {
                    let entry = lookup.get(key)
                    entry._x_refreshXForScope(scope)

                    if (isFragment) {
                        let { startComment, endComment, elements } = entry

                        // Check if group is already in correct position
                        if (prev.nextSibling !== startComment) {
                            prev.after(startComment)
                            let cursor = startComment
                            elements.forEach(el => {
                                cursor.after(el)
                                cursor = el
                            })
                            cursor.after(endComment)
                        }
                        prev = endComment
                    } else {
                        if (prev.nextElementSibling !== entry) {
                            if (prev.nextElementSibling)
                                entry.replaceWith(prev.nextElementSibling)
                            prev.after(entry)
                        }
                        prev = entry

                        if (entry._x_currentIfEl) {
                            if (entry.nextElementSibling !== entry._x_currentIfEl)
                                prev.after(entry._x_currentIfEl)
                            prev = entry._x_currentIfEl
                        }
                    }
                    return
                }

                // New item — clone and insert
                if (isFragment) {
                    let startComment = document.createComment(' [x-for] ')
                    let endComment = document.createComment(' [/x-for] ')
                    let fragment = document.importNode(templateEl.content, true)
                    let elements = Array.from(fragment.children)

                    let reactiveScope = reactive(scope)
                    let group = { startComment, endComment, elements }

                    elements.forEach(el => {
                        addScopeToNode(el, reactiveScope, templateEl)
                    })

                    group._x_refreshXForScope = refreshScope(reactiveScope)

                    lookup.set(key, group)

                    prev.after(startComment)
                    let cursor = startComment
                    elements.forEach(el => {
                        cursor.after(el)
                        cursor = el
                        added.add(el)
                    })
                    cursor.after(endComment)
                    prev = endComment
                } else {
                    let clone = document.importNode(templateEl.content, true).firstElementChild
                    let reactiveScope = reactive(scope)
                    addScopeToNode(clone, reactiveScope, templateEl)
                    clone._x_refreshXForScope = refreshScope(reactiveScope)

                    lookup.set(key, clone)
                    added.add(clone)

                    prev.after(clone)
                    prev = clone
                }
            })
            skipDuringClone(() => added.forEach(el => initTree(el)))()
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
