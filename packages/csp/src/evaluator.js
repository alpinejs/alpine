import { generateEvaluatorFromFunction, runIfTypeOfFunction } from 'alpinejs/src/evaluator'
import { closestDataStack, mergeProxies } from 'alpinejs/src/scope'
import { tryCatch } from 'alpinejs/src/utils/error'
import { injectMagics } from 'alpinejs/src/magics'

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

        if (completeScope[expression] === undefined) {
            throwExpressionError(el, expression)
        }

        runIfTypeOfFunction(receiver, completeScope[expression], completeScope, params)
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
