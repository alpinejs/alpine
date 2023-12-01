
export default function (Alpine) {
    Alpine.signal = signal
    Alpine.switchboard = switchboard

    Alpine.magic('signal', el => initial => {
        return signal(initial)
    })

    let vueEngine = Alpine.engine

    Alpine.setReactivityEngine({
        reactive: vueEngine.reactive,

        effect: (callback, options) => {
            let signalRef

            let ref = vueEngine.effect(() => {
                signalRef = signalEffect(() => {
                    callback()
                })
            }, options)

            ref.__signalEffect = signalRef

            return ref
        },

        release: (effectReference) => {
            if (effectReference.__signalEffect) {
                signalRelease(effectReference.__signalEffect)
            }

            return vueEngine.release(effectReference)
        },

        raw: Alpine.raw,
    })
}

let activeEffect = null;
const effectsMap = new WeakMap(); // To keep track of which signals an effect is subscribed to

export function signal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    let signalFunction = function(newValue) {
        if (arguments.length === 0) {
            if (activeEffect) {
                subscribers.add(activeEffect);
                let effects = effectsMap.get(activeEffect) || new Set();
                effects.add(subscribers);
                effectsMap.set(activeEffect, effects);
            }
            return value;
        } else {
            value = newValue;
            subscribers.forEach(subscriber => subscriber());
        }
    };

    Object.defineProperty(signalFunction, 'value', {
        get: function() {
            return value
        },
        set: function(newValue) {
            value = newValue
        }
    })

    // Ignore this inside Vue reactivity...
    signalFunction.__v_skip = true

    return signalFunction;
}

export function signalEffect(callback) {
    const effectFn = () => {
        activeEffect = effectFn;
        callback();
        activeEffect = null;
    };
    effectFn();
    return effectFn;
}

export function signalRelease(effectFn) {
    const subscribedSignals = effectsMap.get(effectFn);
    if (subscribedSignals) {
        subscribedSignals.forEach(subscribers => {
            subscribers.delete(effectFn);
        });
    }
    effectsMap.delete(effectFn);
}

function switchboard(value) {
    let lookup = {}

    let current

    let func = function (newValue) {
        if (arguments.length === 0) {
            return current
        } else {
            if (newValue === current) return

            if (current !== undefined) lookup[current](false)

            current = newValue

            if (lookup[newValue] === undefined) {
                lookup[newValue] = signal(true)
            } else {
                lookup[newValue](true)
            }
        }
    }

    func.matches = (comparisonValue) => {
        if (lookup[comparisonValue] === undefined) {
            lookup[comparisonValue] = signal(false)
            return lookup[comparisonValue]()
        }

        return !! lookup[comparisonValue]()
    }

    Object.defineProperty(func, 'value', {
        get: function() {
            return current
        },
        set: function(newValue) {
            throw 'havent implemented this yet'
        }
    })

    value === undefined || func(value)

    return func
}

