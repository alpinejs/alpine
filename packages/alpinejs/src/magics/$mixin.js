import { magic } from "../magics";

magic('mixin', () => (...datas) => {
    let inits = []
    let destroys = []
    const mixed = {}

    for (let data of datas) {
        if (typeof data === 'function') {
            data = data()
        }

        if (typeof data !== 'object') continue

        if (typeof data.init === 'function') {
            inits.push(data.init)
        }

        if (typeof data.destroy === 'function') {
            destroys.push(data.destroy)
        }

        Object.defineProperties(mixed, Object.getOwnPropertyDescriptors(data));
    }

    return Object.defineProperties(mixed, Object.getOwnPropertyDescriptors({
        init() {
            inits.forEach((init) => init.call(this));
        },
        destroy() {
            destroys.forEach((destroy) => destroy.call(this));
        },
    }));
})
