import { addScopeToNode } from '../scope'
import { evaluateLater } from '../evaluator'
import { directive } from '../directives'
import { reactive } from '../reactivity'
import { initTree } from '../lifecycle'
import { mutateDom } from '../mutation'
import { warn } from '../utils/warn'
import { dequeueJob } from '../scheduler'
import { skipDuringClone } from '../clone'

directive('for', (el, { expression }, { effect, cleanup }) => {
    let iteratorNames = parseForExpression(expression)

    let evaluateItems = evaluateLater(el, iteratorNames.items)
    let evaluateKey = evaluateLater(el,
        // the x-bind:key expression is stored for our use instead of evaluated.
        el._x_keyExpression || 'index'
    )

    el._x_prevKeys = []
    el._x_lookup = {}

    effect(() => loop(el, iteratorNames, evaluateItems, evaluateKey))

    cleanup(() => {
        Object.values(el._x_lookup).forEach(el => el.remove())

        delete el._x_prevKeys
        delete el._x_lookup
    })
})

let shouldFastRender = true

function loop(el, iteratorNames, evaluateItems, evaluateKey) {
    let isObject = i => typeof i === 'object' && ! Array.isArray(i)
    let templateEl = el

    evaluateItems(items => {
        // Prepare yourself. There's a lot going on here. Take heart,
        // every bit of complexity in this function was added for
        // the purpose of making Alpine fast with large datas.

        // Support number literals. Ex: x-for="i in 100"
        if (isNumeric(items) && items >= 0) {
            items = Array.from(Array(items).keys(), i => i + 1)
        }

        if (items === undefined) items = []

        let lookup = el._x_lookup
        let prevKeys = el._x_prevKeys
        let scopes = []
        let keys = []

        // In order to preserve DOM elements (move instead of replace)
        // we need to generate all the keys for every iteration up
        // front. These will be our source of truth for diffing.
        if (isObject(items)) {
            items = Object.entries(items).map(([key, value]) => {
                let scope = getIterationScopeVariables(iteratorNames, value, key, items)

                evaluateKey(value => {
                    if (keys.includes(value)) warn('Duplicate key on x-for', el)

                    keys.push(value)
                }, { scope: { index: key, ...scope} })

                scopes.push(scope)
            })
        } else {
            for (let i = 0; i < items.length; i++) {
                let scope = getIterationScopeVariables(iteratorNames, items[i], i, items)

                evaluateKey(value => {
                    if (keys.includes(value)) warn('Duplicate key on x-for', el)

                    keys.push(value)
                }, { scope: { index: i, ...scope} })

                scopes.push(scope)
            }
        }

        // Rather than making DOM manipulations inside one large loop, we'll
        // instead track which mutations need to be made in the following
        // arrays. After we're finished, we can batch them at the end.
        let adds = []
        let moves = []
        let removes = []
        let sames = []

        // First, we track elements that will need to be removed.
        for (let i = 0; i < prevKeys.length; i++) {
            let key = prevKeys[i]

            if (keys.indexOf(key) === -1) removes.push(key)
        }

        // Notice we're mutating prevKeys as we go. This makes it
        // so that we can efficiently make incremental comparisons.
        prevKeys = prevKeys.filter(key => ! removes.includes(key))

        let lastKey = 'template'

        // This is the important part of the diffing algo. Identifying
        // which keys (future DOM elements) are new, which ones have
        // or haven't moved (noting where they moved to / from).
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]

            let prevIndex = prevKeys.indexOf(key)

            if (prevIndex === -1) {
                // New key found.
                prevKeys.splice(i, 0, key)

                adds.push([lastKey, i])
            } else if (prevIndex !== i) {
                // A key has moved.
                let keyInSpot = prevKeys.splice(i, 1)[0]
                let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0]

                prevKeys.splice(i, 0, keyForSpot)
                prevKeys.splice(prevIndex, 0, keyInSpot)

                moves.push([keyInSpot, keyForSpot])
            } else {
                // This key hasn't moved, but we'll still keep track
                // so that we can refresh it later on.
                sames.push(key)
            }

            lastKey = key
        }

        // Now that we've done the diffing work, we can apply the mutations
        // in batches for both separating types work and optimizing
        // for browser performance.

        // We'll remove all the nodes that need to be removed,
        // letting the mutation observer pick them up and
        // clean up any side effects they had.
        for (let i = 0; i < removes.length; i++) {
            let key = removes[i]

            // Remove any queued effects that might run after the DOM node has been removed.
            if (!! lookup[key]._x_effects) {
                lookup[key]._x_effects.forEach(dequeueJob)
            }

            lookup[key].remove()

            lookup[key] = null
            delete lookup[key]
        }

        // Here we'll move elements around, skipping
        // mutation observer triggers by using "mutateDom".
        for (let i = 0; i < moves.length; i++) {
            let [keyInSpot, keyForSpot] = moves[i]

            let elInSpot = lookup[keyInSpot]
            let elForSpot = lookup[keyForSpot]

            let marker = document.createElement('div')

            mutateDom(() => {
                if (! elForSpot) warn(`x-for ":key" is undefined or invalid`, templateEl, keyForSpot, lookup)

                elForSpot.after(marker)
                elInSpot.after(elForSpot)
                elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl)
                marker.before(elInSpot)
                elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl)
                marker.remove()
            })

            elForSpot._x_refreshXForScope(scopes[keys.indexOf(keyForSpot)])
        }

        // We can now create and add new elements.
        for (let i = 0; i < adds.length; i++) {
            let [lastKey, index] = adds[i]

            let lastEl = (lastKey === 'template') ? templateEl : lookup[lastKey]
            // If the element is a x-if template evaluated to true,
            // point lastEl to the if-generated node
            if (lastEl._x_currentIfEl) lastEl = lastEl._x_currentIfEl

            let scope = scopes[index]
            let key = keys[index]

            let clone = document.importNode(templateEl.content, true).firstElementChild

            let reactiveScope = reactive(scope)

            addScopeToNode(clone, reactiveScope, templateEl)

            clone._x_refreshXForScope = (newScope) => {
                Object.entries(newScope).forEach(([key, value]) => {
                    reactiveScope[key] = value
                })
            }

            mutateDom(() => {
                lastEl.after(clone)

                // These nodes will be "inited" as morph walks the tree...
                skipDuringClone(() => initTree(clone))()
            })

            if (typeof key === 'object') {
                warn('x-for key cannot be an object, it must be a string or an integer', templateEl)
            }

            lookup[key] = clone
        }

        // If an element hasn't changed, we still want to "refresh" the
        // data it depends on in case the data has changed in an
        // "unobservable" way.
        for (let i = 0; i < sames.length; i++) {
            lookup[sames[i]]._x_refreshXForScope(scopes[keys.indexOf(sames[i])])
        }

        // Now we'll log the keys (and the order they're in) for comparing
        // against next time.
        templateEl._x_prevKeys = keys
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
