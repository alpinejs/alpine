import Alpine from './alpine'

export function plugin(callback, ...callbacks) {
    if (callbacks.length) plugin(callbacks)
    if (Array.isArray(callback)) callback.forEach(cb => cb(Alpine));
    else callback(Alpine)
}
