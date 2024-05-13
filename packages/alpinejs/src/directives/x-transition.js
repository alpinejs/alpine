import { releaseNextTicks, holdNextTicks } from '../nextTick'
import { setClasses } from '../utils/classes'
import { setStyles } from '../utils/styles'
import { directive } from '../directives'
import { mutateDom } from '../mutation'
import { once } from '../utils/once'

directive('transition', (el, { value, modifiers, expression }, { evaluate }) => {
    if (typeof expression === 'function') expression = evaluate(expression)
    if (expression === false) return
    if (!expression || typeof expression === 'boolean') {
        registerTransitionsFromHelper(el, modifiers, value)
    } else {
        registerTransitionsFromClassString(el, expression, value)
    }
})

function registerTransitionsFromClassString(el, classString, stage) {
    registerTransitionObject(el, setClasses, '')

    let directiveStorageMap = {
        'enter': (classes) => { el._x_transition.enter.during = classes },
        'enter-start': (classes) => { el._x_transition.enter.start = classes },
        'enter-end': (classes) => { el._x_transition.enter.end = classes },
        'leave': (classes) => { el._x_transition.leave.during = classes },
        'leave-start': (classes) => { el._x_transition.leave.start = classes },
        'leave-end': (classes) => { el._x_transition.leave.end = classes },
    }

    directiveStorageMap[stage](classString)
}

