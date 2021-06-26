import { evaluateLater } from '../evaluator'
import { directive } from '../directives'
import { mutateDom } from '../mutation'

directive('html', (el, { expression }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)

    effect(() => {
        evaluate(value => {
            el.innerHTML = value
        })
    })
})
