import portal from '../src/index.js'

document.addEventListener('alpine:plugin-init', () => {
    window.Alpine.plugin(portal)
})
