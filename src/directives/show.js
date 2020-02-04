import { transitionIn, transitionOut } from '../utils'

export function handleShowDirective(el, value, initialUpdate = false) {
    if (! value) {
        if ( el.style.display !== 'none' ) {
            transitionOut(el, () => {
                el.style.display = 'none'
            }, initialUpdate)
        }
    } else {
        if ( el.style.display !== '' ) {
            transitionIn(el, () => {
                if (el.style.length === 1) {
                    el.removeAttribute('style')
                } else {
                    el.style.removeProperty('display')
                }
            }, initialUpdate)
        }
    }
}
