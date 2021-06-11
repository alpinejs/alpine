
export function setStyles(el, value) {
    if (typeof value === 'object' && value !== null) {
        return setStylesFromObject(el, value)
    }

    return setStylesFromString(el, value)
}

function setStylesFromObject(el, value) {
    let previousStyles = {}

    Object.entries(value).forEach(([key, value]) => {
        previousStyles[key] = el.style[key]

        el.style[key] = value
    })

    setTimeout(() => {
        if (el.style.length === 0) {
            el.removeAttribute('style')
        }
    })

    return () => {
        setStyles(el, previousStyles)
    }
}

function setStylesFromString(el, value) {
    let cache = el.getAttribute('style', value)

    el.setAttribute('style', value)

    return () => {
        el.setAttribute('style', cache)
    }
}
