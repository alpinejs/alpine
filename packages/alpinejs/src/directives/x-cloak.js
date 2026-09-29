import { directive, prefix } from '../directives'
import { mutateDom } from '../mutation'
import { isCloning } from '../clone'

directive('cloak', el => {
    // When morph seeds incoming HTML, strip x-cloak right away so it
    // isn't patched back onto the live element, hiding it mid-morph...
    if (isCloning) return el.removeAttribute(prefix('cloak'))

    queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix('cloak'))))
})
