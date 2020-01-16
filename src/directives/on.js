import { keyToModifier } from '../utils'

export function registerListener(component, el, event, modifiers, expression) {
    if (modifiers.includes('away')) {
        const handler = e => {
            // Don't do anything if the click came form the element or within it.
            if (el.contains(e.target)) return

            // Don't do anything if this element isn't currently visible.
            if (el.offsetWidth < 1 && el.offsetHeight < 1) return

            // Now that we are sure the element is visible, AND the click
            // is from outside it, let's run the expression.
            runListenerHandler(component, expression, e)

            if (modifiers.includes('once')) {
                document.removeEventListener(event, handler)
            }
        }

        // Listen for this event at the root level.
        document.addEventListener(event, handler)
    } else {
        const listenerTarget = modifiers.includes('window')
            ? window : (modifiers.includes('document') ? document : el)

        const handler = e => {
            const keyModifiers = modifiers.filter(i => i !== 'window').filter(i => i !== 'document')

            // The user is scoping the keydown listener to a specific key using modifiers.
            if (event === 'keydown' && keyModifiers.length > 0) {
                // The user is listening for a specific key.
                if (keyModifiers.length === 1 && ! keyModifiers.includes(keyToModifier(e.key))) return

                // The user is listening for key combinations.
                const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super']
                const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier))

                if (selectedSystemKeyModifiers.length > 0) {
                    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
                        // Alias "cmd" and "super" to "meta"
                        if (modifier === 'cmd' || modifier === 'super') modifier = 'meta'

                        return e[`${modifier}Key`]
                    })

                    if (activelyPressedKeyModifiers.length === 0) return
                }
            }

            if (modifiers.includes('prevent')) e.preventDefault()
            if (modifiers.includes('stop')) e.stopPropagation()

            runListenerHandler(component, expression, e)

            if (modifiers.includes('once')) {
                listenerTarget.removeEventListener(event, handler)
            }
        }

        listenerTarget.addEventListener(event, handler)
    }
}

function runListenerHandler(component, expression, e) {
    component.evaluateCommandExpression(expression, {
        '$event': e,
    })
}
