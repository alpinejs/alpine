import Alpine from './../src/index'

window.Alpine = Alpine

queueMicrotask(() => {
    Alpine.start()
})
