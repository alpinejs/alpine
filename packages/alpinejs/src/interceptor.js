export function initInterceptors(data) {
    let isObject = val => typeof val === 'object' && !Array.isArray(val) && val !== null

    let recurse = (obj, basePath = '') => {
        Object.entries(obj).forEach(([key, value]) => {
            let path = basePath === '' ? key : `${basePath}.${key}`

            if (typeof value === 'function' && value.interceptor) {
                let result = value(key, path)

                Object.defineProperty(obj, key, result[0])
            }

            if (isObject(value)) {
                recurse(value, path)
            }
        })
    }

    return recurse(data)
}

export function interceptor(callback, mutateFunc = () => {}) {
    return initialValue => {
        function func(key, path) {
            let parentFunc = func.parent
                ? func.parent
                : (key, path) => ([{}, { initer() {}, setter() {} }])

            let [parentNoop, { initer: parentIniter, setter: parentSetter, initialValue: parentInitialValue }] = parentFunc(key, path)

            let store = parentInitialValue === undefined ? initialValue : parentInitialValue

            let { init: initer, set: setter } = callback(key, path)

            let inited = false

            let setValue = i => store = i
            let reactiveSetValue = function (i) { this[key] = i }

            let setup = (context) => {
                if (inited) return

                parentIniter.bind(context)(store, setValue, reactiveSetValue.bind(context))
                initer.bind(context)(store, setValue, reactiveSetValue.bind(context))

                inited = true
            }

            return [{
                get() {
                    setup(this)

                    return store
                },
                set(value) {
                    setup(this)

                    parentSetter.bind(this)(value, setValue, reactiveSetValue.bind(this))
                    setter.bind(this)(value, setValue, reactiveSetValue.bind(this))
                },
                enumerable: true,
                configurable: true,
            }, { initer, setter, initialValue }]
        }

        func.interceptor = true

        mutateFunc(func)

        if (typeof initialValue === 'function' && initialValue.interceptor) {
            func.parent = initialValue
        }

        return func
    }
}
