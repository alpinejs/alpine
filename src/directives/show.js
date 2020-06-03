import { transitionIn, transitionOut } from '../transitions'
import { showElement, hideElement } from '../utils'

export function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
    // if value is changed resolve any previous pending transitions before starting a new one
    if (el.__x_transition_remaining && el.__x_transition_last_value !== value) {
        el.__x_transition_remaining()
    }

    // Resolve immediately if initial page load
    if (initialUpdate) {
        return value ? showElement(el) : hideElement(el)
    }

    const handle = (resolve) => {
        if (! value) {
            if ( el.style.display !== 'none' ) {
                transitionOut(el, component, () => {
                    // If there is a remaning transition
                    // and value is changed, don't use resolve
                    if (el.__x_transition_remaining) {
                        hideElement(el)
                    } else {
                        resolve(() => {
                            hideElement(el)
                        })
                    }
                })
            } else {
                resolve(() => {})
            }
        } else {
            if ( el.style.display !== '' ) {
                transitionIn(el, component, () => {
                    showElement(el)
                })
            }

            // Resolve immediately, only hold up parent `x-show`s for hiding.
            resolve(() => {})
        }

        // Asign current value to el to check later on for preventing transition overlaps
        el.__x_transition_last_value = value
    }

    // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.

    // If x-show.immediate, forget the waiting.
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
