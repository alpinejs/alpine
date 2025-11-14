import { generateEvaluatorFromFunction, shouldAutoEvaluateFunctions } from 'alpinejs/src/evaluator'
import { closestDataStack, mergeProxies } from 'alpinejs/src/scope'
import { handleError, tryCatch } from 'alpinejs/src/utils/error'
import { generateRuntimeFunction } from './parser'
import { injectMagics } from 'alpinejs/src/magics'

export function cspEvaluator(el, expression) {
    let dataStack = generateDataStack(el)

    // Return if the provided expression is already a function...
    if (typeof expression === 'function') {
        return generateEvaluatorFromFunction(dataStack, expression)
    }

    if (el instanceof HTMLIFrameElement) {
        handleError(new Error('Evaluating expressions on an iframe is prohibited in the CSP build'), el)

        return;
    }

    if (el instanceof HTMLScriptElement) {
        handleError(new Error('Evaluating expressions on a script is prohibited in the CSP build'), el)

        return;
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

        let returnValue = evaluate({
            scope: completeScope,
            forceBindingRootScopeToFunctions: true,
        })

        if (shouldAutoEvaluateFunctions && typeof returnValue === 'function') {
            let nextReturnValue = returnValue.apply(returnValue, params)

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
