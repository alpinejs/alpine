
// Thanks @stimulus:
// https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
export function domReady() {
    return new Promise(resolve => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", resolve)
        } else {
            resolve()
        }
    })
}

export function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

export function isTesting() {
    return navigator.userAgent, navigator.userAgent.includes("Node.js")
        || navigator.userAgent.includes("jsdom")
}

export function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase()
}

export function walk(el, callback) {
    if (callback(el) === false) return

    let node = el.firstElementChild

    while (node) {
        walk(node, callback)

        node = node.nextElementSibling
    }
}

export function debounce(func, wait) {
    var timeout
    return function () {
        var context = this, args = arguments
        var later = function () {
            timeout = null
            func.apply(context, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export function saferEval(expression, dataContext, additionalHelperVariables = {}) {
    return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `var result; with($data) { result = ${expression} }; return result`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
    return (new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name)

    const xAttrRE = /x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/

    return xAttrRE.test(name)
}

export function getXAttrs(el, type) {
    return Array.from(el.attributes)
        .filter(isXAttr)
        .map(attr => {
            const name = replaceAtAndColonWithStandardSyntax(attr.name)

            const typeMatch = name.match(/x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/)
            const valueMatch = name.match(/:([a-zA-Z\-:]+)/)
            const modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || []

            return {
                type: typeMatch ? typeMatch[1] : null,
                value: valueMatch ? valueMatch[1] : null,
                modifiers: modifiers.map(i => i.replace('.', '')),
                expression: attr.value,
            }
        })
        .filter(i => {
            // If no type is passed in for filtering, bypassfilter
            if (! type) return true

            return i.type === type
        })
}

export function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
        return name.replace('@', 'x-on:')
    } else if (name.startsWith(':')) {
        return name.replace(':', 'x-bind:')
    }

    return name
}

export function transitionIn(el, callback, forceSkip = false) {
    if (forceSkip) return callback()

    const attrs = getXAttrs(el, 'transition')

    if (attrs.length < 1) return callback()

    const enter = (attrs.find(i => i.value === 'enter') || { expression: '' }).expression.split(' ').filter(i => i !== '')
    const enterStart = (attrs.find(i => i.value === 'enter-start') || { expression: '' }).expression.split(' ').filter(i => i !== '')
    const enterEnd = (attrs.find(i => i.value === 'enter-end') || { expression: '' }).expression.split(' ').filter(i => i !== '')

    transition(el, enter, enterStart, enterEnd, callback, () => {})
}

export function transitionOut(el, callback, forceSkip = false) {
    if (forceSkip) return callback()

    const attrs = getXAttrs(el, 'transition')

    if (attrs.length < 1) return callback()

    const leave = (attrs.find(i => i.value === 'leave') || { expression: '' }).expression.split(' ').filter(i => i !== '')
    const leaveStart = (attrs.find(i => i.value === 'leave-start') || { expression: '' }).expression.split(' ').filter(i => i !== '')
    const leaveEnd = (attrs.find(i => i.value === 'leave-end') || { expression: '' }).expression.split(' ').filter(i => i !== '')

    transition(el, leave, leaveStart, leaveEnd, () => {}, callback)
}

export function transition(el, classesDuring, classesStart, classesEnd, hook1, hook2) {
    const originalClasses = el.__x_original_classes || []
    el.classList.add(...classesStart)
    el.classList.add(...classesDuring)

    requestAnimationFrame(() => {
        const duration = Number(getComputedStyle(el).transitionDuration.replace('s', '')) * 1000

        hook1()

        requestAnimationFrame(() => {
            // Don't remove classes that were in the original class attribute.
            el.classList.remove(...classesStart.filter(i => !originalClasses.includes(i)))
            el.classList.add(...classesEnd)

            setTimeout(() => {
                hook2()

                // Adding an "isConnected" check, in case the callback
                // removed the element from the DOM.
                if (el.isConnected) {
                    el.classList.remove(...classesDuring.filter(i => !originalClasses.includes(i)))
                    el.classList.remove(...classesEnd.filter(i => !originalClasses.includes(i)))
                }
            }, duration);
        })
    });
}
