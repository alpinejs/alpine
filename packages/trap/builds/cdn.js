import trap from '../src/index.js'

document.addEventListener('alpine:initializing', () => {
    window.Alpine.plugin(trap)
})
