let pauseReactions = false

export default function (Alpine) {
    Alpine.directive('intersect', (el, { value, modifiers, expression }, { evaluateLater }) => {
        let evaluate = evaluateLater(expression)

        if (['out', 'leave'].includes(value)) {
            el._x_intersectLeave(evaluate, modifiers)
        } else {
            el._x_intersectEnter(evaluate, modifiers)
        }
    })
}

window.Element.prototype._x_intersectEnter = function (callback, modifiers) {
    this._x_intersect((entry, observer) => {
        if (pauseReactions) return

        pauseReactions = true
        if (entry.intersectionRatio > 0) {

            callback()

            modifiers.includes('once') && observer.unobserve(this)


        }
        setTimeout(() => {
            pauseReactions = false
        }, 100);
    })
}

window.Element.prototype._x_intersectLeave = function (callback, modifiers) {
    this._x_intersect((entry, observer) => {
        if (pauseReactions) return

        pauseReactions = true
        if (! entry.intersectionRatio > 0) {

            callback()

            modifiers.includes('once') && observer.unobserve(this)


        }
        setTimeout(() => {
            pauseReactions = false
        }, 100);
    })
}

window.Element.prototype._x_intersect = function (callback) {
    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => callback(entry, observer))
    }, {
        // threshold: 1,
    })

    observer.observe(this);

    return observer
}
