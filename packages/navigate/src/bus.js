let listeners = {}

export function listen(event, callback) {
    listeners[event] = [...(listeners[event] || []), callback]
}

export function emit(event, ...props) {
    (listeners[event] || []).forEach(handle => handle(...props))
}
