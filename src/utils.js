
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

export function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase()
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

export function saferEval(expression, dataContext, additionalHelperVariables = {}) {
    return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `var result; with($data) { result = ${expression} }; return result`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
    // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
    // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.
    if (Object.keys(dataContext).includes(expression)) {
        let methodReference = (new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { return ${expression} }`))(
            dataContext, ...Object.values(additionalHelperVariables)
        )

        if (typeof methodReference === 'function') {
            return methodReference.call(dataContext, additionalHelperVariables['$event'])
        }
    }

    return (new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)\b/

export function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name)
    return xAttrRE.test(name)
}

export function getXAttrs(el, type) {
    return Array.from(el.attributes)
        .filter(isXAttr)
        .map(attr => {
            const name = replaceAtAndColonWithStandardSyntax(attr.name)

            const typeMatch = name.match(xAttrRE)
            const valueMatch = name.match(/:([a-zA-Z\-:]+)/)
            const modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || []

            return {
                type: typeMatch ? typeMatch[1] : null,
                value: valueMatch ? valueMatch[1] : null,
                modifiers: modifiers.map(i => i.replace('.', '')),
                expression: attr.value,
            }
        })
        .filter(i => {
            // If no type is passed in for filtering, bypass filter
            if (! type) return true

            return i.type === type
        })
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

export function transitionIn(el, show, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return show()

    const attrs = getXAttrs(el, 'transition')
    const showAttr = getXAttrs(el, 'show')[0]

    // If this is triggered by a x-show.transition.
    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers

        // If x-show.transition.out, we'll skip the "in" transition.
        if (modifiers.includes('out') && ! modifiers.includes('in')) return show()

        const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out')

        // If x-show.transition.in...out... only use "in" related modifiers for this transition.
        modifiers = settingBothSidesOfTransition
            ? modifiers.filter((i, index) => index < modifiers.indexOf('out')) : modifiers

        transitionHelperIn(el, modifiers, show)
    // Otherwise, we can assume x-transition:enter.
    } else if (attrs.length > 0) {
        transitionClassesIn(el, attrs, show)
    } else {
    // If neither, just show that damn thing.
        show()
    }
}

export function transitionOut(el, hide, forceSkip = false) {
    if (forceSkip) return hide()

    const attrs = getXAttrs(el, 'transition')
    const showAttr = getXAttrs(el, 'show')[0]

    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers

        if (modifiers.includes('in') && ! modifiers.includes('out')) return hide()

        const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out')

        modifiers = settingBothSidesOfTransition
            ? modifiers.filter((i, index) => index > modifiers.indexOf('out')) : modifiers

        transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide)
    } else if (attrs.length > 0) {
        transitionClassesOut(el, attrs, hide)
    } else {
        hide()
    }
}

export function transitionHelperIn(el, modifiers, showCallback) {
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

    transitionHelper(el, modifiers, showCallback, () => {}, styleValues)
}

export function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback) {
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

    transitionHelper(el, modifiers, () => {}, hideCallback, styleValues)
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

export function transitionHelper(el, modifiers, hook1, hook2, styleValues) {
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

    transition(el, stages)
}

export function transitionClassesIn(el, directives, showCallback) {
    const enter = (directives.find(i => i.value === 'enter') || { expression: '' }).expression.split(' ').filter(i => i !== '')
    const enterStart = (directives.find(i => i.value === 'enter-start') || { expression: '' }).expression.split(' ').filter(i => i !== '')
    const enterEnd = (directives.find(i => i.value === 'enter-end') || { expression: '' }).expression.split(' ').filter(i => i !== '')

    transitionClasses(el, enter, enterStart, enterEnd, showCallback, () => {})
}

export function transitionClassesOut(el, directives, hideCallback) {
    const leave = (directives.find(i => i.value === 'leave') || { expression: '' }).expression.split(' ').filter(i => i !== '')
    const leaveStart = (directives.find(i => i.value === 'leave-start') || { expression: '' }).expression.split(' ').filter(i => i !== '')
    const leaveEnd = (directives.find(i => i.value === 'leave-end') || { expression: '' }).expression.split(' ').filter(i => i !== '')

    transitionClasses(el, leave, leaveStart, leaveEnd, () => {}, hideCallback)
}

export function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2) {
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

    transition(el, stages)
}

export function transition(el, stages) {
    stages.start()
    stages.during()

    requestAnimationFrame(() => {
        // Note: Safari's transitionDuration property will list out comma separated transition durations
        // for every single transition property. Let's grab the first one and call it a day.
        let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000

        stages.show()

        requestAnimationFrame(() => {
            stages.end()

            setTimeout(() => {
                stages.hide()

                // Adding an "isConnected" check, in case the callback
                // removed the element from the DOM.
                if (el.isConnected) {
                    stages.cleanup()
                }
            }, duration);
        })
    });
}

export function isNumeric(subject){
    return ! isNaN(subject)
}
