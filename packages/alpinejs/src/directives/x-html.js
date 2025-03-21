import { directive } from '../directives.js'
import { initTree } from '../lifecycle.js'
import { mutateDom } from '../mutation.js'

directive('html', (el, { expression }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)

    effect(() => {
        evaluate(value => {
            mutateDom(() => {
                el.innerHTML = value

                el._x_ignoreSelf = true
                initTree(el)
                delete el._x_ignoreSelf
            })
        })
    })
})
