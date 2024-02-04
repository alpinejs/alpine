import { startObservingMutations, onAttributesAdded, onElAdded, onElRemoved, cleanupAttributes, cleanupElement } from "./mutation"
import { deferHandlingDirectives, directives } from "./directives"
import { dispatch } from './utils/dispatch'
import { walk } from "./utils/walk"
import { warn } from './utils/warn'

let started = false

export function start() {
    if (started) warn('Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.')

    started = true

    if (! document.body) warn('Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine\'s `<script>` tag?')

    dispatch(document, 'alpine:init')
    dispatch(document, 'alpine:initializing')

    startObservingMutations()

    onElAdded(el => initTree(el, walk))
    onElRemoved(el => destroyTree(el))

    onAttributesAdded((el, attrs) => {
        directives(el, attrs).forEach(handle => handle())
    })

    let outNestedComponents = el => ! closestRoot(el.parentElement, true)
    Array.from(document.querySelectorAll(allSelectors().join(',')))
        .filter(outNestedComponents)
        .forEach(el => {
            initTree(el)
        })

    dispatch(document, 'alpine:initialized')
}

let rootSelectorCallbacks = []
let initSelectorCallbacks = []

export function rootSelectors() {
    return rootSelectorCallbacks.map(fn => fn())
}

export function allSelectors() {
    return rootSelectorCallbacks.concat(initSelectorCallbacks).map(fn => fn())
}

export function addRootSelector(selectorCallback) { rootSelectorCallbacks.push(selectorCallback) }
export function addInitSelector(selectorCallback) { initSelectorCallbacks.push(selectorCallback) }

export function closestRoot(el, includeInitSelectors = false) {
    return findClosest(el, element => {
        const selectors = includeInitSelectors ? allSelectors() : rootSelectors()

        if (selectors.some(selector => element.matches(selector))) return true
    })
}

export function findClosest(el, callback) {
    if (! el) return

    if (callback(el)) return el

    // Support crawling up teleports.
    if (el._x_teleportBack) el = el._x_teleportBack

    if (! el.parentElement) return

    return findClosest(el.parentElement, callback)
}

export function isRoot(el) {
    return rootSelectors().some(selector => el.matches(selector))
}

let initInterceptors = []

export function interceptInit(callback) { initInterceptors.push(callback) }

export function initTree(el, walker = walk, intercept = () => {}) {
    deferHandlingDirectives(() => {
        walker(el, (el, skip) => {
            if (el._x_inited) {
                if (el._x_ignore) skip()

                return
            }

            intercept(el, skip)

            initInterceptors.forEach(i => i(el, skip))

            directives(el, el.attributes).forEach(handle => handle())

            if (el._x_ignore) {
                skip()
            } else {
                el._x_inited = true
            }
        })
    })
}

export function destroyTree(root, walker = walk) {
    walker(root, el => {
        cleanupAttributes(el)
        cleanupElement(el)

        delete el._x_inited
    })
}
