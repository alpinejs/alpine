import { evaluateLater } from '../evaluator'
import { directive } from '../directives'
import { mutateDom } from '../mutation'
import { once } from '../utils/once'

directive('show', (el, { modifiers, expression }, { effect }) => {
    let evaluate = evaluateLater(el, expression)

    let hide = () => mutateDom(() => {
        el.style.display = 'none'

        el._x_is_shown = false
    })

    let show = () => mutateDom(() => {
        if (el.style.length === 1 && el.style.display === 'none') {
            el.removeAttribute('style')
        } else {
            el.style.removeProperty('display')
        }

        el._x_is_shown = true
    })

    // We are wrapping this function in a setTimeout here to prevent
    // a race condition from happening where elements that have a
    // @click.away always view themselves as shown on the page.
    let clickAwayCompatibleShow = () => setTimeout(show)

    let toggle = once(
        value => value ? show() : hide(),
        value => {
            if (typeof el._x_toggleAndCascadeWithTransitions === 'function') {
                el._x_toggleAndCascadeWithTransitions(el, value, show, hide)
            } else {
                value ? clickAwayCompatibleShow() : hide()
            }
        }
    )

    effect(() => evaluate(value => {
        if (modifiers.includes('immediate')) value ? clickAwayCompatibleShow() : hide()

        toggle(value)
    }))
})
