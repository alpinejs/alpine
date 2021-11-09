export default function (Alpine) {
    Alpine.directive('collapse', (el, { expression, modifiers }, { effect, evaluateLater }) => {
        let duration = modifierValue(modifiers, 'duration', 250) / 1000
        let floor = 0

        if (! el._x_isShown) el.style.height = `${floor}px`
        if (! el._x_isShown) el.style.removeProperty('display')
        if (! el._x_isShown) el.style.overflow = 'hidden'

        // Override the setStyles function with one that won't
        // revert updates to the height style.
        let setFunction = (el, styles) => {
            let revertFunction = Alpine.setStyles(el, styles);

           return styles.height ? () => {} : revertFunction
        }

        let transitionStyles = {
            overflow: 'hidden',
            transitionProperty: 'height',
            transitionDuration: `${duration}s`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        el._x_transition = {
            in(before = () => {}, after = () => {}) {
                let current = el.getBoundingClientRect().height

                Alpine.setStyles(el, {
                    height: 'auto',
                })

                let full = el.getBoundingClientRect().height

                Alpine.setStyles(el, {
                    overflow: null
                })

                if (current === full) { current = floor }

                Alpine.transition(el, Alpine.setStyles, {
                    during: transitionStyles,
                    start: { height: current+'px' },
                    end: { height: full+'px' },
                }, () => el._x_isShown = true, () => {})
            },

            out(before = () => {}, after = () => {}) {
                let full = el.getBoundingClientRect().height

                Alpine.transition(el, setFunction, {
                    during: transitionStyles,
                    start: { height: full+'px' },
                    end: { height: floor+'px' },
                }, () => {}, () => {
                    el._x_isShown = false

                    // check if element is fully collapsed
                    if (el.style.height == `${floor}px`) {
                        Alpine.nextTick(() => Alpine.setStyles(el, {
                            overflow: 'hidden'
                        }))
                    }
                })
            },
        }
    })
}

function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback

    // If it IS present, grab the value after it: x-show.transition.duration.500ms
    const rawValue = modifiers[modifiers.indexOf(key) + 1]

    if (! rawValue) return fallback

    if (key === 'duration') {
        // Support x-collapse.duration.500ms && duration.500
        let match = rawValue.match(/([0-9]+)ms/)
        if (match) return match[1]
    }

    return rawValue
}
