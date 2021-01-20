
// Thanks @stimulus:
// https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
export function domReady() {
    return new Promise(resolve => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", resolve)
        } else {
            resolve()
        }
    })
}

export function arrayUnique(array) {
    return Array.from(new Set(array))
}

export function isTesting() {
    return navigator.userAgent, navigator.userAgent.includes("Node.js")
        || navigator.userAgent.includes("jsdom")
}

export function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB
}

export function warnIfMalformedTemplate(el, directive) {
    if (el.tagName.toLowerCase() !== 'template') {
        console.warn(`Alpine: [${directive}] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#${directive}`)
    } else if (el.content.childElementCount !== 1) {
        console.warn(`Alpine: <template> tag with [${directive}] encountered with an unexpected number of root elements. Make sure <template> has a single root element. `)
    }
}

export function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase()
}

export function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase())
}

export function walk(el, callback) {
    if (callback(el) === false) return

    let node = el.firstElementChild

    while (node) {
        walk(node, callback)

        node = node.nextElementSibling
    }
}

export function debounce(func, wait) {
    var timeout
    return function () {
        var context = this, args = arguments
        var later = function () {
            timeout = null
            func.apply(context, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

const handleError = (el, expression, error) => {
    console.warn(`Alpine Error: "${error}"\n\nExpression: "${expression}"\nElement:`, el);

    if (! isTesting()) {
        Object.assign(error, { el, expression })
        throw error;
    }
}

function tryCatch(cb, { el, expression }) {
    try {
        const value = cb();
        return value instanceof Promise
            ? value.catch((e) => handleError(el, expression, e))
            : value;
    } catch (e) {
        handleError(el, expression, e)
    }
}

export function saferEval(el, expression, dataContext, additionalHelperVariables = {}) {
    return tryCatch(() => {
        if (typeof expression === 'function') {
            return expression.call(dataContext)
        }

        return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `var __alpine_result; with($data) { __alpine_result = ${expression} }; return __alpine_result`))(
            dataContext, ...Object.values(additionalHelperVariables)
        )
    }, { el, expression })
}

export function saferEvalNoReturn(el, expression, dataContext, additionalHelperVariables = {}) {
    return tryCatch(() => {
        if (typeof expression === 'function') {
            return Promise.resolve(expression.call(dataContext, additionalHelperVariables['$event']))
        }

        let AsyncFunction = Function

        /* MODERN-ONLY:START */
            AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
        /* MODERN-ONLY:END */

        // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
        // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.
        if (Object.keys(dataContext).includes(expression)) {
            let methodReference = (new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { return ${expression} }`))(
                dataContext, ...Object.values(additionalHelperVariables)
            )

            if (typeof methodReference === 'function') {
                return Promise.resolve(methodReference.call(dataContext, additionalHelperVariables['$event']))
            } else {
                return Promise.resolve()
            }
        }

        return Promise.resolve((new AsyncFunction(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`))(
            dataContext, ...Object.values(additionalHelperVariables)
        ))
    }, { el, expression })
}

const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref|spread)\b/

export function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name)

    return xAttrRE.test(name)
}

export function getXAttrs(el, component, type) {
    let directives = Array.from(el.attributes).filter(isXAttr).map(parseHtmlAttribute)

    // Get an object of directives from x-spread.
    let spreadDirective = directives.filter(directive => directive.type === 'spread')[0]

    if (spreadDirective) {
        let spreadObject = saferEval(el, spreadDirective.expression, component.$data)

        // Add x-spread directives to the pile of existing directives.
        directives = directives.concat(Object.entries(spreadObject).map(([name, value]) => parseHtmlAttribute({ name, value })))
    }

    if (type) return directives.filter(i => i.type === type)

    return sortDirectives(directives)
}

function sortDirectives(directives) {
    let directiveOrder = ['bind', 'model', 'show', 'catch-all']

    return directives.sort((a, b) => {
        let typeA = directiveOrder.indexOf(a.type) === -1 ? 'catch-all' : a.type
        let typeB = directiveOrder.indexOf(b.type) === -1 ? 'catch-all' : b.type

        return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB)
    })
}

export function parseHtmlAttribute({ name, value }) {
    const normalizedName = replaceAtAndColonWithStandardSyntax(name)

    const typeMatch = normalizedName.match(xAttrRE)
    const valueMatch = normalizedName.match(/:([a-zA-Z0-9\-:]+)/)
    const modifiers = normalizedName.match(/\.[^.\]]+(?=[^\]]*$)/g) || []

    return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map(i => i.replace('.', '')),
        expression: value,
    }
}

export function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = [
        'disabled','checked','required','readonly','hidden','open', 'selected',
        'autofocus', 'itemscope', 'multiple', 'novalidate','allowfullscreen',
        'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop',
        'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer',
        'nomodule'
    ]

    return booleanAttributes.includes(attrName)
}

export function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
        return name.replace('@', 'x-on:')
    } else if (name.startsWith(':')) {
        return name.replace(':', 'x-bind:')
    }

    return name
}

