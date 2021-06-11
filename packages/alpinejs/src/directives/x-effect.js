import { directive } from '../directives'
import { evaluateLater } from '../evaluator'

directive('effect', (el, { expression }, { effect }) => effect(evaluateLater(el, expression)))
