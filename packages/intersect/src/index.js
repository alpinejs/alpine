export default function (Alpine) {
    Alpine.directive('intersect', (el, { modifiers }, { cleanup, dispatch }) => {

        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {

                dispatch(el, 'change', entry)

                dispatch(el, entry.isIntersecting ? 'enter' : 'leave', entry)

                modifiers.includes('once') && observer.disconnect()
            })
        })

        observer.observe(el)

        cleanup(() => {
            observer.disconnect()
        })
    })
}
