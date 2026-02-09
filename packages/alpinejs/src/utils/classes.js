
export function setClasses(el, value) {
    if (Array.isArray(value)) {
        return setClassesFromString(el, value.join(' '))
    } else if (typeof value === 'object' && value !== null) {
        return setClassesFromObject(el, value)
    } else if (typeof value === 'function') {
        return setClasses(el, value())
    }

    return setClassesFromString(el, value)
}

function splitClasses(classString) {
    return classString.split(/\s/).filter(Boolean)
}

function setClassesFromString(el, classString) {
    let missingClasses = classString => splitClasses(classString).filter(i => ! el.classList.contains(i)).filter(Boolean)

    let addClassesAndReturnUndo = classes => {
        el.classList.add(...classes)

        return () => { el.classList.remove(...classes) }
    }

    // This is to allow short-circuit expressions like: :class="show || 'hidden'" && "show && 'block'"
    classString = (classString === true) ? classString = '' : (classString || '')

    return addClassesAndReturnUndo(missingClasses(classString))
}

function setClassesFromObject(el, classObject) {
    let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? splitClasses(classString) : false).filter(Boolean)
    let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => ! bool ? splitClasses(classString) : false).filter(Boolean)

    let added = []
    let removed = []

    forRemove.forEach(i => {
        if (el.classList.contains(i)) {
            el.classList.remove(i)
            removed.push(i)
        }
    })

    forAdd.forEach(i => {
        if (! el.classList.contains(i)) {
            el.classList.add(i)
            added.push(i)
        }
    })

    return () => {
        removed.forEach(i => el.classList.add(i))
        added.forEach(i => el.classList.remove(i))
    }
}
