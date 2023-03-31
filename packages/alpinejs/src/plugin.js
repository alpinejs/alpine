import Alpine from "./alpine";

export function plugin(...callbacks) {
    callbacks.flat(Infinity).forEach((callback) => callback(Alpine));
}
