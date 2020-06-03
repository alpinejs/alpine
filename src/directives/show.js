import { transitionIn, transitionOut } from '../utils'

export function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
    // if value is changed resolve any previous pending transitions before starting a new one
    if (el.__x_transition_remaining && el.__x_transition_last_value !== value) {
        el.__x_transition_remaining()
    }

    const hide = () => {
        el.style.display = 'none'
    }

    const show = () => {
        if (el.style.length === 1 && el.style.display === 'none') {
            el.removeAttribute('style')
        } else {
            el.style.removeProperty('display')
        }
    }

    if (initialUpdate === true) {
        // Asign current value to el to check later on for preventing transition overlaps
        el.__x_transition_last_value = value

        if (value) {
            show()
        } else {
            hide()
        }
        return
    }

    const handle = (resolve) => {
        if(value) {
            transitionIn(el,() => {
                show()
            }, component)
            resolve(() => {})
        } else {
            if ( el.style.display !== 'none' ) {
                transitionOut(el, () => {
                    resolve(() => {
                        hide()
                    })
                },component)
            } else {
                resolve(() => {})
            }
        }

        // Asign current value to el
        el.__x_transition_last_value = value
    }


    // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.

    // If x-show.immediate, foregoe the waiting.
    if (modifiers.includes('immediate')) {
        handle(finish => finish())
        return
    }

    // x-show is encountered during a DOM tree walk. If an element
    // we encounter is NOT a child of another x-show element we
    // can execute the previous x-show stack (if one exists).
    if (component.showDirectiveLastElement && ! component.showDirectiveLastElement.contains(el)) {
        component.executeAndClearRemainingShowDirectiveStack()
    }

    // If x-show value changed from previous transition we'll push the handler onto a stack to be handled later.
    if (el.__x_transition_last_value !== value) {
        component.showDirectiveStack.push(handle)
        component.showDirectiveLastElement = el
    }
}
