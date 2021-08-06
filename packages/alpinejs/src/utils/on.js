
export default function on (el, event, modifiers, callback) {
    let listenerTarget = el

    let handler = e => callback(e)

    let options = {}

    // This little helper allows us to add functionality to the listener's
    // handler more flexibly in a "middleware" style.
    let wrapHandler = (callback, wrapper) => (e) => wrapper(callback, e)

    let params = {keyModifiers: []}
    for (let i = 0; i < modifiers.length; i++) {
        let m = modifiers[i]
        let nextModifier = modifiers[i + 1] || 'invalid-wait'

        let timeArg = () => {
            let wait = nextModifier.split('ms')[0]
            if (!isNumeric(wait))
                return 250

            i += 1
            return Number(wait)
        }

        // handle aliases
        if (m === 'away') m = 'outside'
        if (m === 'cmd' || m === 'super') m = 'meta'

        if (['camel', 'dot', 'passive', 'window', 'document', 'prevent', 'stop', 'self', 'outside', 'once'].includes(m))
            params[m] = true
        else if (['debounce', 'throttle'].includes(m)) {
            params[m] = timeArg()
        } else {
            params.keyModifiers.push(m)
        }
    }

    if (params.dot) event = dotSyntax(event)
    if (params.camel) event = camelCase(event)
    if (params.passive) options.passive = true
    if (params.window) listenerTarget = window
    if (params.document) listenerTarget = document
    if (params.prevent) handler = wrapHandler(handler, (next, e) => { e.preventDefault(); next(e) })
    if (params.stop) handler = wrapHandler(handler, (next, e) => { e.stopPropagation(); next(e) })
    if (params.self) handler = wrapHandler(handler, (next, e) => { e.target === el && next(e) })

    if (params.outside) {
        listenerTarget = document

        handler = wrapHandler(handler, (next, e) => {
            if (el.contains(e.target)) return

            if (el.offsetWidth < 1 && el.offsetHeight < 1) return

            next(e)
        })
    }

    // Handle :keydown and :keyup listeners.
    handler = wrapHandler(handler, (next, e) => {
        if (isKeyEvent(event)) {
            if (isListeningForASpecificKeyThatHasntBeenPressed(e, params.keyModifiers)) {
                return
            }
        }

        next(e)
    })

    if (params.debounce)
        handler = debounce(handler, params.debounce, this)

    if (params.throttle)
        handler = throttle(handler, params.throttle, this)

    if (params.once) {
        handler = wrapHandler(handler, (next, e) => {
            next(e)

            listenerTarget.removeEventListener(event, handler, options)
        })
    }

    listenerTarget.addEventListener(event, handler, options)

    return () => {
        listenerTarget.removeEventListener(event, handler, options)
    }
}

function dotSyntax(subject) {
    return subject.replace(/-/g, ".");
}
  
function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase())
}

function debounce(func, wait) {
    var timeout

    return function() {
        var context = this, args = arguments

        var later = function () {
            timeout = null

            func.apply(context, args)
        }

        clearTimeout(timeout)

        timeout = setTimeout(later, wait)
    }
}

function throttle(func, limit) {
    let inThrottle

    return function() {
        let context = this, args = arguments

        if (! inThrottle) {
            func.apply(context, args)

            inThrottle = true

            setTimeout(() => inThrottle = false, limit)
        }
    }
}

function isNumeric(subject){
    return ! Array.isArray(subject) && ! isNaN(subject)
}

function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase()
}

function isKeyEvent(event) {
    return ['keydown', 'keyup'].includes(event)
}

function isListeningForASpecificKeyThatHasntBeenPressed(e, keyModifiers) {
    if (keyModifiers.length === 0) return false

    // If one is passed, AND it matches the key pressed, we'll call it a press.
    if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0])) return false

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
            if (keyToModifiers(e.key).includes(keyModifiers[0])) return false
        }
    }

    // We'll call it NOT a valid keypress.
    return true
}

function keyToModifiers(key) {
    if (! key) return []

    key = kebabCase(key)

    let modifierToKeyMap = {
        'ctrl': 'control',
        'slash': '/',
        'space': '-',
        'spacebar': '-',
        'cmd': 'meta',
        'esc': 'escape',
        'up': 'arrow-up',
        'down': 'arrow-down',
        'left': 'arrow-left',
        'right': 'arrow-right',
    }

    modifierToKeyMap[key] = key

    return Object.keys(modifierToKeyMap).map(modifier => {
        if (modifierToKeyMap[modifier] === key) return modifier
    }).filter(modifier => modifier)
}
