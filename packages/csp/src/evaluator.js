import { generateEvaluatorFromFunction, shouldAutoEvaluateFunctions } from 'alpinejs/src/evaluator'
import { generateRuntimeFunction } from './parser'
import { closestDataStack, mergeProxies } from 'alpinejs/src/scope'
import { tryCatch } from 'alpinejs/src/utils/error'
import { injectMagics } from 'alpinejs/src/magics'

window.parse = generateRuntimeFunction

export function cspEvaluator(el, expression) {
    let dataStack = generateDataStack(el)

    // Return if the provided expression is already a function...
    if (typeof expression === 'function') {
        return generateEvaluatorFromFunction(dataStack, expression)
    }

    let evaluator = generateEvaluator(el, expression, dataStack)

    return tryCatch.bind(null, el, expression, evaluator)
}

function generateDataStack(el) {
    let overriddenMagics = {}

    injectMagics(overriddenMagics, el)

    return [overriddenMagics, ...closestDataStack(el)]
}

function generateEvaluator(el, expression, dataStack) {
    return (receiver = () => {}, { scope = {}, params = [] } = {}) => {
        let completeScope = mergeProxies([scope, ...dataStack])

        let evaluate = generateRuntimeFunction(expression)

        let returnValue = evaluate(completeScope)
        console.log({ expression, evaluate, returnValue, completeScope, params });

        if (shouldAutoEvaluateFunctions && typeof returnValue === 'function') {
            let nextReturnValue = returnValue()

            if (nextReturnValue instanceof Promise) {
                nextReturnValue.then(i =>  receiver(i))
            } else {
                receiver(nextReturnValue)
            }
        } else if (typeof returnValue === 'object' && returnValue instanceof Promise) {
            returnValue.then(i => receiver(i))
        } else {
            receiver(returnValue)
        }
    }
}

function throwExpressionError(el, expression) {
    console.warn(
`Alpine Error: Alpine is unable to interpret the following expression using the CSP-friendly build:

"${expression}"

Read more about the Alpine's CSP-friendly build restrictions here: https://alpinejs.dev/advanced/csp

`,
el
    )
}
