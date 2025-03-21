import { directive } from '../directives.js'
import { mutateDom } from '../mutation.js'

directive('text', (el, { expression }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)

    effect(() => {
        evaluate(value => {
            mutateDom(() => {
                el.textContent = value
            })
        })
    })
})
