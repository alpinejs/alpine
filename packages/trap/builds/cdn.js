import trap from '../src/index.js'

document.addEventListener('alpine:plugin-init', () => {
    window.Alpine.plugin(trap)
})
