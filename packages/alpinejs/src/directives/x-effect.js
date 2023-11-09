import { skipDuringClone } from '../clone'
import { directive } from '../directives'
import { evaluate, evaluateLater } from '../evaluator'

directive('effect', skipDuringClone((el, { expression }, { effect }) => {
    effect(evaluateLater(el, expression))
}))
