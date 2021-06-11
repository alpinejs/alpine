import { reactive } from "./reactivity"

let stores = {}
let isReactive = false

export function store(name, value) {
    if (! isReactive) { stores = reactive(stores); isReactive = true; }

    if (value === undefined) {
        return stores[name]
    }

    if (typeof value === 'object' && value !== null && value.hasOwnProperty('init') && typeof value.init === 'function') {
        value.init()
    }

    stores[name] = value
}

export function getStores() { return stores }
