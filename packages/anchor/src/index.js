import { computePosition, autoUpdate, flip, offset, shift } from '@floating-ui/dom'

export default function (Alpine) {
    Alpine.magic('anchor', el => {
        if (! el._x_anchor) throw 'Alpine: No x-anchor directive found on element using $anchor...'

        return el._x_anchor
    })

    Alpine.directive('anchor', (el, { expression, modifiers, value }, { cleanup, evaluate }) => {
        el._x_anchor = Alpine.reactive({ x: 0, y: 0 })

        let reference = evaluate(expression)

        if (! reference) throw 'Alpine: no element provided to x-anchor...'

        let positions = ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end']
        let placement = positions.find(i => modifiers.includes(i))

        let offsetValue = 0

        if (modifiers.includes('offset')) {
            let idx = modifiers.findIndex(i => i === 'offset')

            offsetValue = modifiers[idx + 1] !== undefined ? Number(modifiers[idx + 1]) : offsetValue
        }

        let release = autoUpdate(reference, el, () => {
            let previousValue

            computePosition(reference, el, {
                placement,
                middleware: [flip(), shift({padding: 5}), offset(offsetValue)],
            }).then(({ x, y }) => {
                // Only trigger Alpine reactivity when the value actually changes...
                if (JSON.stringify({ x, y }) !== previousValue) {
                    el._x_anchor.x = x
                    el._x_anchor.y = y
                }

                previousValue = JSON.stringify({ x, y })
            })
        })

        cleanup(() => release())
    })
}
