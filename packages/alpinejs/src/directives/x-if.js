import { evaluateLater } from '../evaluator'
import { addScopeToNode } from '../scope'
import { directive } from '../directives'
import { initTree } from '../lifecycle'
import { mutateDom } from '../mutation'
import { walk } from "../utils/walk"
import { dequeueJob } from '../scheduler'
import { warn } from "../utils/warn"

directive('if', (el, { expression }, { effect, cleanup }) => {
    if (el.tagName.toLowerCase() !== 'template') warn('x-if can only be used on a <template> tag', el)

    let evaluate = evaluateLater(el, expression)

    let show = () => {
        if (el._x_currentIfEl) return el._x_currentIfEl

        let clone = el.content.cloneNode(true).firstElementChild

        addScopeToNode(clone, {}, el)

        mutateDom(() => {
            el.after(clone)

            initTree(clone)
        })

        el._x_currentIfEl = clone

        el._x_undoIf = () => {
            walk(clone, (node) => {
                if (!!node._x_effects) {
                    node._x_effects.forEach(dequeueJob)
                }
            })
            
            clone.remove();

            delete el._x_currentIfEl
        }

        return clone
    }

    let hide = () => {
        if (! el._x_undoIf) return

        el._x_undoIf()

        delete el._x_undoIf
    }

    effect(() => evaluate(value => {
        value ? show() : hide()
    }))

    cleanup(() => el._x_undoIf && el._x_undoIf())
})
