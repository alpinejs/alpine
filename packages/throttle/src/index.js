export default function (Alpine) {
    Alpine.throttling = Alpine.reactive({ on: false })

    Alpine.magic('throttle', (el, { Alpine }) => {
        return (func, limit) => {
            if (typeof func !== 'function') return
            if (typeof limit !== 'number') return
            if (!Alpine.throttling.on) {
                func.apply()
                Alpine.throttling.on = true;
                setTimeout(() => (Alpine.throttling.on = false), limit)
            }
        }
    })
}
