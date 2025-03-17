import { directive } from '../directives'
import { initTree } from '../lifecycle'
import { mutateDom } from '../mutation'

directive('html', (el, { expression, modifiers }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)

    effect(() => {
        evaluate(value => {
            value = value ?? null;

            if (!modifiers.includes('ignore-nullish') || value !== null) {
                mutateDom(() => {
                    el.innerHTML = value
    
                    el._x_ignoreSelf = true
                    initTree(el)
                    delete el._x_ignoreSelf
                })    
            }
        })
    })
})
