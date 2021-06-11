import morph from '../src/index.js'

document.addEventListener('alpine:initializing', () => {
    window.Alpine.plugin(morph)
})
