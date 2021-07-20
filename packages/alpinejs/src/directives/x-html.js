import {directive} from '../directives'
import {nextTick} from "../nextTick"

directive('html', (el, { expression }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)

    effect(() => {
        evaluate(value => {
            nextTick(() => {
                el.innerHTML = value
            })
        })
    })
})
