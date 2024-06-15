
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

export function mergeProxies (objects) {
    return new Proxy({ objects }, mergeProxyTrap);
}

let mergeProxyTrap = {
    ownKeys({ objects }) {
        return Array.from(
            new Set(objects.flatMap((i) => Object.keys(i)))
        )
    },

    has({ objects }, name) {
        if (name == Symbol.unscopables) return false;

        return objects.some((obj) =>
            Object.prototype.hasOwnProperty.call(obj, name) ||
            Reflect.has(obj, name)
        );
    },

    get({ objects }, name, thisProxy) {
        if (name == "toJSON") return collapseProxies

        return Reflect.get(
            objects.find((obj) =>
                Reflect.has(obj, name)
            ) || {},
            name,
            thisProxy
        )
    },

    set({ objects }, name, value, thisProxy) {
        const target =
            objects.find((obj) =>
                Object.prototype.hasOwnProperty.call(obj, name)
            ) || objects[objects.length - 1];
        const descriptor = Object.getOwnPropertyDescriptor(target, name);
        if (descriptor?.set && descriptor?.get)
            // Can't use Reflect.set here due to [upstream bug](https://github.com/vuejs/core/blob/31abdc8adad569d83b476c340e678c4daa901545/packages/reactivity/src/baseHandlers.ts#L148) in @vue/reactivity
            return descriptor.set.call(thisProxy, value) || true;
        return Reflect.set(target, name, value);
    },
}

function collapseProxies() {
    let keys = Reflect.ownKeys(this)

    return keys.reduce((acc, key) => {
        acc[key] = Reflect.get(this, key)

        return acc;
    }, {})
}
