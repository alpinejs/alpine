import { evaluateLater } from '../evaluator'
import { addScopeToNode } from '../scope'
import { directive } from '../directives'
import { initTree, destroyTree } from '../lifecycle'
import { mutateDom } from '../mutation'
import { skipDuringClone } from '../clone'
import { warn } from "../utils/warn"

directive('else-if', (el, { expression }, { effect, cleanup }) => {
    if (el.tagName.toLowerCase() !== 'template') {
        warn('x-else-if can only be used on a <template> tag', el)
        return
    }

    el._x_else_if = { expression }
    let prevElement = el.previousElementSibling

    // Traverse backward to find a preceding x-if or x-else-if
    while (prevElement && !prevElement._x_if && !prevElement._x_else_if) {
        prevElement = prevElement.previousElementSibling
    }

    if (!prevElement || (!prevElement._x_if && !prevElement._x_else_if)) {
        warn('x-else-if requires an x-if or x-else-if before it', el)
        return
    }

    let evaluate = evaluateLater(el, expression)

    let show = () => {
        if (el._x_currentElseIfEl) return el._x_currentElseIfEl

        let clone = el.content.cloneNode(true).firstElementChild

        addScopeToNode(clone, {}, el)

        mutateDom(() => {
            el.after(clone)
            skipDuringClone(() => initTree(clone))()
        })

        el._x_currentElseIfEl = clone

        el._x_undoElseIf = () => {
            mutateDom(() => {
                destroyTree(clone)
                clone.remove()
            })

            delete el._x_currentElseIfEl
        }

        return clone
    }

    let hide = () => {
        if (!el._x_undoElseIf) return

        el._x_undoElseIf()
        delete el._x_undoElseIf
    }

    effect(() => {
        // Determine if any preceding condition is true
        let prevConditionsSatisfied = prevElement._x_ifSatisfied || prevElement._x_elseIfSatisfied

        evaluate(value => {
            if (prevConditionsSatisfied) {
                hide()
            } else if (value) {
                show()
                el._x_elseIfSatisfied = true
            } else {
                hide()
                el._x_elseIfSatisfied = false
            }
        })
    })

    cleanup(() => el._x_undoElseIf && el._x_undoElseIf())
})
