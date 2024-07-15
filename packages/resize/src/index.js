export default function (Alpine) {
    Alpine.directive('resize', Alpine.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
        let evaluator = evaluateLater(expression)

        let evaluate = (width, height) => {
            evaluator(() => {}, { scope: { '$width': width, '$height': height }})
        }

        let off = modifiers.includes('document')
            ? onDocumentResize(evaluate)
            : onElResize(el, evaluate)

        cleanup(() => off())
    }))
}

function onElResize(el, callback) {
    let observer = new ResizeObserver((entries) => {
        let [width, height] = dimensions(entries)

        callback(width, height)
    })

    observer.observe(el)

    return () => observer.disconnect()
}

let documentResizeObserver
let documentResizeObserverCallbacks = new Set

function onDocumentResize(callback) {
    documentResizeObserverCallbacks.add(callback)

    if (! documentResizeObserver) {
        documentResizeObserver = new ResizeObserver((entries) => {
            let [width, height] = dimensions(entries)

            documentResizeObserverCallbacks.forEach(i => i(width, height))
        })

        documentResizeObserver.observe(document.documentElement)
    }

    return () => {
        documentResizeObserverCallbacks.delete(callback)
    }
}

function dimensions(entries) {
    let width, height

    for (let entry of entries) {
        width = entry.borderBoxSize[0].inlineSize
        height = entry.borderBoxSize[0].blockSize
    }

    return [width, height]
}
