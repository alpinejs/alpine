import { evaluateLater } from '../evaluator'
import { addScopeToNode } from '../scope'
import { directive } from '../directives'
import { initTree, destroyTree } from '../lifecycle'
import { mutateDom } from '../mutation'
import { warn } from "../utils/warn"
import { skipDuringClone } from '../clone'

directive('if', (el, { expression }, { effect, cleanup }) => {
    if (el.tagName.toLowerCase() !== 'template') warn('x-if can only be used on a <template> tag', el)

    el._x_if = { expression }

    let evaluate = evaluateLater(el, expression)

    let show = () => {
        if (el._x_currentIfEl) return el._x_currentIfEl

        let clone = el.content.cloneNode(true).firstElementChild

        addScopeToNode(clone, {}, el)

        mutateDom(() => {
            el.after(clone)

            // These nodes will be "inited" as morph walks the tree...
            skipDuringClone(() => initTree(clone))()
        })

        el._x_currentIfEl = clone

        el._x_undoIf = () => {
            mutateDom(() => {
                destroyTree(clone)

                clone.remove()
            })

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
        if (value) {
            show()
            el._x_ifSatisfied = true
        } else {
            hide()
            el._x_ifSatisfied = false
        }
    }))

    cleanup(() => el._x_undoIf && el._x_undoIf())
})
