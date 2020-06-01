import { transitionIn, transitionOut } from '../transitions'
import { showElement, hideElement } from '../utils'

export function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {

    if (initialUpdate) {
        if (value) {
            transitionIn(el, component, initialUpdate)
        } else {
            transitionOut(el, component, initialUpdate)
        }
        return
    }

    const handle = (resolve) => {
        if (!value) {
            if (el.style.display !== 'none') {
                transitionOut(el, component, initialUpdate, () => {
                    resolve(() => {
                        hideElement(el)
                    })
                })
            } else {
                resolve(() => { })
            }
        } else {
            if (el.style.display !== '') {
                transitionIn(el, component, initialUpdate, () => {
                    showElement(el)
                })
            }

            // Resolve immediately, only hold up parent `x-show`s for hidin.
            resolve(() => { })
        }
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
    if (component.showDirectiveLastElement && !component.showDirectiveLastElement.contains(el)) {
        component.executeAndClearRemainingShowDirectiveStack()
    }

    // We'll push the handler onto a stack to be handled later.
    component.showDirectiveStack.push(handle)

    component.showDirectiveLastElement = el
}
