class DomManager {
    el = undefined

    constructor(el) {
        this.el = el
    }

    traversals = {
        'first': 'firstElementChild',
        'next': 'nextElementSibling',
        'parent': 'parentElement',
    }

    nodes() {
        this.traversals = {
            'first': 'firstChild',
            'next': 'nextSibling',
            'parent': 'parentNode',
        }; return this
    }

    first() {
        return this.teleportTo(this.el[this.traversals['first']])
    }

    next() {
        return this.teleportTo(this.teleportBack(this.el[this.traversals['next']]))
    }

    before(insertee) {
        this.el[this.traversals['parent']].insertBefore(insertee, this.el); return insertee
    }

    replace(replacement) {
        this.el[this.traversals['parent']].replaceChild(replacement, this.el); return replacement
    }

    append(appendee) {
        this.el.appendChild(appendee); return appendee
    }

    teleportTo(el) {
        if (! el) return el
        if (el._x_teleport) return el._x_teleport
        return el
    }

    teleportBack(el) {
        if (! el) return el
        if (el._x_teleportBack) return el._x_teleportBack
        return el
    }
}

export function dom(el) {
    return new DomManager(el)
}

export function createElement(html) {
    const template = document.createElement('template')
    template.innerHTML = html
    return template.content.firstElementChild
}

export function textOrComment(el) {
    return el.nodeType === 3
        || el.nodeType === 8
}
