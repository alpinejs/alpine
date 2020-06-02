import { showElement, hideElement, getXAttrs, isNumeric, once } from './utils'

export function transitionIn(el, component, resolve = () => showElement(el), forceSkip = false) {
    transition(el, component, resolve, forceSkip)
}

export function transitionOut(el, component, resolve = () => hideElement(el), forceSkip = false) {
    transition(el, component, resolve, forceSkip, false)
}

function transition(el, component, resolve, forceSkip, display = true) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return resolve()

    const attrs = getXAttrs(el, component, 'transition')
    const showAttr = getXAttrs(el, component, 'show')[0]

    let transition = display ? 'enter' : 'leave'

    // Check if this is a transition with inline styles
    if (showAttr && showAttr.modifiers.includes('transition')) {
        let modifiers = showAttr.modifiers

        transition = {
            in: modifiers.includes('in'),
            out: modifiers.includes('out')
        }

        // When showing skip the transition in if only transition out defined
        if (display && (transition.out && ! transition.in)) return showElement(el)

        // When hiding skip the transiton out if only transition in defined
        if (! display && (transition.in && ! transition.out)) return hideElement(el)

        // Get related modifiers for this transition
        modifiers = (transition.in && transition.out)
            ? modifiers.filter((i, index) =>
                display
                    ? index < modifiers.indexOf('out')
                    : index > modifiers.indexOf('out'))
            : modifiers

        transitionWithInlineStyles(el, resolve, modifiers, transition, display)

        // Check if this is a transition with css classes
    } else if (attrs.filter(attr => attr.value.includes(transition)).length > 0) {

        transitionWithCssClasses(el, component, resolve, attrs, transition, display)

        // Check if neither, just resolve that damn thing
    } else {
        resolve(el)
    }
}

function transitionWithInlineStyles(el, resolve, modifiers, transition, display) {
    // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.
    const noModifiers = ! modifiers.includes('opacity') && ! modifiers.includes('scale')
    const transitionOpacity = noModifiers || modifiers.includes('opacity')
    const transitionScale = noModifiers || modifiers.includes('scale')

    // If the user set these style values, we'll put them back when we're done with them.
    const opacityCache = el.style.opacity
    const transformCache = el.style.transform
    const transformOriginCache = el.style.transformOrigin

    // Default values inspired by: https://material.io/design/motion/speed.html#duration
    const styleValues = {
        duration: display || (transition.in && transition.out)
            ? modifierValue(modifiers, 'duration', 150)
            : modifierValue(modifiers, 'duration', 150) / 2,
        origin: modifierValue(modifiers, 'origin', 'center'),
        first: {
            opacity: display ? 0 : 1,
            scale: display ? modifierValue(modifiers, 'scale', 95) : 100,
        },
        second: {
            opacity: display ? 1 : 0,
            scale: display ? 100 : modifierValue(modifiers, 'scale', 95),
        },
    }

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
            // Resolve if showing
            if (display) resolve()
        },
        end() {
            if (transitionOpacity) el.style.opacity = styleValues.second.opacity
            if (transitionScale) el.style.transform = `scale(${styleValues.second.scale / 100})`
        },
        hide() {
            // Resolve if hiding
            if (! display) resolve()
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
    // Render transition with inline styles
    renderStages(el, stages)
}

function transitionWithCssClasses(el, component, resolve, attrs, transition, display) {
    const originalClasses = el.__x_original_classes || []

    let ensureStringExpression = (expression) => {
        return typeof expression === 'function'
            ? component.evaluateReturnExpression(el, expression)
            : expression
    }

    // Prepare stage group names for given directions
    let cssClasses = {
        durring: transition,
        start: `${transition}-start`,
        end: `${transition}-end`,
    }

    // Asigning stage groups to css classes
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
            // Resolve if showing
            if (display) resolve()
        },
        end() {
            // Don't remove classes that were in the original class attribute.
            el.classList.remove(...cssClasses.start.filter(i => ! originalClasses.includes(i)))
            el.classList.add(...cssClasses.end)
        },
        hide() {
            // Resolve if hiding
            if (! display) resolve()
        },
        cleanup() {
            el.classList.remove(...cssClasses.durring.filter(i => ! originalClasses.includes(i)))
            el.classList.remove(...cssClasses.end.filter(i => ! originalClasses.includes(i)))
        },
    }

    // Render transition with css classes
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

            // Asign current transition to el in case we need to force it
            el.__x_transition_remaining =() => {

                stages.hide()

                // Adding an "isConnected" check, in case the callback
                // removed the element from the DOM.
                if (el.isConnected) {
                    stages.cleanup()
                }

                // Safe to remove transition from el since it is completed
                delete el.__x_transition_remaining
                if(el.__x_transition_timer){
                    clearTimeout(el.__x_transition_timer)
                }
            }

            el.__x_transition_timer = setTimeout(() => {
                // We only want to run remaining transitions in the end if they exists
                if (el.__x_transition_remaining) {
                    el.__x_transition_remaining()
                }
            }, duration);
        })
    })
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
