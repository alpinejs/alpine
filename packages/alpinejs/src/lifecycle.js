import { startObservingMutations, onAttributesAdded, onElAdded, onElRemoved, cleanupAttributes, cleanupElement } from "./mutation"
import { deferHandlingDirectives, directiveExists, directives } from "./directives"
import { dispatch } from './utils/dispatch'
import { walk } from "./utils/walk"
import { warn } from './utils/warn'
import { handleError } from './utils/error'
import { deleteDeferredInit, getDeferredInit, hasDeferredInit, setDeferredInit } from './deferred-init'

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
        if (queueDeferredAttributes(el, attrs)) return

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

    if (el._x_teleportBack) return findClosest(el._x_teleportBack, callback)

    if (el.parentNode instanceof ShadowRoot) {
        return findClosest(el.parentNode.host, callback)
    }

    if (! el.parentElement) return

    return findClosest(el.parentElement, callback)
}

export function isRoot(el) {
    return rootSelectors().some(selector => el.matches(selector))
}

let initInterceptors = []

export function interceptInit(callback) { initInterceptors.push(callback) }

let currentInitContext

export function deferInit(el, promise) {
    if (currentInitContext?.el === el) {
        currentInitContext.promises.push(Promise.resolve(promise))

        return
    }

    let deferred = getDeferredInit(el)

    if (! deferred) {
        deferred = createDeferredInit(el)

        setDeferredInit(el, deferred)
    }

    addDeferredPromise(deferred, promise)
}

export function isDeferringInit(el) {
    return !! findDeferredInit(el)
}

let markerDispenser = 1

export function initTree(el, walker = walk, intercept = () => {}, resuming = null) {
    // Don't init a tree within a parent that is being ignored...
    if (findClosest(el, i => i._x_ignore)) return
    if (isDeferringInit(el)) return

    let root = el

    deferHandlingDirectives(() => {
        walker(el, (el, skip) => {
            let resume = el === root ? resuming : null

            // If the element has a marker, it's already been initialized...
            if (el._x_marker) {
                initializeDeferredAttributes(el, resuming)

                return
            }

            if (hasDeferredInit(el)) return skip()

            let interceptors = resume?.interceptors || [intercept, ...initInterceptors]
            let interceptorIndex = resume?.interceptorIndex || 0
            let skipDescendants = resume?.skipDescendants || false

            let skipAndRemember = () => {
                skipDescendants = true

                skip()
            }

            for (; interceptorIndex < interceptors.length; interceptorIndex++) {
                let context = { el, promises: [] }
                let previousContext = currentInitContext

                currentInitContext = context

                try {
                    interceptors[interceptorIndex](el, skipAndRemember)
                } finally {
                    currentInitContext = previousContext
                }

                if (context.promises.length) {
                    let deferred = createDeferredInit(el, {
                        walker,
                        intercept,
                        interceptors,
                        interceptorIndex: interceptorIndex + 1,
                        skipDescendants,
                    })

                    setDeferredInit(el, deferred)
                    context.promises.forEach(promise => addDeferredPromise(deferred, promise))
                    skip()

                    return
                }
            }

            directives(el, el.attributes).forEach(handle => handle())

            // Add a marker to the element so we can tell if it's been initialized...
            // This is important so that we can prevent double-initialization of
            // elements that are moved around on the page.
            if (!el._x_ignore) el._x_marker = markerDispenser++

            if (el._x_ignore || skipDescendants) skip()
        })
    })
}

function createDeferredInit(el, resume = {}) {
    return {
        el,
        pending: 0,
        attributes: new Map(),
        walker: resume.walker || walk,
        intercept: resume.intercept || (() => {}),
        interceptors: resume.interceptors,
        interceptorIndex: resume.interceptorIndex,
        skipDescendants: resume.skipDescendants,
    }
}

function addDeferredPromise(deferred, promise) {
    deferred.pending++

    Promise.resolve(promise).then(
        () => settleDeferredInit(deferred),
        error => {
            try {
                handleError(error, deferred.el)
            } finally {
                settleDeferredInit(deferred)
            }
        },
    )
}

function settleDeferredInit(deferred) {
    deferred.pending--

    if (deferred.pending > 0) return
    if (getDeferredInit(deferred.el) !== deferred) return

    deleteDeferredInit(deferred.el)

    if (! deferred.el.isConnected) return

    initTree(deferred.el, deferred.walker, deferred.intercept, deferred)
}

function findDeferredInit(el) {
    let root = findClosest(el, element => hasDeferredInit(element))

    return root ? getDeferredInit(root) : undefined
}

function queueDeferredAttributes(el, attrs) {
    let deferred = findDeferredInit(el)

    if (! deferred) return false

    let attributes = deferred.attributes.get(el) || new Set()

    attrs.forEach(attribute => attributes.add(attribute.name))
    deferred.attributes.set(el, attributes)

    return true
}

function initializeDeferredAttributes(el, deferred) {
    let attributeNames = deferred?.attributes.get(el)

    if (! attributeNames) return

    let attributes = Array.from(attributeNames)
        .filter(name => el.hasAttribute(name))
        .map(name => ({ name, value: el.getAttribute(name) }))

    directives(el, attributes).forEach(handle => handle())
}

export function destroyTree(root, walker = walk) {
    walker(root, el => {
        deleteDeferredInit(el)
        cleanupElement(el)
        cleanupAttributes(el)
        delete el._x_marker
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
