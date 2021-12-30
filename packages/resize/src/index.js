const debounce = (callback, wait) => {
    let timeout = null
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            callback.apply(null, args)
        }, wait)
    }
}

export default function (Alpine) {
    Alpine.directive('resize', (el, { value = 0, expression }, { evaluateLater, cleanup }) => {
        const evaluate = debounce(() => evaluateLater(expression)(), value)

        const observer = new ResizeObserver(entries => {
            entries.forEach(() => evaluate())
        })

        observer.observe(el)

        cleanup(() => observer.disconnect())
    })
}

