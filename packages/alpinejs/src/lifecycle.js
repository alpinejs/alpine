import { startObservingMutations, onAttributesAdded, onElAdded, onElRemoved, cleanupAttributes, cleanupElement } from "./mutation"
import { deferHandlingDirectives, directiveExists, directives } from "./directives"
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

    setTimeout(() => {
        warnAboutMissingPlugins()
    })
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
            intercept(el, skip)

            initInterceptors.forEach(i => i(el, skip))

            directives(el, el.attributes).forEach(handle => handle())

            el._x_ignore && skip()
        })
    })
}

export function destroyTree(root, walker = walk) {
    walker(root, el => {
        cleanupElement(el)
        cleanupAttributes(el)
    })
}

function warnAboutMissingPlugins() {
    let pluginDirectives = [
        [ 'ui', 'dialog', ['[x-dialog], [x-popover]'] ],
        [ 'anchor', 'anchor', ['[x-anchor]'] ],
        [ 'sort', 'sort', ['[x-sort]'] ],
    ]

    pluginDirectives.forEach(([ plugin, directive, selectors ]) => {
        if (directiveExists(directive)) return

        selectors.some(selector => {
            if (document.querySelector(selector)) {
                warn(`found "${selector}", but missing ${plugin} plugin`)

                return true
            }
        })
    })
}
