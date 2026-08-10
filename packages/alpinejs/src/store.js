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

    // Initialize the interceptor directly when it is the store value itself.
    if (typeof value === 'object' && value !== null && value._x_interceptor) {
        stores[name] = value.initialize(stores, name, name, () => {})
    } else {
        initInterceptors(stores[name])
    }

    if (typeof value === 'object' && value !== null && value.hasOwnProperty('init') && typeof value.init === 'function') {
        stores[name].init()
    }
}

export function getStores() { return stores }
