import Alpine from 'alpinejs/src/alpine'

Alpine.setEvaluator(cspCompliantEvaluator)

import { reactive, effect, stop, toRaw } from '@vue/reactivity'
Alpine.setReactivityEngine({ reactive, effect, release: stop, raw: toRaw })

import 'alpinejs/src/magics/index'
import 'alpinejs/src/directives/index'

import { closestDataStack, mergeProxies } from 'alpinejs/src/scope'
import { injectMagics } from 'alpinejs/src/magics'
import { generateEvaluatorFromFunction, runIfTypeOfFunction } from 'alpinejs/src/evaluator'
import { tryCatch } from 'alpinejs/src/utils/error'

function cspCompliantEvaluator(el, expression) {
    let overriddenMagics = {}

    injectMagics(overriddenMagics, el)

    let dataStack = [overriddenMagics, ...closestDataStack(el)]

    if (typeof expression === 'function') {
        return generateEvaluatorFromFunction(dataStack, expression)
    }

    let evaluator = (receiver = () => {}, { scope = {}, params = [] } = {}) => {
        let completeScope = mergeProxies([scope, ...dataStack])

        if (completeScope[expression] !== undefined) {
            runIfTypeOfFunction(receiver, completeScope[expression], completeScope, params)
        }
   }

    return tryCatch.bind(null, el, expression, evaluator)
}

export default Alpine
