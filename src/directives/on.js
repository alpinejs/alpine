import { kebabCase } from '../utils'

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

        const handler = e => {
            // Remove this global event handler if the element that declared it
            // has been removed. It's now stale.
            if (listenerTarget === window || listenerTarget === document) {
                if (! document.body.contains(el)) {
                    listenerTarget.removeEventListener(event, handler)
                    return
                }
            }

            if (isKeyEvent(event)) {
                if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
                    return
                }
            } else {
                // If we're not a keydown event, we should check for
                // any system key modifier
                const systemKeyModifiers = getSystemKeyModifiers()
                if (modifiers.some(m => systemKeyModifiers.includes(m))) {
                    // Convert modifiers to the right alias:
                    // `cmd -> meta`, `super -> meta`
                    const aliasedModifiers = modifiers.map(modifier => aliasMetaCmdSuper(modifier))
                    const selectedSystemKeyModifiers = systemKeyModifiers
                        .filter(modifier => aliasedModifiers.includes(aliasMetaCmdSuper(modifier)))
                    const isModifierOnEvent = modifier => e[`${aliasMetaCmdSuper(modifier)}Key`]

                    const hasCorrectModifiers = modifiers.includes('exact')
                        ? selectedSystemKeyModifiers.every(isModifierOnEvent) &&
                            !systemKeyModifiers
                                .filter(m => !selectedSystemKeyModifiers.includes(m))
                                .some(isModifierOnEvent)
                        : selectedSystemKeyModifiers.every(isModifierOnEvent)

                    // Don't run the handler if we don't have the right
                    if (!hasCorrectModifiers) return
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

        listenerTarget.addEventListener(event, handler)
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

function getSystemKeyModifiers() {
    return ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super']
}

function aliasMetaCmdSuper(modifier) {
    return (modifier === 'cmd' || modifier === 'super') ? 'meta' : modifier
}

function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter(i => {
        return ! ['window', 'document', 'prevent', 'stop', 'exact'].includes(i)
    })

    // If no modifier is specified, we'll call it a press.
    if (keyModifiers.length === 0) return false

    // If one is passed, AND it matches the key pressed
    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) {
        // If it's an exact match, it's a press as long as no other modifiers are
        // pressed
        if (modifiers.includes('exact')) {
            return getSystemKeyModifiers()
                .some(modifier => e[`${aliasMetaCmdSuper(modifier)}Key`])
        }
        // And we're not doing an `.exact` match we'll call it a press.
        return false
    }

    // The user is listening for key combinations.
    const systemKeyModifiers = getSystemKeyModifiers()
    const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier))

    keyModifiers = keyModifiers.filter(i => ! selectedSystemKeyModifiers.includes(i))

    if (selectedSystemKeyModifiers.length > 0) {
        const activelyPressedKeyModifiers = selectedSystemKeyModifiers
            .filter(modifier => e[`${aliasMetaCmdSuper(modifier)}Key`])

        let areAllSystemModifiersPressed = activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length

        if (modifiers.includes('exact')) {
            // in the ".exact" case, all pressed modifiers need to be selected modifiers
            // ie. no pressed modifier must be unselected
            const allPressedKeyModifiers = systemKeyModifiers
                .filter(modifier => e[`${aliasMetaCmdSuper(modifier)}Key`])
            // we need system key modifiers pressed since we wouldn't be
            // in the branch otherwise
            areAllSystemModifiersPressed = allPressedKeyModifiers.length > 0 &&
                allPressedKeyModifiers.every(modifier =>
                    selectedSystemKeyModifiers.some(
                        (m) => aliasMetaCmdSuper(m) === aliasMetaCmdSuper(modifier)
                    )
                )
        }

        // If all the modifiers selected are pressed, ...
        if (areAllSystemModifiersPressed) {
            // AND the remaining key is pressed as well. It's a press.
            if (keyModifiers[0] === keyToModifier(e.key)) {
                return false
            }
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
