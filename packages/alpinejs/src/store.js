import { initInterceptors } from "./interceptor";
import { reactive } from "./reactivity"

let stores = {}
let isReactive = false

export function store(name, value) {
    if (! isReactive) { stores = reactive(stores); isReactive = true; }

    if (value === undefined) {
        return stores[name]
    }

    stores[name] = value

    if (typeof value === 'object' && value !== null && value.hasOwnProperty('init') && typeof value.init === 'function') {
        stores[name].init()
    }

    initInterceptors(stores[name])
}

export function getStores() { return stores }
