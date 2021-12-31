import history from '../src/index.js'

document.addEventListener('alpine:plugin-init', () => {
    window.Alpine.plugin(history)
})
