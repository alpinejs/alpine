import { directive } from '../directives'

directive('html', (el, { expression }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)

    effect(() => {
        evaluate(value => {
            el.innerHTML = value
        })
    })
})
