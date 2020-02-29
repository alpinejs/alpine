/**
 * @return {void}
 */
const __noop = () => { }

/**
 * @param {string} content
 * @return {boolean}
 */
const isNotEmptyString = content => content !== ''

/**
 * @param {any} subject
 * @return {boolean}
 */
const isNumeric = subject => !isNaN(subject)

/**
 * Thanks @stimulus:
 * @see https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
 * @return {Promise<any>}
 * @async
 */
export function domReady() {
    return new Promise(resolve =>
        document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", resolve) : resolve()
    )
}

/**
 * @param {any[]} array
 * @return {any[]}
 */
export function arrayUnique(array) {
    return Array.isArray(array) ? [...new Set(array)] : [];
}

/**
 * @return {boolean}
 */
export function isTesting() {
    return /(?:(jsdom|Node\.js))/.test(navigator.userAgent)
}

export function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase()
}

export function walk(el, callback) {
    if (callback(el) === false) {
        return
    }

    let node = el.firstElementChild

    while (node) {
        walk(node, callback)

        node = node.nextElementSibling
    }
}

/**
 *
 * @param {function} func
 * @param {number} wait
 * @return {() => Promise<any>}
 * @async
 */
export function debounce(func, wait) {
    let timer

    return (...args) => {
        if (timer) {
            clearTimeout(timer)
        }

        return new Promise(resolve => (timer = setTimeout(() => resolve(func(args)), wait)))
    }
}

export function saferEval(expression, dataContext, additionalHelperVariables = {}) {
    return (
        new Function(
            ['$data', ...Object.keys(additionalHelperVariables)].toString(),
            `var result; with($data) { result = ${expression} }; return result`
        )
    )(dataContext, ...Object.values(additionalHelperVariables))
}

export function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
    return (
        new Function(
            ['dataContext', ...Object.keys(additionalHelperVariables)].toString(),
            `with(dataContext) { ${expression} }`
        )
    )(dataContext, ...Object.values(additionalHelperVariables))
}

export function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name)

    return /x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/.test(name)
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
        // If no type is passed in for filtering, bypass filter
        .filter(i => !type ? true : i.type === type)
}

/**
 * @param {string} name
 * @return {string}
 */
export function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
        return name.replace('@', 'x-on:')
    }

    if (name.startsWith(':')) {
        return name.replace(':', 'x-bind:')
    }

    return name
}

export function transitionIn(el, show, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) {
        return show()
    }

    const attrs = getXAttrs(el, 'transition')
    const showAttr = getXAttrs(el, 'show')[0]

    // If this is triggered by a x-show.transition.
    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers
        const _hasIn = modifiers.includes('in')
        const _hasOut = modifiers.includes('out')

        // If x-show.transition.out, we'll skip the "in" transition.
        if (_hasOut && !_hasIn) {
            return show()
        }

        const settingBothSidesOfTransition = _hasIn && _hasOut

        // If x-show.transition.in...out... only use "in" related modifiers for this transition.
        modifiers = settingBothSidesOfTransition ? modifiers.filter((_, i) => i < modifiers.indexOf('out')) : modifiers

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
    if (forceSkip) {
        return hide()
    }

    const attrs = getXAttrs(el, 'transition')
    const showAttr = getXAttrs(el, 'show')[0]

    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers
        const _hasIn = modifiers.includes('in')
        const _hasOut = modifiers.includes('out')

        if (_hasIn && !_hasOut) {
            return hide()
        }

        const settingBothSidesOfTransition = _hasIn && _hasOut

        modifiers = settingBothSidesOfTransition ? modifiers.filter((_, i) => i > modifiers.indexOf('out')) : modifiers

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

    transitionHelper(el, modifiers, showCallback, __noop, styleValues)
}

export function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback) {
    // Make the "out" transition .5x slower than the "in". (Visually better)
    // HOWEVER, if they explicitly set a duration for the "out" transition,
    // use that.
    const duration = settingBothSidesOfTransition
        ? modifierValue(modifiers, 'duration', 150)
        : modifierValue(modifiers, 'duration', 150) * 0.5

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

    transitionHelper(el, modifiers, __noop, hideCallback, styleValues)
}

