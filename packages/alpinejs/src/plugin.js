import Alpine from "./alpine";

export function plugin(callback) {
    let callbacks = Array.isArray(callback) ? callback : [callback]

    callbacks.forEach(i => i(Alpine))
}
