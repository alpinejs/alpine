
export function createElement(html) {
    const template = document.createElement('template')
    template.innerHTML = html
    return template.content.firstElementChild
}

export function textOrComment(el) {
    return el.nodeType === 3
        || el.nodeType === 8
}

export let dom = {
    replace(children, old, replacement) {
        let index = children.indexOf(old)

        if (index === -1) throw 'Cant find element in children'

        old.replaceWith(replacement)

        children[index] = replacement

        return children
    },
    before(children, reference, subject) {
        let index = children.indexOf(reference)

        if (index === -1) throw 'Cant find element in children'

        reference.before(subject)

        children.splice(index, 0, subject)

        return children
    },
    append(children, subject, appendFn) {
        let last = children[children.length - 1]

        appendFn(subject)

        children.push(subject)

        return children
    },
    remove(children, subject) {
        let index = children.indexOf(subject)

        if (index === -1) throw 'Cant find element in children'

        subject.remove()

        return children.filter(i => i !== subject)
    },
    first(children) {
        return this.teleportTo(children[0])
    },
    next(children, reference) {
        let index = children.indexOf(reference)

        if (index === -1) return

        return this.teleportTo(this.teleportBack(children[index + 1]))
    },
    teleportTo(el) {
        if (! el) return el
        if (el._x_teleport) return el._x_teleport
        return el
    },
    teleportBack(el) {
        if (! el) return el
        if (el._x_teleportBack) return el._x_teleportBack
        return el
    }
}

