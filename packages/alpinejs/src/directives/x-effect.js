import { skipDuringClone } from '../clone.js'
import { directive } from '../directives.js'
import { evaluate, evaluateLater } from '../evaluator.js'

directive('effect', skipDuringClone((el, { expression }, { effect }) => {
    effect(evaluateLater(el, expression))
}))
