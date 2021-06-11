import { evaluateLater } from '../evaluator'
import { directive } from '../directives'
import { mutateDom } from '../mutation'

directive('text', (el, { expression }, { effect, cleanup }) => {
    let evaluate = evaluateLater(el, expression)

    effect(() => {
        evaluate(value => {
            mutateDom(() => {
                el.textContent = value
            })
        })
    })
})
