export default function (Alpine) {
    Alpine.magic('debounce', () => {
        let timeoutId
        return (func, wait) => {
            if (typeof func !== 'function') return
            if (typeof wait !== 'number') return
            let later = function () {
                timeoutId = null
                func.apply()
            }
            clearTimeout(timeoutId)
            timeoutId = setTimeout(later, wait)
        }
    })
}
