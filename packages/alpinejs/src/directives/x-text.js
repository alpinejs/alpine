import { directive } from '../directives'
import { mutateDom } from '../mutation'

directive('text', (el, { expression, modifiers }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)

    effect(() => {
        evaluate(value => {
            value = value ?? null;

            if (!modifiers.includes('ignore-nullish') || value !== null) {
                mutateDom(() => {
                    el.textContent = value
                })    
            }
        })
    })
})
