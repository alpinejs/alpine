
export function debounce(func, wait) {
    var timeout

    return function() {
        var context = this, args = arguments

        var later = function () {
            timeout = null

            func.apply(context, args)
        }

        clearTimeout(timeout)

        timeout = setTimeout(later, wait)
    }
}
