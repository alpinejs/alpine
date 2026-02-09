export default function (Alpine) {
    Alpine.directive('collapse', collapse)

    // If we're using a "minimum height", we'll need to disable
    // x-show's default behavior of setting display: 'none'.
    collapse.inline = (el, { modifiers }) => {
        if (! modifiers.includes('min')) return

        el._x_doShow = () => {}
        el._x_doHide = () => {}
    }

    function collapse(el, { modifiers }) {
        let duration = modifierValue(modifiers, 'duration', 250) / 1000
        let floor = modifierValue(modifiers, 'min', '0px')
        let fullyHide = ! modifiers.includes('min')

        if (! el._x_isShown) el.style.height = floor
        // We use the hidden attribute for the benefit of Tailwind
        // users as the .space utility will ignore [hidden] elements.
        // We also use display:none as the hidden attribute has very
        // low CSS specificity and could be accidentally overridden
        // by a user.
        if (! el._x_isShown && fullyHide) el.hidden = true
        if (! el._x_isShown) el.style.overflow = 'hidden'

        // Override the setStyles function with one that won't
        // revert updates to the height style.
        let setFunction = (el, styles) => {
            let revertFunction = Alpine.setStyles(el, styles);

            return styles.height ? () => {} : revertFunction
        }

        let transitionStyles = {
            transitionProperty: 'height',
            transitionDuration: `${duration}s`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        el._x_transition = {
            in(before = () => {}, after = () => {}) {
                if (fullyHide) el.hidden = false;
                if (fullyHide) el.style.display = null

                let current = el.getBoundingClientRect().height

                el.style.height = 'auto'

                let full = el.getBoundingClientRect().height

                let startHeight = (current === full) ? floor : current+'px'

                Alpine.transition(el, Alpine.setStyles, {
                    during: transitionStyles,
                    start: { height: startHeight },
                    end: { height: full+'px' },
                }, () => el._x_isShown = true, () => {
                    if (Math.abs(el.getBoundingClientRect().height - full) < 1) {
                        el.style.overflow = null
                    }
                })
            },

            out(before = () => {}, after = () => {}) {
                let full = el.getBoundingClientRect().height

                Alpine.transition(el, setFunction, {
                    during: transitionStyles,
                    start: { height: full+'px' },
                    end: { height: floor },
                }, () => el.style.overflow = 'hidden', () => {
                    el._x_isShown = false

                    // check if element is fully collapsed
                    if (el.style.height == floor && fullyHide) {
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
    let rawValue = modifiers[modifiers.indexOf(key) + 1]

    if (! rawValue) return fallback

    if (key === 'duration') {
        // Support x-collapse.duration.500ms && duration.500
        let match = rawValue.match(/([0-9]+)ms/)
        if (match) return match[1]
    }

    if (key === 'min') {
        // Support CSS variables: x-collapse.min.var(--collapse-min)
        if (rawValue.startsWith('var(')) return rawValue

        // Support values with units: x-collapse.min.100px, x-collapse.min.50vh
        let match = rawValue.match(/^([0-9]+(?:\.[0-9]+)?)(px|%|em|rem|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw)?$/)
        if (match) return match[1] + (match[2] || 'px')
    }

    return rawValue
}
