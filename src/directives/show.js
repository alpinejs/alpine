import { transitionIn, transitionOut } from '../utils'

export function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
    const hide = () => {
        el.style.display = 'none'
        el.__x_is_shown = false
    }

    const show = () => {
        if (el.style.length === 1 && el.style.display === 'none') {
            el.removeAttribute('style')
        } else {
            el.style.removeProperty('display')
        }

        el.__x_is_shown = true
    }

    if (initialUpdate === true) {
        if (value) {
            show()
        } else {
            hide()
        }
        return
    }

    const handle = (resolve, reject) => {
        if (value) {
            if (el.style.display === 'none' || el.__x_transition) {
                transitionIn(el, () => {
                    show()
                }, reject, component)
            }
            resolve(() => {})
        } else {
            if (el.style.display !== 'none') {
                transitionOut(el, () => {
                    resolve(() => {
                        hide()
                    })
                }, reject, component)
            } else {
                resolve(() => {})
            }
        }
    }

    // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.

    // If x-show.immediate, foregoe the waiting.
    if (modifiers.includes('immediate')) {
        handle(finish => finish(), () => {})
        return
    }

    // x-show is encountered during a DOM tree walk. If an element
    // we encounter is NOT a child of another x-show element we
    // can execute the previous x-show stack (if one exists).
    if (component.showDirectiveLastElement && ! component.showDirectiveLastElement.contains(el)) {
        component.executeAndClearRemainingShowDirectiveStack()
    }

    component.showDirectiveStack.push(handle)

    component.showDirectiveLastElement = el
}
