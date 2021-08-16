export default function (Alpine) {
    Alpine.directive('intersect', (el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
        let evaluate = evaluateLater(expression)

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
        })

        observer.observe(el)

        cleanup(() => {
            observer.disconnect()
        })
    })
}