function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) {
        return fallback
    }

    // If it IS present, grab the value after it: x-show.transition.duration.500ms
    const rawValue = modifiers[modifiers.indexOf(key) + 1]

    if (!rawValue) {
        return fallback
    }

    if (key === 'scale') {
        // Check if the very next value is NOT a number and return the fallback.
        // If x-show.transition.scale, we'll use the default scale value.
        // That is how a user opts out of the opacity transition.
        if (!isNumeric(rawValue)) {
            return fallback
        }
    }

    if (key === 'duration') {
        // Support x-show.transition.duration.500ms && duration.500
        let match = rawValue.match(/([0-9]+)ms/)

        if (match) {
            return match[1]
        }
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
    const {
        opacity: opacityCache,
        transform: transformCache,
        transformOrigin: transformOriginCache,
    } = el.style

    // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.
    const noModifiers = !modifiers.includes('opacity') && !modifiers.includes('scale')
    const transitionOpacity = noModifiers || modifiers.includes('opacity')
    const transitionScale = noModifiers || modifiers.includes('scale')

    // These are the explicit stages of a transition (same stages for in and for out).
    // This way you can get a birds eye view of the hooks, and the differences
    // between them.
    const stages = {
        start() {
            if (transitionOpacity) {
                el.style.opacity = styleValues.first.opacity
            }

            if (transitionScale) {
                el.style.transform = `scale(${styleValues.first.scale * 0.01})`
            }
        },
        during() {
            if (transitionScale) {
                el.style.transformOrigin = styleValues.origin
            }

            el.style.transitionProperty = [
                transitionOpacity ? 'opacity' : '',
                transitionScale ? 'transform' : '',
            ].join(' ').trim()
            el.style.transitionDuration = `${styleValues.duration * 0.001}s`
            el.style.transitionTimingFunction = `cubic-bezier(0.4, 0.0, 0.2, 1)`
        },
        show() {
            hook1()
        },
        end() {
            if (transitionOpacity) {
                el.style.opacity = styleValues.second.opacity
            }

            if (transitionScale) {
                el.style.transform = `scale(${styleValues.second.scale * 0.01})`
            }
        },
        hide() {
            hook2()
        },
        cleanup() {
            if (transitionOpacity) {
                el.style.opacity = opacityCache
            }

            if (transitionScale) {
                el.style.transform = transformCache
            }

            if (transitionScale) {
                el.style.transformOrigin = transformOriginCache
            }

            el.style.transitionProperty = null
            el.style.transitionDuration = null
            el.style.transitionTimingFunction = null
        },
    }

    transition(el, stages)
}

export function transitionClassesIn(el, directives, showCallback) {
    const _filterEmptyExpression = ({ expression }) => expression && expression.split(' ').filter(isNotEmptyString)
    const _defaultExpression = Object.create(null, { expression: { value: '' } })

    let enter = directives.find(({ value }) => value && value === 'enter')
    let enterStart = directives.find(({ value }) => value && value === 'enter-start')
    let enterEnd = directives.find(({ value }) => value && value === 'enter-end')

    enter = enter ? _filterEmptyExpression(enter) : _defaultExpression
    enterStart = enterStart ? _filterEmptyExpression(enterStart) : _defaultExpression
    enterEnd = enterEnd ? _filterEmptyExpression(enterEnd) : _defaultExpression

    transitionClasses(el, enter, enterStart, enterEnd, showCallback, __noop)
}

export function transitionClassesOut(el, directives, hideCallback) {
    const _filterEmptyExpression = ({ expression }) => expression && expression.split(' ').filter(isNotEmptyString)
    const _defaultExpression = Object.create(null, { expression: { value: '' } })

    let leave = directives.find(({ value }) => value && value === 'leave')
    let leaveStart = directives.find(({ value }) => value && value === 'leave-start')
    let leaveEnd = directives.find(({ value }) => value && value === 'leave-end')

    leave = leave ? _filterEmptyExpression(leave) : _defaultExpression
    leaveStart = leaveStart ? _filterEmptyExpression(leaveStart) : _defaultExpression
    leaveEnd = leaveEnd ? _filterEmptyExpression(leaveEnd) : _defaultExpression

    transitionClasses(el, leave, leaveStart, leaveEnd, __noop, hideCallback)
}

export function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2) {
    const originalClasses = el.__x_original_classes || []
    const _notIncludesClass = (className) => !originalClasses.includes(className)

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
            el.classList.remove(...classesStart.filter(_notIncludesClass))
            el.classList.add(...classesEnd)
        },
        hide() {
            hook2()
        },
        cleanup() {
            el.classList.remove(...classesDuring.filter(_notIncludesClass))
            el.classList.remove(...classesEnd.filter(_notIncludesClass))
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

/**
 * @param {any} target
 * @param {ProxyHandler} proxyHandler
 * @return {any}
 */
export function deepProxy(target, proxyHandler) {
    // If target is null.
    if (target === null) {
        return target;
    }

    // If target is not an object.
    if (typeof target !== 'object') {
        return target;
    }

    // If target is a DOM node (like in the case of this.$el).
    if (target instanceof Node) {
        return target
    }

    // If target is already an Alpine proxy.
    if (target['$isAlpineProxy'] !== undefined) {
        return target;
    }

    // Otherwise proxy the properties recursively.
    // This enables reactivity on setting nested data.
    // Note that if a project is not a valid object, it won't be converted to a proxy
    for (let property in target) {
        target[property] = deepProxy(target[property], proxyHandler)
    }

    return new Proxy(target, proxyHandler)
}
