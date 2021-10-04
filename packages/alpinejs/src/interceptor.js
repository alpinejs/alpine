// Warning: The concept of "interceptors" in Alpine is not public API and is subject to change
// without tagging a major release.

export function initInterceptors(data) {
    let isObject = val => typeof val === 'object' && !Array.isArray(val) && val !== null

    let recurse = (obj, basePath = '') => {
        Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
            // Skip getters.
            if (enumerable === false || value === undefined) return

            let path = basePath === '' ? key : `${basePath}.${key}`

            if (typeof value === 'object' && value !== null && value._x_interceptor) {
                obj[key] = value.initialize(data, path, key)
            } else {
                if (isObject(value) && value !== obj && ! (value instanceof Element)) {
                    recurse(value, path)
                }
            }
        })
    }

    return recurse(data)
}

export function interceptor(callback, mutateObj = () => {}) {
    let obj = {
        initialValue: undefined,

        _x_interceptor: true,

        initialize(data, path, key) {
            return callback(this.initialValue, () => get(data, path), (value) => set(data, path, value), path, key)
        }
    }

    mutateObj(obj)

    return initialValue => {
        if (typeof initialValue === 'object' && initialValue !== null && initialValue._x_interceptor) {
            // Support nesting interceptors.
            let initialize = obj.initialize.bind(obj)

            obj.initialize = (data, path, key) => {
                let innerValue = initialValue.initialize(data, path, key)

                obj.initialValue = innerValue

                return initialize(data, path, key)
            }
        } else {
            obj.initialValue = initialValue
        }

        return obj
    }
}

function get(obj, path) {
    return path.split('.').reduce((carry, segment) => carry[segment], obj)
}

function set(obj, path, value) {
    if (typeof path === 'string') path = path.split('.')

    if (path.length === 1) obj[path[0]] = value;
       else if (path.length === 0) throw error;
    else {
       if (obj[path[0]])
          return set(obj[path[0]], path.slice(1), value);
       else {
          obj[path[0]] = {};
          return set(obj[path[0]], path.slice(1), value);
       }
    }
}
