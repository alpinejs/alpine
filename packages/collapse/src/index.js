export default function (Alpine) {
    Alpine.directive('collapse', collapse)

    // If we're using a "minimum height", we'll need to disable
    // x-show's default behavior of setting display: 'none'.
    collapse.inline = (el, { modifiers }) => {
        let overflow = modifiers.includes('overflow') ? true : false
        if (! modifiers.includes('min')) return

        el._x_doShow = () => {}
        el._x_doHide = () => {}
        if (overflow) {
            el.style.overflow = 'clip'
        }
    }

    function collapse(el, { modifiers }) {
        let duration = modifierValue(modifiers, 'duration', 250) / 1000
        let floor = modifierValue(modifiers, 'min', 0)
        let fullyHide = ! modifiers.includes('min')
        // default direction is `vertical`
        let direction = modifiers.includes('horizontal') ? 'horizontal' : 'vertical'
        let overflow = modifiers.includes('overflow') ? true : false

        if (! el._x_isShown) el.style.height = `${floor}px`
        if (! el._x_isShown) el.style.width = `${floor}px`
        // We use the hidden attribute for the benefit of Tailwind
        // users as the .space utility will ignore [hidden] elements.
        // We also use display:none as the hidden attribute has very
        // low CSS specificity and could be accidentally overridden
        // by a user.
        if (! el._x_isShown && fullyHide) el.hidden = true
        if (! el._x_isShown) el.style.overflow = 'clip'

        // Override the setStyles function with one that won't
        // revert updates to the height style.
        let setFunction = (el, styles) => {
            let revertFunction = Alpine.setStyles(el, styles);

            if (direction === 'vertical') {
                return styles.height ? () => {} : revertFunction
            } else {
                return styles.width ? () => {} : revertFunction
            }
        }

        let transitionStyles = {
            transitionProperty: 'width, height',
            transitionDuration: `${duration}s`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        el._x_transition = {
            in(before = () => {}, after = () => {}) {
                if (fullyHide) el.hidden = false;
                if (fullyHide) el.style.display = null

                let current, full
                if (direction === 'vertical') {
                    current = el.getBoundingClientRect().height
                    el.style.height = 'auto'
                    full = el.getBoundingClientRect().height
                } else {
                    current = el.getBoundingClientRect().width
                    el.style.width = 'auto'
                    full = el.getBoundingClientRect().width
                }

                if (current === full) { current = floor }

                Alpine.transition(el, Alpine.setStyles, {
                    during: transitionStyles,
                    start: direction === 'vertical' ? { height: current+'px' } : { width: current+'px' },
                    end: direction === 'vertical' ? { height: full+'px' } : { width: full+'px' },
                }, () => el._x_isShown = true, () => {
                    if (Math.round(el.getBoundingClientRect().height) == Math.round(full) || 
                        Math.round(el.getBoundingClientRect().width) == Math.round(full)) {
                        if (!overflow) {
                            el.style.overflow = null
                        }
                    }
                })
            },

            out(before = () => {}, after = () => {}) {
                let full = direction === 'vertical' ? el.getBoundingClientRect().height : el.getBoundingClientRect().width

                Alpine.transition(el, setFunction, {
                    during: transitionStyles,
                    start: direction === 'vertical' ? { height: full+'px' } : { width: full+'px' },
                    end: direction === 'vertical' ? { height: floor+'px' } : {width: floor+'px' },
                }, () => el.style.overflow = 'clip', () => {
                    el._x_isShown = false

                    // check if element is fully collapsed
                    if (el.style.height == `${floor}px` && fullyHide || el.style.width == `${floor}px` && fullyHide) {
                        el.style.display = 'none'
                        el.hidden = true
                    }
                })
            },
        }
    }
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

    if (key === 'min') {
        // Support x-collapse.min.100px && min.100
        let match = rawValue.match(/([0-9]+)px/)
        if (match) return match[1]
    }

    return rawValue
}
