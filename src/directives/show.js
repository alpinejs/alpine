import { transitionIn, transitionOut } from '../utils'

export function handleShowDirective(el, value, initialUpdate = false) {
    if (! value) {
        transitionOut(el, () => {
            el.style.display = 'none'
        }, initialUpdate)
    } else {
        transitionIn(el, () => {
            if (el.style.length === 1 && el.style.display !== '') {
                el.removeAttribute('style')
            } else {
                el.style.removeProperty('display')
            }
        }, initialUpdate)
    }
}
