import { magic } from "../magics";

magic('mixin', () => (...datas) => {
    let inits = []
    let destroys = []

    const mixed = datas.reduce((acc, data) => {
        if (typeof data === 'function') {
            data = data()
        }

        if (typeof data.init === 'function') {
            inits.push(data.init)
        }

        if (typeof data.destroy === 'function') {
            destroys.push(data.destroy)
        }

        if (typeof data === 'object') {
            return { ...acc, ...data }
        }

        return acc
    }, {})

    return {
        ...mixed,
        init() {
            inits.forEach(init => init.call(this))
        },
        destroy() {
            destroys.forEach(destroy => destroy.call(this))
        }
    }
})
