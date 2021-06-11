import { evaluateLater } from '../evaluator'
import { setStyles } from '../utils/styles'
import { directive } from '../directives'
import { once } from '../utils/once'

directive('if', (el, { modifiers, expression }, { effect, cleanup }) => {
    let evaluate = evaluateLater(el, expression)

    let show = () => {
        if (el._x_currentIfEl) return el._x_currentIfEl

        let clone = el.content.cloneNode(true).firstElementChild

        el.after(clone)

        el._x_currentIfEl = clone

        el._x_undoIf = () => { clone.remove(); delete el._x_currentIfEl }

        return clone
    }

    let hide = () => el._x_undoIf?.() || delete el._x_undoIf

    effect(() => evaluate(value => {
        value ? show() : hide()
    }))

    cleanup(() => el._x_undoIf && el._x_undoIf())
})
