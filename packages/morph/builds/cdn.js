import morph from '../src/index.js'

document.addEventListener('alpine:plugin-init', () => {
    window.Alpine.plugin(morph)
})
