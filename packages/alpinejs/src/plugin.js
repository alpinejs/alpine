import Alpine from "./alpine.js";

export function plugin(callback) {
    let callbacks = Array.isArray(callback) ? callback : [callback]

    callbacks.forEach(i => i(Alpine))
}
