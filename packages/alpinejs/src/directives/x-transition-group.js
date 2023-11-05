import {directive} from '../directives'
import {warn} from "../utils/warn";

directive('transition-group', (el) => {
    if (el.tagName.toLowerCase() !== 'template') {
        warn('x-transition-group can only be used on a <template> tag', el)
    }

    el._x_transitionGroup = true;

    el._x_removeElementWithTransition = (key, callback) => {
        const elementToRemove = el._x_lookup[key]

        moveElements(el, () => {
            elementToRemove._x_isRemoving = true
            elementToRemove.classList.add('fade-leave-to', 'fade-leave-active')
        })

        const duration = getTransitionDuration(elementToRemove)
        setTimeout(callback, duration)
    }

    el._x_addElementWithTransition = (elementToAdd, callback) => {
        moveElements(el, () => {
            elementToAdd._x_isAdding = true
            elementToAdd.classList.add('fade-enter-from', 'fade-enter-active')

            callback()

            const duration = getTransitionDuration(elementToAdd)
            setTimeout(() => {
                elementToAdd._x_isAdding = false
                elementToAdd.classList.remove('fade-enter-active', 'fade-enter-to')
            }, duration)

            requestAnimationFrame(() => {
                elementToAdd.classList.remove('fade-enter-from')
                elementToAdd.classList.add('fade-enter-to')
            })
        })
    }
})

function moveElements(el, elementCallback) {
    const originalPositions = el._x_prevKeys.map(k => ({
        key: k,
        position: el._x_lookup[k].getBoundingClientRect()
    }))

    elementCallback()

    const newPositions = {}
    Object.keys(el._x_lookup).forEach(k => {
        if (!k._x_isRemoving || !k._x_isAdding) {
            newPositions[k] = el._x_lookup[k].getBoundingClientRect()
        }
    })

    originalPositions.forEach(oldPos => {
        const newPos = newPositions[oldPos.key]
        if (newPos) {
            const dx = oldPos.position.left - newPos.left
            const dy = oldPos.position.top - newPos.top

            if (dx || dy) {
                const element = el._x_lookup[oldPos.key]

                element.classList.add('fade-move')

                const styles = element.style
                styles.transform = `translate(${dx}px, ${dy}px)`
                styles.transitionDuration = '0s'
            }
        }
    })

    requestAnimationFrame(() => {
        originalPositions.forEach(oldPos => {
            const elementToMove = el._x_lookup[oldPos.key]
            if (elementToMove) {
                const styles = elementToMove.style
                styles.transitionDuration = ''
                styles.transform = ''
            }
        })
    })
}

function getTransitionDuration(element) {
    const transitionDuration = window.getComputedStyle(element).transitionDuration
    let durationInMs

    if (transitionDuration.includes('s')) {
        durationInMs = parseFloat(transitionDuration) * 1000
    } else {
        durationInMs = parseFloat(transitionDuration)
    }

    return durationInMs
}
