import { directive } from '../directives'
import { mutateDom } from '../mutation'

directive('text', (el, { modifiers, expression }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)
    let skippedFirstTime;

    effect(() => {
        evaluate(value => {
            if (modifiers.includes('ssr') && !skippedFirstTime) return skippedFirstTime = true;
            mutateDom(() => {
                el.textContent = value
            })
        })
    })
})