function registerTransitionsFromHelper(el, modifiers, stage) {
    registerTransitionObject(el, setStyles)

    let doesntSpecify = (! modifiers.includes('in') && ! modifiers.includes('out')) && ! stage
    let transitioningIn = doesntSpecify || modifiers.includes('in') || ['enter'].includes(stage)
    let transitioningOut = doesntSpecify || modifiers.includes('out') || ['leave'].includes(stage)

    if (modifiers.includes('in') && ! doesntSpecify) {
        modifiers = modifiers.filter((i, index) => index < modifiers.indexOf('out'))
    }

    if (modifiers.includes('out') && ! doesntSpecify) {
        modifiers = modifiers.filter((i, index) => index > modifiers.indexOf('out'))
    }

    let wantsAll = ! modifiers.includes('opacity') && ! modifiers.includes('scale')
    let wantsOpacity = wantsAll || modifiers.includes('opacity')
    let wantsScale = wantsAll || modifiers.includes('scale')
    let opacityValue = wantsOpacity ? 0 : 1
    let scaleValue = wantsScale ? modifierValue(modifiers, 'scale', 95) / 100 : 1
    let delay = modifierValue(modifiers, 'delay', 0) / 1000
    let origin = modifierValue(modifiers, 'origin', 'center')
    let property = 'opacity, transform'
    let durationIn = modifierValue(modifiers, 'duration', 150) / 1000
    let durationOut = modifierValue(modifiers, 'duration', 75) / 1000
    let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`

    if (transitioningIn) {
        el._x_transition.enter.during = {
            transformOrigin: origin,
            transitionDelay: `${delay}s`,
            transitionProperty: property,
            transitionDuration: `${durationIn}s`,
            transitionTimingFunction: easing,
        }

        el._x_transition.enter.start = {
            opacity: opacityValue,
            transform: `scale(${scaleValue})`,
        }

        el._x_transition.enter.end = {
            opacity: 1,
            transform: `scale(1)`,
        }
    }

    if (transitioningOut) {
        el._x_transition.leave.during = {
            transformOrigin: origin,
            transitionDelay: `${delay}s`,
            transitionProperty: property,
            transitionDuration: `${durationOut}s`,
            transitionTimingFunction: easing,
        }

        el._x_transition.leave.start = {
            opacity: 1,
            transform: `scale(1)`,
        }

        el._x_transition.leave.end = {
            opacity: opacityValue,
            transform: `scale(${scaleValue})`,
        }
    }
}

function registerTransitionObject(el, setFunction, defaultValue = {}) {
    if (! el._x_transition) el._x_transition = {
        enter: { during: defaultValue, start: defaultValue, end: defaultValue },

        leave: { during: defaultValue, start: defaultValue, end: defaultValue },

        in(before = () => {}, after = () => {}) {
            transition(el, setFunction, {
                during: this.enter.during,
                start: this.enter.start,
                end: this.enter.end,
            }, before, after)
        },

        out(before = () => {}, after = () => {}) {
            transition(el, setFunction, {
                during: this.leave.during,
                start: this.leave.start,
                end: this.leave.end,
            }, before, after)
        },
    }
}

window.Element.prototype._x_toggleAndCascadeWithTransitions = function (el, value, show, hide) {
    // We are running this function after one tick to prevent
    // a race condition from happening where elements that have a
    // @click.away always view themselves as shown on the page.
    // If the tab is active, we prioritise requestAnimationFrame which plays
    // nicely with nested animations otherwise we use setTimeout to make sure
    // it keeps running in background. setTimeout has a lower priority in the
    // event loop so it would skip nested transitions but when the tab is
    // hidden, it's not relevant.
    const nextTick = document.visibilityState === 'visible' ? requestAnimationFrame : setTimeout;
    let clickAwayCompatibleShow = () => nextTick(show);

    if (value) {
        if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
            // This fixes a bug where if you are only transitioning OUT and you are also using @click.outside
            // the element when shown immediately starts transitioning out. There is a test in the manual
            // transition test file for this: /tests/cypress/manual-transition-test.html
            (el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length))
                ? el._x_transition.in(show)
                : clickAwayCompatibleShow()
        } else {
            el._x_transition
                ? el._x_transition.in(show)
                : clickAwayCompatibleShow()
        }

        return
    }

    // Livewire depends on el._x_hidePromise.
    el._x_hidePromise = el._x_transition
        ? new Promise((resolve, reject) => {
            el._x_transition.out(() => {}, () => resolve(hide))

            el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }))
        })
        : Promise.resolve(hide)

    queueMicrotask(() => {
        let closest = closestHide(el)

        if (closest) {
            if (! closest._x_hideChildren) closest._x_hideChildren = []

            closest._x_hideChildren.push(el)
        } else {
            nextTick(() => {
                let hideAfterChildren = el => {
                    let carry = Promise.all([
                        el._x_hidePromise,
                        ...(el._x_hideChildren || []).map(hideAfterChildren),
                    ]).then(([i]) => i?.())

                    delete el._x_hidePromise
                    delete el._x_hideChildren

                    return carry
                }

                hideAfterChildren(el).catch((e) => {
                    if (! e.isFromCancelledTransition) throw e
                })
            })
        }
    })
}

function closestHide(el) {
    let parent = el.parentNode

    if (! parent) return

    return parent._x_hidePromise ? parent : closestHide(parent)
}

export function transition(el, setFunction, { during, start, end } = {}, before = () => {}, after = () => {}) {
    if (el._x_transitioning) el._x_transitioning.cancel()

    if (Object.keys(during).length === 0 && Object.keys(start).length === 0 && Object.keys(end).length === 0) {
        // Execute right away if there is no transition.
        before(); after()
        return
    }

    let undoStart, undoDuring, undoEnd

    performTransition(el, {
        start() {
            undoStart = setFunction(el, start)
        },
        during() {
            undoDuring = setFunction(el, during)
        },
        before,
        end() {
            undoStart()

            undoEnd = setFunction(el, end)
        },
        after,
        cleanup() {
            undoDuring()
            undoEnd()
        },
    })
}

export function performTransition(el, stages) {
    // All transitions need to be truly "cancellable". Meaning we need to
    // account for interruptions at ALL stages of the transitions and
    // immediately run the rest of the transition.
    let interrupted, reachedBefore, reachedEnd

    let finish = once(() => {
        mutateDom(() => {
            interrupted = true

            if (! reachedBefore) stages.before()

            if (! reachedEnd) {
                stages.end()

                releaseNextTicks()
            }

            stages.after()

            // Adding an "isConnected" check, in case the callback removed the element from the DOM.
            if (el.isConnected) stages.cleanup()

            delete el._x_transitioning
        })
    })

    el._x_transitioning = {
        beforeCancels: [],
        beforeCancel(callback) { this.beforeCancels.push(callback) },
        cancel: once(function () { while (this.beforeCancels.length) { this.beforeCancels.shift()() }; finish(); }),
        finish,
    }

    mutateDom(() => {
        stages.start()
        stages.during()
    })

    holdNextTicks()

    requestAnimationFrame(() => {
        if (interrupted) return

        // Note: Safari's transitionDuration property will list out comma separated transition durations
        // for every single transition property. Let's grab the first one and call it a day.
        let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000
        let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, '').replace('s', '')) * 1000

        if (duration === 0) duration = Number(getComputedStyle(el).animationDuration.replace('s', '')) * 1000

        mutateDom(() => {
            stages.before()
        })

        reachedBefore = true

        requestAnimationFrame(() => {
            if (interrupted) return

            mutateDom(() => {
                stages.end()
            })

            releaseNextTicks()

            setTimeout(el._x_transitioning.finish, duration + delay)

            reachedEnd = true
        })
    })
}

export function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback

    // If it IS present, grab the value after it: x-show.transition.duration.500ms
    const rawValue = modifiers[modifiers.indexOf(key) + 1]

    if (! rawValue) return fallback

    if (key === 'scale') {
        // Check if the very next value is NOT a number and return the fallback.
        // If x-show.transition.scale, we'll use the default scale value.
        // That is how a user opts out of the opacity transition.
        if (isNaN(rawValue)) return fallback
    }

    if (key === 'duration' || key === 'delay') {
        // Support x-transition.duration.500ms && duration.500
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
