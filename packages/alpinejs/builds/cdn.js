import Alpine from './../src/index.js'

window.Alpine = Alpine

queueMicrotask(() => {
    Alpine.start()
})