export function convertClassStringToArray(classList, filterFn = Boolean) {
    return classList.split(' ').filter(filterFn)
}

export const TRANSITION_TYPE_IN = 'in'
export const TRANSITION_TYPE_OUT = 'out'
export const TRANSITION_CANCELLED = 'cancelled'

export function transitionIn(el, show, reject, component, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return show()

    if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_IN) {
        // there is already a similar transition going on, this was probably triggered by
        // a change in a different property, let's just leave the previous one doing its job
        return
    }

    const attrs = getXAttrs(el, component, 'transition')
    const showAttr = getXAttrs(el, component, 'show')[0]

    // If this is triggered by a x-show.transition.
    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers

        // If x-show.transition.out, we'll skip the "in" transition.
        if (modifiers.includes('out') && ! modifiers.includes('in')) return show()

        const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out')

        // If x-show.transition.in...out... only use "in" related modifiers for this transition.
        modifiers = settingBothSidesOfTransition
            ? modifiers.filter((i, index) => index < modifiers.indexOf('out')) : modifiers

        transitionHelperIn(el, modifiers, show, reject)
    // Otherwise, we can assume x-transition:enter.
    } else if (attrs.some(attr => ['enter', 'enter-start', 'enter-end'].includes(attr.value))) {
        transitionClassesIn(el, component, attrs, show, reject)
    } else {
    // If neither, just show that damn thing.
        show()
    }
}

export function transitionOut(el, hide, reject, component, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return hide()

    if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_OUT) {
        // there is already a similar transition going on, this was probably triggered by
        // a change in a different property, let's just leave the previous one doing its job
        return
    }

    const attrs = getXAttrs(el, component, 'transition')
    const showAttr = getXAttrs(el, component, 'show')[0]

    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers

        if (modifiers.includes('in') && ! modifiers.includes('out')) return hide()

        const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out')

        modifiers = settingBothSidesOfTransition
            ? modifiers.filter((i, index) => index > modifiers.indexOf('out')) : modifiers

        transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide, reject)
    } else if (attrs.some(attr => ['leave', 'leave-start', 'leave-end'].includes(attr.value))) {
        transitionClassesOut(el, component, attrs, hide, reject)
    } else {
        hide()
    }
}

export function transitionHelperIn(el, modifiers, showCallback, reject) {
    // Default values inspired by: https://material.io/design/motion/speed.html#duration
    const styleValues = {
        duration: modifierValue(modifiers, 'duration', 150),
        origin: modifierValue(modifiers, 'origin', 'center'),
        first: {
            opacity: 0,
            scale: modifierValue(modifiers, 'scale', 95),
        },
        second: {
            opacity: 1,
            scale: 100,
        },
    }

    transitionHelper(el, modifiers, showCallback, () => {}, reject, styleValues, TRANSITION_TYPE_IN)
}

export function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback, reject) {
    // Make the "out" transition .5x slower than the "in". (Visually better)
    // HOWEVER, if they explicitly set a duration for the "out" transition,
    // use that.
    const duration = settingBothSidesOfTransition
        ? modifierValue(modifiers, 'duration', 150)
        : modifierValue(modifiers, 'duration', 150) / 2

    const styleValues = {
        duration: duration,
        origin: modifierValue(modifiers, 'origin', 'center'),
        first: {
            opacity: 1,
            scale: 100,
        },
        second: {
            opacity: 0,
            scale: modifierValue(modifiers, 'scale', 95),
        },
    }

    transitionHelper(el, modifiers, () => {}, hideCallback, reject, styleValues, TRANSITION_TYPE_OUT)
}

function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback

    // If it IS present, grab the value after it: x-show.transition.duration.500ms
    const rawValue = modifiers[modifiers.indexOf(key) + 1]

    if (! rawValue) return fallback

    if (key === 'scale') {
        // Check if the very next value is NOT a number and return the fallback.
        // If x-show.transition.scale, we'll use the default scale value.
        // That is how a user opts out of the opacity transition.
        if (! isNumeric(rawValue)) return fallback
    }

    if (key === 'duration') {
        // Support x-show.transition.duration.500ms && duration.500
        let match = rawValue.match(/([0-9]+)ms/)
        if (match) return match[1]
    }

    if (key === 'origin') {
        // Support chaining origin directions: x-show.transition.top.right
        if (['top', 'right', 'left', 'center', 'bottom'].includes(modifiers[modifiers.indexOf(key) + 2])) {
            return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(' ')
        }
    }

    return rawValue
}

