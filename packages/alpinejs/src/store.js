import { reactive } from "./reactivity"

let stores = {}
let isReactive = false

export function store(name, value) {
    if (! isReactive) { stores = reactive(stores); isReactive = true; }

    if (typeof name === 'object' && value === undefined) {
        Object.entries(name).forEach(([key, value]) => {
            store(key, value)
        })

        return
    }

    if (value === undefined) {
        return stores[name]
    }

    stores[name] = value

    if (typeof value === 'object' && value !== null && value.hasOwnProperty('init') && typeof value.init === 'function') {
        stores[name].init()
    }
}

export function getStores() { return stores }
