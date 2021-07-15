
export default function (Alpine) {
    Alpine.directive('intersect', (el, { expression, modifiers }, { evaluateLater, cleanup }) => {
        let evaluate = evaluateLater(expression)

        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.intersectionRatio === 0) return

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
