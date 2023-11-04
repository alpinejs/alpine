import { computePosition, autoUpdate, flip, offset, shift } from '@floating-ui/dom'

export default function (Alpine) {
    Alpine.magic('anchor', el => {
        if (! el._x_anchor) throw 'Alpine: No x-anchor directive found on element using $anchor...'

        return el._x_anchor
    })

    Alpine.interceptClone((from, to) => {
        if (from && from._x_anchor && ! to._x_anchor) {
            to._x_anchor = from._x_anchor
        }
    })

    Alpine.directive('anchor', Alpine.skipDuringClone((el, { expression, modifiers, value }, { cleanup, evaluate }) => {
        let { placement, offsetValue, unstyled } = getOptions(modifiers)

        el._x_anchor = Alpine.reactive({ x: 0, y: 0 })

        let reference = evaluate(expression)

        if (! reference) throw 'Alpine: no element provided to x-anchor...'

        let compute = () => {
            let previousValue

            computePosition(reference, el, {
                placement,
                middleware: [flip(), shift({padding: 5}), offset(offsetValue)],
            }).then(({ x, y }) => {
                unstyled || setStyles(el, x, y)

                // Only trigger Alpine reactivity when the value actually changes...
                if (JSON.stringify({ x, y }) !== previousValue) {
                    el._x_anchor.x = x
                    el._x_anchor.y = y
                }

                previousValue = JSON.stringify({ x, y })
            })
        }

        let release = autoUpdate(reference, el, () => compute())

        cleanup(() => release())
    },

    // When cloning (or "morphing"), we will graft the style and position data from the live tree...
    (el, { expression, modifiers, value }, { cleanup, evaluate }) => {
        let { placement, offsetValue, unstyled } = getOptions(modifiers)

        if (el._x_anchor) {
            unstyled || setStyles(el, el._x_anchor.x, el._x_anchor.y)
        }
    }))
}

function setStyles(el, x, y) {
    Object.assign(el.style, {
        left: x+'px', top: y+'px', position: 'absolute',
    })
}

function getOptions(modifiers) {
    let positions = ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end']
    let placement = positions.find(i => modifiers.includes(i))
    let offsetValue = 0
    if (modifiers.includes('offset')) {
        let idx = modifiers.findIndex(i => i === 'offset')

        offsetValue = modifiers[idx + 1] !== undefined ? Number(modifiers[idx + 1]) : offsetValue
    }
    let unstyled = modifiers.includes('no-style')

    return { placement, offsetValue, unstyled }
}
