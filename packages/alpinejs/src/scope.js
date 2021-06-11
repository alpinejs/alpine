
export function scope(node) {
    return mergeProxies(closestDataStack(node))
}

export function addScopeToNode(node, data, referenceNode) {
    node._x_dataStack = [data, ...closestDataStack(referenceNode || node)]

    return () => {
        node._x_dataStack = node._x_dataStack.filter(i => i !== data)
    }
}

export function hasScope(node) {
    return !! node._x_dataStack
}

export function refreshScope(element, scope) {
    let existingScope = element._x_dataStack[0]

    Object.entries(scope).forEach(([key, value]) => {
        existingScope[key] = value
    })
}

export function closestDataStack(node) {
    if (node._x_dataStack) return node._x_dataStack

    if (node instanceof ShadowRoot) {
        return closestDataStack(node.host)
    }

    if (! node.parentNode) {
        return []
    }

    return closestDataStack(node.parentNode)
}

export function closestDataProxy(el) {
    return mergeProxies(closestDataStack(el))
}

export function mergeProxies(objects) {
    return new Proxy({}, {
        ownKeys: () => {
            return Array.from(new Set(objects.flatMap(i => Object.keys(i))))
        },

        has: (target, name) => {
            return objects.some(obj => obj.hasOwnProperty(name))
        },

        get: (target, name) => {
            return (objects.find(obj => obj.hasOwnProperty(name)) || {})[name]
        },

        set: (target, name, value) => {
            let closestObjectWithKey = objects.find(obj => obj.hasOwnProperty(name))

            if (closestObjectWithKey) {
                closestObjectWithKey[name] = value
            } else {
                objects[objects.length - 1][name] = value
            }

            return true
        },
    })
}
