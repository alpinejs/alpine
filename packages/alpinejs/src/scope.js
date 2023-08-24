
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

export function closestDataStack(node) {
    if (node._x_dataStack) return node._x_dataStack

    if (typeof ShadowRoot === 'function' && node instanceof ShadowRoot) {
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

function collapseProxies() {
    const keys = Reflect.ownKeys(this);
    const collapsed = keys.reduce((acc, key) => {
        console.log(key);
        acc[key] = Reflect.get(this, key);
        return acc;
    }, {});
    return collapsed;
}

export function mergeProxies(objects) {
    let thisProxy = new Proxy({}, {
        ownKeys: () => {
            return Array.from(new Set(objects.flatMap(i => Object.keys(i))))
        },

        has: (target, name) => {
            if (name == Symbol.unscopables) return false;
            return objects.some(obj => obj.hasOwnProperty(name))
        },

        get: (target, name) => {
            if (name == "toJSON") return collapseProxies;
            return Reflect.get(
                objects.find((obj) =>
                    Object.prototype.hasOwnProperty.call(obj, name)
                ) ?? {},
                name,
                thisProxy
            );
        },

        set: (target, name, value) => {
            return Reflect.set(
                objects.find((obj) =>
                    Object.prototype.hasOwnProperty.call(obj, name)
                ) ?? objects[objects.length-1],
                name,
                value
            );
        },
    })

    return thisProxy
}
