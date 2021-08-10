export default function (Alpine) {
    Alpine.directive('intersect', (el, { expression, modifiers }, { evaluateLater, cleanup, dispatch }) => {
        let evaluate = expression ? evaluateLater(expression) : () => { }

        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                dispatch(el, 'changed', entry)

                dispatch(el, entry.isIntersecting ? 'enter' : 'leave', entry)

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
