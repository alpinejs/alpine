import { createFocusTrap } from 'focus-trap';

export default function (Alpine) {
    Alpine.directive('trap', (el, { expression }, { effect, evaluateLater }) => {
        let evaluator = evaluateLater(expression)

        let oldValue = false

        let trap = createFocusTrap(el, { 
            escapeDeactivates: false,
            allowOutsideClick: true
        })

        effect(() => evaluator(value => {
            if (oldValue === value) return

            // Start trapping.
            if (value && ! oldValue) {
                setTimeout(() => {
                    trap.activate()
                });
            }

            // Stop trapping.
            if (! value && oldValue) {
                trap.deactivate()
            }

            oldValue = !! value
        }))
    })
}
