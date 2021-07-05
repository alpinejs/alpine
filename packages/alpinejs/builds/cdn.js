import Alpine from './../src/index'

window.Alpine = Alpine

let s
if (!((s = document.currentScript) && s.hasAttribute('no-start'))) {
    queueMicrotask(() => {
        Alpine.start()
    })
}
