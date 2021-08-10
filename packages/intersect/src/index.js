export default function (Alpine) {
    Alpine.directive('intersect', (el, { modifiers }, { cleanup, dispatch }) => {

        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                let event = entry.isIntersecting ? 'enter' : 'leave';
                
                dispatch(el, 'change', entry)

                dispatch(el, event, entry)

                modifiers.includes('once') && observer.disconnect()
            })
        })

        observer.observe(el)

        cleanup(() => {
            observer.disconnect()
        })
    })
}
