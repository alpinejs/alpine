import { evaluateLater } from '../evaluator'
import { addScopeToNode } from '../scope'
import { directive } from '../directives'
import { initTree, destroyTree } from '../lifecycle'
import { mutateDom } from '../mutation'
import { skipDuringClone } from '../clone'
import { warn } from "../utils/warn"

directive('else', (el, { expression }, { effect, cleanup }) => {
    if (el.tagName.toLowerCase() !== 'template') {
        warn('x-else can only be used on a <template> tag', el)
        return
    }

    let prevElement = el.previousElementSibling
    let conditions = []

    // Traverse backwards to find all preceding x-if and x-else-if
    while (prevElement) {
        if (prevElement._x_if || prevElement._x_else_if) {
            conditions.push(evaluateLater(prevElement, prevElement._x_if ? prevElement._x_if.expression : prevElement._x_else_if.expression))
        }
        prevElement = prevElement.previousElementSibling
    }

    if (conditions.length === 0) {
        warn('x-else requires an x-if or x-else-if before it', el)
        return
    }

    let evaluateConditions = (callback) => {
        let index = 0

        let evaluateNext = (value) => {
            if (value) {
                callback(true)
            } else if (index < conditions.length) {
                conditions[index++](evaluateNext)
            } else {
                callback(false)
            }
        }

        evaluateNext(false)
    }


    let show = () => {
        if (el._x_currentElseEl) return el._x_currentElseEl

        let clone = el.content.cloneNode(true).firstElementChild

        addScopeToNode(clone, {}, el)

        mutateDom(() => {
            el.after(clone)
            skipDuringClone(() => initTree(clone))()
        })

        el._x_currentElseEl = clone

        el._x_undoElse = () => {
            mutateDom(() => {
                destroyTree(clone)
                clone.remove()
            })

            delete el._x_currentElseEl
        }

        return clone
    }

    let hide = () => {
        if (!el._x_undoElse) return

        el._x_undoElse()
        delete el._x_undoElse
    }

    effect(() => {
        evaluateConditions(value => {
            if (value) {
                hide()
            } else {
                show()
            }
        })
    })

    cleanup(() => el._x_undoElse && el._x_undoElse())
})
