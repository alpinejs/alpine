import { transitionIn, transitionOut } from '../transitions'
import { showElement, hideElement } from '../utils'

export function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
  // Resolve any previous pending transitions before starting a new one
  if (el.__x_remaning_transitions) {
    el.__x_remaning_transitions()
  }

  // Resolve immediately if initial page load
  if (initialUpdate) {
    if (value) {
      showElement(el)
    } else {
      hideElement(el)
    }
    return
  }

  const handle = (resolve) => {
    if (! value) {
      if (el.style.display !== 'none') {
        transitionOut(el, component, () => {
          if (el.__x_remaning_transitions) {
            hideElement(el)
          } else {
            resolve(() => {
              hideElement(el)
            })
          }
        })
      } else {
        resolve(() => { })
      }
    } else {
      if (el.style.display !== '') {
        transitionIn(el, component, () => {
          showElement(el)
        })
      }

      // Resolve immediately, only hold up parent `x-show`s for hiding.
      resolve(() => { })
    }
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

  // We'll push the handler onto a stack to be handled later.
  component.showDirectiveStack.push(handle)

  component.showDirectiveLastElement = el
}