export function transitionHelper(el, modifiers, hook1, hook2, reject, styleValues, type) {
    // clear the previous transition if exists to avoid caching the wrong styles
    if (el.__x_transition) {
        el.__x_transition.cancel && el.__x_transition.cancel()
    }

    // If the user set these style values, we'll put them back when we're done with them.
    const opacityCache = el.style.opacity
    const transformCache = el.style.transform
    const transformOriginCache = el.style.transformOrigin

    // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.
    const noModifiers = ! modifiers.includes('opacity') && ! modifiers.includes('scale')
    const transitionOpacity = noModifiers || modifiers.includes('opacity')
    const transitionScale = noModifiers || modifiers.includes('scale')

    // These are the explicit stages of a transition (same stages for in and for out).
    // This way you can get a birds eye view of the hooks, and the differences
    // between them.
    const stages = {
        start() {
            if (transitionOpacity) el.style.opacity = styleValues.first.opacity
            if (transitionScale) el.style.transform = `scale(${styleValues.first.scale / 100})`
        },
        during() {
            if (transitionScale) el.style.transformOrigin = styleValues.origin
            el.style.transitionProperty = [(transitionOpacity ? `opacity` : ``), (transitionScale ? `transform` : ``)].join(' ').trim()
            el.style.transitionDuration = `${styleValues.duration / 1000}s`
            el.style.transitionTimingFunction = `cubic-bezier(0.4, 0.0, 0.2, 1)`
        },
        show() {
            hook1()
        },
        end() {
            if (transitionOpacity) el.style.opacity = styleValues.second.opacity
            if (transitionScale) el.style.transform = `scale(${styleValues.second.scale / 100})`
        },
        hide() {
            hook2()
        },
        cleanup() {
            if (transitionOpacity) el.style.opacity = opacityCache
            if (transitionScale) el.style.transform = transformCache
            if (transitionScale) el.style.transformOrigin = transformOriginCache
            el.style.transitionProperty = null
            el.style.transitionDuration = null
            el.style.transitionTimingFunction = null
        },
    }

    transition(el, stages, type, reject)
}

const ensureStringExpression = (expression, el, component) => {
    return typeof expression === 'function'
        ? component.evaluateReturnExpression(el, expression)
        : expression
}

export function transitionClassesIn(el, component, directives, showCallback, reject) {
    const enter = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter') || { expression: '' }).expression, el, component))
    const enterStart = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter-start') || { expression: '' }).expression, el, component))
    const enterEnd = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter-end') || { expression: '' }).expression, el, component))

    transitionClasses(el, enter, enterStart, enterEnd, showCallback, () => {}, TRANSITION_TYPE_IN, reject)
}

export function transitionClassesOut(el, component, directives, hideCallback, reject) {
    const leave = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave') || { expression: '' }).expression, el, component))
    const leaveStart = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave-start') || { expression: '' }).expression, el, component))
    const leaveEnd = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave-end') || { expression: '' }).expression, el, component))

    transitionClasses(el, leave, leaveStart, leaveEnd, () => {}, hideCallback, TRANSITION_TYPE_OUT, reject)
}

export function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2, type, reject) {
    // clear the previous transition if exists to avoid caching the wrong classes
    if (el.__x_transition) {
        el.__x_transition.cancel && el.__x_transition.cancel()
    }

    const originalClasses = el.__x_original_classes || []

    const stages = {
        start() {
            el.classList.add(...classesStart)
        },
        during() {
            el.classList.add(...classesDuring)
        },
        show() {
            hook1()
        },
        end() {
            // Don't remove classes that were in the original class attribute.
            el.classList.remove(...classesStart.filter(i => !originalClasses.includes(i)))
            el.classList.add(...classesEnd)
        },
        hide() {
            hook2()
        },
        cleanup() {
            el.classList.remove(...classesDuring.filter(i => !originalClasses.includes(i)))
            el.classList.remove(...classesEnd.filter(i => !originalClasses.includes(i)))
        },
    }

    transition(el, stages, type, reject)
}

export function transition(el, stages, type, reject) {
    const finish = once(() => {
        stages.hide()

        // Adding an "isConnected" check, in case the callback
        // removed the element from the DOM.
        if (el.isConnected) {
            stages.cleanup()
        }

        delete el.__x_transition
    })

    el.__x_transition = {
        // Set transition type so we can avoid clearing transition if the direction is the same
       type: type,
        // create a callback for the last stages of the transition so we can call it
        // from different point and early terminate it. Once will ensure that function
        // is only called one time.
        cancel: once(() => {
            reject(TRANSITION_CANCELLED)

            finish()
        }),
        finish,
        // This store the next animation frame so we can cancel it
        nextFrame: null
    }

    stages.start()
    stages.during()

    el.__x_transition.nextFrame = requestAnimationFrame(() => {
        // Note: Safari's transitionDuration property will list out comma separated transition durations
        // for every single transition property. Let's grab the first one and call it a day.
        let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000

        if (duration === 0) {
            duration = Number(getComputedStyle(el).animationDuration.replace('s', '')) * 1000
        }

        stages.show()

        el.__x_transition.nextFrame = requestAnimationFrame(() => {
            stages.end()

            setTimeout(el.__x_transition.finish, duration)
        })
    });
}

export function isNumeric(subject){
    return ! Array.isArray(subject) && ! isNaN(subject)
}

// Thanks @vuejs
// https://github.com/vuejs/vue/blob/4de4649d9637262a9b007720b59f80ac72a5620c/src/shared/util.js
export function once(callback) {
    let called = false

    return function () {
        if (! called) {
            called = true
            callback.apply(this, arguments)
        }
    }
}
