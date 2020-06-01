import { showElement, hideElement, getXAttrs, isNumeric } from './utils'

export function transitionIn(el, component, forceSkip = false, resolve = () => showElement(el)) {
    el.__x_showing = true
    transition(el, component, resolve, forceSkip)
}

export function transitionOut(el, component, forceSkip = false, resolve = () => hideElement(el)) {
    el.__x_showing = false
    transition(el, component, resolve, forceSkip)
}

function transition(el, component, resolve, forceSkip) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return resolve()

    const attrs = getXAttrs(el, component, 'transition')
    const showAttr = getXAttrs(el, component, 'show')[0]

    let transitionDirection = el.__x_showing ? 'enter' : 'leave'

    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers

        transitionDirection = {
            in: modifiers.includes('in'),
            out: modifiers.includes('out')
        }

        if (el.__x_showing && (transitionDirection.out && !transitionDirection.in)) return showElement(el)

        if (!el.__x_showing && (transitionDirection.in && !transitionDirection.out)) return hideElement(el)

        modifiers = (transitionDirection.in && transitionDirection.out)
            ? modifiers.filter((i, index) =>
                el.__x_showing
                    ? index < modifiers.indexOf('out')
                    : index > modifiers.indexOf('out'))
            : modifiers

        transitionWithCss(el, resolve, modifiers, transitionDirection)

    } else if (attrs.filter(attr => attr.value.includes(transitionDirection)).length > 0) {
        transitionWithClasses(el, component, resolve, attrs, transitionDirection)
    } else {
        resolve(el)
    }
}

function transitionWithCss(el, resolve, modifiers, transitionDirection) {

    const noModifiers = !modifiers.includes('opacity') && !modifiers.includes('scale')
    const transitionOpacity = noModifiers || modifiers.includes('opacity')
    const transitionScale = noModifiers || modifiers.includes('scale')

    // If the user set these style values, we'll put them back when we're done with them.
    const opacityCache = el.style.opacity
    const transformCache = el.style.transform
    const transformOriginCache = el.style.transformOrigin

    const styleValues = {
        duration: el.__x_showing || (transitionDirection.in && transitionDirection.out)
            ? modifierValue(modifiers, 'duration', 150)
            : modifierValue(modifiers, 'duration', 150) / 2,
        origin: modifierValue(modifiers, 'origin', 'center'),
        first: {
            opacity: el.__x_showing ? 0 : 1,
            scale: el.__x_showing ? modifierValue(modifiers, 'scale', 95) : 100,
        },
        second: {
            opacity: el.__x_showing ? 1 : 0,
            scale: el.__x_showing ? 100 : modifierValue(modifiers, 'scale', 95),
        },
    }

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
            if (el.__x_showing) resolve()
        },
        end() {
            if (transitionOpacity) el.style.opacity = styleValues.second.opacity
            if (transitionScale) el.style.transform = `scale(${styleValues.second.scale / 100})`
        },
        hide() {
            if (!el.__x_showing) resolve()
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
    renderStages(el, stages)
}

function transitionWithClasses(el, component, resolve, attrs, transitionDirection) {
    const originalClasses = el.__x_original_classes || []

    let ensureStringExpression = (expression) => {
        return typeof expression === 'function'
            ? component.evaluateReturnExpression(el, expression)
            : expression
    }

    let cssClasses = {
        durring: transitionDirection,
        start: `${transitionDirection}-start`,
        end: `${transitionDirection}-end`,
    }

    Object.entries(cssClasses).map(([name, value]) => {
        cssClasses[name] = ensureStringExpression((attrs.find(attr => attr.value === value) || { expression: '' }).expression)
            .split(' ').filter(i => i !== '')
    })

    const stages = {
        start() {
            el.classList.add(...cssClasses.start)
        },
        during() {
            el.classList.add(...cssClasses.durring)
        },
        show() {
            if (el.__x_showing) resolve()
        },
        end() {
            // Don't remove classes that were in the original class attribute.
            el.classList.remove(...cssClasses.start.filter(i => !originalClasses.includes(i)))
            el.classList.add(...cssClasses.end)
        },
        hide() {
            if (!el.__x_showing) resolve()
        },
        cleanup() {
            el.classList.remove(...cssClasses.durring.filter(i => !originalClasses.includes(i)))
            el.classList.remove(...cssClasses.end.filter(i => !originalClasses.includes(i)))
        },
    }

    renderStages(el, stages)
}

function renderStages(el, stages) {
    stages.start()
    stages.during()

    requestAnimationFrame(() => {
        // Note: Safari's transitionDuration property will list out comma separated transition durations
        // for every single transition property. Let's grab the first one and call it a day.
        let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000

        if (duration === 0) {
            duration = Number(getComputedStyle(el).animationDuration.replace('s', '')) * 1000
        }

        stages.show()

        requestAnimationFrame(() => {
            stages.end()

            setTimeout(() => {
                stages.hide()

                // Adding an "isConnected" check, in case the resolve
                // removed the element from the DOM.
                if (el.isConnected) {
                    stages.cleanup()
                }
                el.__x_showing = undefined
            }, duration)
        })
    })
}

function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback

    // If it IS present, grab the value after it: x-show.transition.duration.500ms
    const rawValue = modifiers[modifiers.indexOf(key) + 1]

    if (!rawValue) return fallback

    if (key === 'scale') {
        // Check if the very next value is NOT a number and return the fallback.
        // If x-show.transition.scale, we'll use the default scale value.
        // That is how a user opts out of the opacity transition.
        if (!isNumeric(rawValue)) return fallback
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