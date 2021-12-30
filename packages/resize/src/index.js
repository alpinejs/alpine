function isNumeric(subject) {
    return ! Array.isArray(subject) && ! isNaN(subject)
}

export default function (Alpine) {
    Alpine.directive('resize', (el, { modifiers, expression }, { evaluateLater, cleanup }) => {

        let evaluate = evaluateLater(expression)

        if (modifiers.includes('debounce')) {
            let nextModifier = modifiers[modifiers.indexOf('debounce')+1] || 'invalid-wait'
            let wait = isNumeric(nextModifier.split('ms')[0]) ? Number(nextModifier.split('ms')[0]) : 250

            evaluate = Alpine.debounce(evaluate, wait)
        }

        const observer = new ResizeObserver(entries => {
            entries.forEach(() => evaluate())
        })

        observer.observe(el)

        cleanup(() => observer.disconnect())
    })
}
