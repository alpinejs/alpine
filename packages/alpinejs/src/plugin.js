import Alpine from "./alpine";

export function plugin(callback) {
    let callbacks = Array.isArray(callback) ? callback : [callback]

    callbacks.forEach(i => {
      if (typeof i === undefined) { throw new Error(`Alpine.plugin(...) expects a callback function but got undefined. Did you misspell your plugin import?`)}
      if (typeof i !== 'function') { throw new Error(`Alpine.plugin(...) expects a callback function but got ${i}`)}
      i(Alpine)
    })
}
