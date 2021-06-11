import persist from '../src/index.js'

document.addEventListener('alpine:initializing', () => {
    window.Alpine.plugin(persist)
})
