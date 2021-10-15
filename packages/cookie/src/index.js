
export default function (Alpine) {
    Alpine.magic('cookie', (el, { interceptor }) => {
        let alias
        let attributes

        return interceptor((initialValue, getter, setter, path, key) => {
            let lookup = alias || `_x_${path}`

            let initial = cookieGet(lookup) || initialValue

            setter(initial)

            Alpine.effect(() => {
                let value = getter()

                if (value === null) cookiePop(lookup, attributes)
                if (value) cookieSet(lookup, value, attributes)

                setter(value)
            })

            return initial
        }, func => {
            func.as = key => { alias = key; return func },
            func.using = options => { attributes = options; return func }
        })
    })
}

function cookieSet(key, value, attributes) {

    function cookieWrap (value) {
        return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent)
    }

    attributes = Object.assign({}, attributes)

    if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (Object.prototype.toString.call(attributes.expires) === '[object Date]') {
        attributes.expires = attributes.expires.toUTCString()
    }

    key = encodeURIComponent(key)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape)

    let stringifiedAttributes = ''
    for (let u in attributes) {
        if (!attributes[u]) continue
        stringifiedAttributes += `; ${u}`
        if (attributes[u] === true) continue
        stringifiedAttributes += `=${attributes[u].split(';')[0]}`
    }

    return document.cookie = `${key}=${cookieWrap(value, key)}${stringifiedAttributes}`
}

function cookieGet(key) {
    if (arguments.length && !key) return

    function cookieUnwrap(value) {
        if (value[0] === '"') value = value.slice(1,-1)
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    }

    let cookies = document.cookie ? document.cookie.split('; ') : []
    let cookieJar = {}

    for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=')
        var value = parts.slice(1).join('=')
        try {
            var found = decodeURIComponent(parts[0])
            cookieJar[found] = cookieUnwrap(value, found)
            if (key === found) break
        } catch (e) {}
    }

    return key ? cookieJar[key] : null
}

function cookiePop(key, attributes) {
    cookieSet(key, '', Object.assign({}, attributes, { expires: -1 }))
}
