export default function (Alpine) {
    Alpine.directive('intersect', Alpine.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
        let evaluate = evaluateLater(expression)

        let options = {
            rootMargin: getRootMargin(modifiers),
            threshold: getThreshold(modifiers),
        }

        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // Ignore entry if intersecting in leave mode, or not intersecting in enter mode
                if (entry.isIntersecting === (value === 'leave')) return

                evaluate()

                modifiers.includes('once') && observer.disconnect()
            })
        }, options)

        observer.observe(el)

        cleanup(() => {
            observer.disconnect()
        })
    }))
}

function getThreshold(modifiers) {
    if (modifiers.includes('full')) return 0.99
    if (modifiers.includes('half')) return 0.5
    if (! modifiers.includes('threshold')) return 0

    let threshold = modifiers[modifiers.indexOf('threshold') + 1]

    if (threshold === '100') return 1
    if (threshold === '0') return 0

    return Number(`.${threshold}`)
}

export function getLengthValue(rawValue) {
    // Supported: -10px, -20 (implied px), 30 (implied px), 40px, 50%
    let match = rawValue.match(/^(-?[0-9]+)(px|%)?$/)
    return match ? match[1] + (match[2] || 'px') : undefined
}

export function getRootMargin(modifiers) {
    const key = 'margin'
    const fallback = '0px 0px 0px 0px'
    const index = modifiers.indexOf(key)

    // If the modifier isn't present, use the default.
    if (index === -1) return fallback

    // Grab the 4 subsequent length values after it: x-intersect.margin.300px.0.50%.0
    let values = []
        for (let i = 1; i < 5; i++) {
            values.push(getLengthValue(modifiers[index + i] || ''))
        }

    // Filter out undefined values (not a valid length)
    values = values.filter((v) => v !== undefined)

    return values.length ? values.join(' ').trim() : fallback
}
