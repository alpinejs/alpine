import { kebabCase, debounce, hasTimeFormat } from '../utils'

export function registerListener(component, el, event, modifiers, expression, extraVars = {}) {
    if (modifiers.includes('away')) {
        const handler = e => {
            // Don't do anything if the click came form the element or within it.
            if (el.contains(e.target)) return

            // Don't do anything if this element isn't currently visible.
            if (el.offsetWidth < 1 && el.offsetHeight < 1) return

            // Now that we are sure the element is visible, AND the click
            // is from outside it, let's run the expression.
            runListenerHandler(component, expression, e, extraVars)

            if (modifiers.includes('once')) {
                document.removeEventListener(event, handler)
            }
        }

        // Listen for this event at the root level.
        document.addEventListener(event, handler)
    } else {
        const listenerTarget = modifiers.includes('window')
            ? window : (modifiers.includes('document') ? document : el)

        const hasDebounceModifier = modifiers.includes('debounce')
        let wait
        if (hasTimeFormat(modifiers[modifiers.indexOf('debounce')+1])) {
          wait = modifiers[modifiers.indexOf('debounce')+1]  
        } else {
            wait = '250ms'
        }

        const handler = e => {
            if (isKeyEvent(event)) {
                if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
                    return
                }
            }

            if (modifiers.includes('prevent')) e.preventDefault()
            if (modifiers.includes('stop')) e.stopPropagation()

            const returnValue = runListenerHandler(component, expression, e, extraVars)

            if (returnValue === false) {
                e.preventDefault()
            } else {
                if (modifiers.includes('once')) {
                    listenerTarget.removeEventListener(event, handler)
                }
            }
        }

        listenerTarget.addEventListener(event, hasDebounceModifier ? debounce(handler,wait) : handler)
    }
}

function runListenerHandler(component, expression, e, extraVars) {
    return component.evaluateCommandExpression(e.target, expression, () => {
        return {...extraVars(), '$event': e}
    })
}

function isKeyEvent(event) {
    return ['keydown', 'keyup'].includes(event)
}

function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter(i => {
        return ! ['window', 'document', 'prevent', 'stop'].includes(i)
    })

    // Need to remove debounce and wait modifiers if present
    if ( keyModifiers.includes('debounce') ) {
        const debounceModifierIndex = keyModifiers.indexOf('debounce')
        let debounceIndexes = [debounceModifierIndex]
        if ( hasTimeFormat(keyModifiers[debounceModifierIndex+1]) ) {
            debounceIndexes.push(debounceModifierIndex+1)
        }
        keyModifiers = keyModifiers.filter( (modifier, index) => {
            return !debounceIndexes.includes(index)
        })
    }

    // If no modifier is specified, we'll call it a press.
    if (keyModifiers.length === 0) return false

    // If one is passed, AND it matches the key pressed, we'll call it a press.
    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) return false

    // The user is listening for key combinations.
    const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super']
    const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier))

    keyModifiers = keyModifiers.filter(i => ! selectedSystemKeyModifiers.includes(i))

    if (selectedSystemKeyModifiers.length > 0) {
        const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
            // Alias "cmd" and "super" to "meta"
            if (modifier === 'cmd' || modifier === 'super') modifier = 'meta'

            return e[`${modifier}Key`]
        })

        // If all the modifiers selected are pressed, ...
        if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
            // AND the remaining key is pressed as well. It's a press.
            if (keyModifiers[0] === keyToModifier(e.key)) return false
        }
    }

    // We'll call it NOT a valid keypress.
    return true
}

function keyToModifier(key) {
    switch (key) {
        case '/':
            return 'slash'
        case ' ':
        case 'Spacebar':
            return 'space'
        default:
            return kebabCase(key)
    }
}
