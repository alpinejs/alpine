
let tickStack = []

let isHolding = false

export function nextTick(callback = () => {}, runCallback = true) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks()
    })
  })

  return new Promise((res) => {
    tickStack.push(() => {
        if (runCallback) callback();
        res();
    });
  })
}

export function releaseNextTicks() {
    isHolding = false

    while (tickStack.length) tickStack.shift()()
}

export function holdNextTicks() {
    isHolding = true
}
