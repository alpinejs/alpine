
export default function (Alpine) {
    Alpine.directive('intersect', (el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
        let evaluate = evaluateLater(expression)

        let options = {
            threshold: getThreshhold(modifiers),
        }

        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (
                     ! entry.isIntersecting && value === 'enter'
                    || entry.isIntersecting && value === 'leave'
                    || entry.intersectionRatio === 0 && ! value
                ) return

                evaluate()

                modifiers.includes('once') && observer.disconnect()
            })
        }, options)

        observer.observe(el)

        cleanup(() => {
            observer.disconnect()
        })
    })
}

function getThreshhold(modifiers) {
    if (modifiers.includes('full')) return 0.99
    if (modifiers.includes('half')) return 0.5

    return 0
}
