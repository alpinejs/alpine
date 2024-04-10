import Sortable from 'sortablejs'

export default function (Alpine) {
    Alpine.directive('sort', (el, { value, modifiers, expression }, { effect, evaluate, evaluateLater, cleanup }) => {
        if (value === 'config') {
            return // This will get handled by the main directive...
        }

        if (value === 'handle') {
            return // This will get handled by the main directive...
        }

        if (value === 'key') {
            if ([undefined, null, ''].includes(expression)) return

            el._x_sort_key = evaluate(expression)

            return
        }

        let preferences = {
            hideGhost: ! modifiers.includes('ghost'),
            useHandles: !! el.querySelector('[x-sort\\:handle]'),
            group: modifiers.indexOf('group') !== -1 ? modifiers[modifiers.indexOf('group') + 1] : null,
        }

        let handleSort = generateSortHandler(expression, evaluateLater)

        let config = getConfigurationOverrides(el, modifiers, evaluate)

        let sortable = initSortable(el, config, preferences, (key, position) => {
            handleSort(key, position)
        })

        cleanup(() => sortable.destroy())
    })
}

function generateSortHandler(expression, evaluateLater) {
    // No handler was passed to x-sort...
    if ([undefined, null, ''].includes(expression)) return () => {}

    let handle = evaluateLater(expression)

    return (key, position) => {
        // In the case of `x-sort="handleSort"`, let us call it manually...
        Alpine.dontAutoEvaluateFunctions(() => {
            handle(
                // If a function is returned, call it with the key/position params...
                received => {
                    if (typeof received === 'function') received(key, position)
                },
                // Provide $key and $position to the scope in case they want to call their own function...
                { scope: {
                    $key: key,
                    $position: position,
                } },
            )
        })
    }
}

function getConfigurationOverrides(el, modifiers, evaluate)
{
    return el.hasAttribute('x-sort:config')
        ? evaluate(el.getAttribute('x-sort:config'))
        : {}
}

function initSortable(el, config, preferences, handle) {
    let ghostRef

    let options = {
        animation: 150,

        handle: preferences.useHandles ? '[x-sort\\:handle]' : null,

        group: preferences.group,

        onSort(e) {
            // If item has been dragged between groups...
            if (e.from !== e.to) {
                // And this is the group it was dragged FROM...
                if (e.to !== e.target) {
                    return // Don't do anything, because the other group will call the handler...
                }
            }

            let key = e.item._x_sort_key
            let position = e.newIndex

            if (key !== undefined || key !== null) {
                handle(key, position)
            }
        },

        onStart() {
            ghostRef = document.querySelector('.sortable-ghost')

            if (preferences.hideGhost && ghostRef) ghostRef.style.opacity = '0'
        },


        onEnd() {
            if (preferences.hideGhost && ghostRef) ghostRef.style.opacity = '1'

            ghostRef = undefined

            keepElementsWithinMorphMarkers(el)
        }
    }

    return new Sortable(el, { ...options, ...config })
}

function keepElementsWithinMorphMarkers(el) {
    let cursor = el.firstChild

    while (cursor.nextSibling) {
        if (cursor.textContent.trim() === '[if ENDBLOCK]><![endif]') {
            el.append(cursor)
            break
        }

        cursor = cursor.nextSibling
    }
}
