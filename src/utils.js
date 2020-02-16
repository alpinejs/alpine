
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
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
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
    return (new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name)

    const xAttrRE = /x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/

    return xAttrRE.test(name)
}

export function getXAttrs(el, type) {
    return Array.from(el.attributes)
        .filter(isXAttr)
        .map(attr => {
            const name = replaceAtAndColonWithStandardSyntax(attr.name)

            const typeMatch = name.match(/x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/)
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

export function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
        return name.replace('@', 'x-on:')
    } else if (name.startsWith(':')) {
        return name.replace(':', 'x-bind:')
    }

    return name
}

export function transitionIn(el, show, forceSkip = false) {
    if (forceSkip) return show()

    const attrs = getXAttrs(el, 'transition')
    const showAttr = getXAttrs(el, 'show')[0]

    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers

        if (modifiers.includes('out') && ! modifiers.includes('in')) return show()

        const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out')

        modifiers = settingBothSidesOfTransition
            ? modifiers.filter((i, index) => index < modifiers.indexOf('out')) : modifiers

        transitionHelperIn(el, modifiers, show)
    } else if (attrs.length > 0) {
        transitionClassesIn(el, attrs, show)
    } else {
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
    // Default values taken from: https://material.io/design/motion/speed.html#duration
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
    if (modifiers.indexOf(key) === -1) return fallback

    const rawValue = modifiers[modifiers.indexOf(key) + 1]

    if (key === 'scale') {
        // Check if the very next value is NOT a number and return the fallback.
        if (! isNumeric(rawValue)) return fallback
    }

    if (! rawValue) return fallback

    if (key === 'duration') {
        let match = rawValue.match(/([0-9]+)ms/)
        if (match) return match[1]
    }

    if (key === 'origin') {
        if (['top', 'right', 'left', 'center', 'bottom'].includes(modifiers[modifiers.indexOf(key) + 2])) {
            return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(' ')
        }
    }

    return rawValue
}

export function transitionHelper(el, modifiers, hook1, hook2, styleValues) {
    const opacityCache = el.style.opacity
    const transformCache = el.style.transform
    const transformOriginCache = el.style.transformOrigin
    const noModifiers = ! modifiers.includes('opacity') && ! modifiers.includes('scale')
    const transitionOpacity = noModifiers || modifiers.includes('opacity')
    const transitionScale = noModifiers || modifiers.includes('scale')

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
        const duration = Number(getComputedStyle(el).transitionDuration.replace('s', '')) * 1000

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

export function deepProxy(target, proxyHandler) {
    // If target is null, return it.
    if (target === null) return target;

    // If target is not an object, return it.
    if (typeof target !== 'object') return target;

    // If target is a DOM node (like in the case of this.$el), return it.
    if (target instanceof Node) return target

    // If target is already an Alpine proxy, return it.
    if (target['$isAlpineProxy']) return target;

    // Otherwise proxy the properties recursively.
    // This enables reactivity on setting nested data.
    // Note that if a project is not a valid object, it won't be converted to a proxy
    for (let property in target) {
        target[property] = deepProxy(target[property], proxyHandler)
    }

    return new Proxy(target, proxyHandler)
}

function isNumeric(subject){
    return ! isNaN(subject)
}
