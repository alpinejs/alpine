
let tickStack = []

let isHolding = false

export function nextTick(callback) {
    tickStack.push(callback)

    queueMicrotask(() => {
        isHolding || setTimeout(() => {
            releaseNextTicks()
        })
    })
}

export function releaseNextTicks() {
    isHolding = false

    while (tickStack.length) tickStack.shift()()
}

export function holdNextTicks() {
    isHolding = true
}
