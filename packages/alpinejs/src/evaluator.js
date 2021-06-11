import { closestDataStack, mergeProxies } from './scope'
import { injectMagics } from './magics'

export function evaluate(el, expression, extras = {}) {
    let result

    evaluateLater(el, expression)(value => result = value, extras)

    return result
}

export function evaluateLater(...args) {
    return theEvaluatorFunction(...args)
}

let theEvaluatorFunction = normalEvaluator

export function setEvaluator(newEvaluator) {
    theEvaluatorFunction = newEvaluator
}

export function normalEvaluator(el, expression) {
    let overriddenMagics = {}

    injectMagics(overriddenMagics, el)

    let dataStack = [overriddenMagics, ...closestDataStack(el)]

    if (typeof expression === 'function') {
        return generateEvaluatorFromFunction(dataStack, expression)
    }

    let evaluator = generateEvaluatorFromString(dataStack, expression)

    return tryCatch.bind(null, el, expression, evaluator)
}

export function generateEvaluatorFromFunction(dataStack, func) {
    return (receiver = () => {}, { scope = {}, params = [] } = {}) => {
        let result = func.apply(mergeProxies([scope, ...dataStack]), params)

        runIfTypeOfFunction(receiver, result)
    }
}

let evaluatorMemo = {}

function generateFunctionFromString(expression) {
    if (evaluatorMemo[expression]) {
        return evaluatorMemo[expression]
    }

    let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

    // Some expressions that are useful in Alpine are not valid as the right side of an expression.
    // Here we'll detect if the expression isn't valid for an assignement and wrap it in a self-
    // calling function so that we don't throw an error AND a "return" statement can b e used.
    let rightSideSafeExpression = 0
        // Support expressions starting with "if" statements like: "if (...) doSomething()"
        || /^[\n\s]*if.*\(.*\)/.test(expression)
        // Support expressions starting with "let/const" like: "let foo = 'bar'"
        || /^(let|const)/.test(expression)
            ? `(() => { ${expression} })()`
            : expression

    let func = new AsyncFunction(['__self', 'scope'], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`)

    evaluatorMemo[expression] = func

    return func
}

function generateEvaluatorFromString(dataStack, expression) {
    let func = generateFunctionFromString(expression)

    return (receiver = () => {}, { scope = {}, params = [] } = {}) => {
        func.result = undefined
        func.finished = false

        // Run the function.

        let completeScope = mergeProxies([ scope, ...dataStack ])

        let promise = func(func, completeScope)

        // Check if the function ran synchronously,
        if (func.finished) {
            // Return the immediate result.
            runIfTypeOfFunction(receiver, func.result, completeScope, params)
        } else {
            // If not, return the result when the promise resolves.
            promise.then(result => {
                runIfTypeOfFunction(receiver, result, completeScope, params)
            })
        }
    }
}

export function runIfTypeOfFunction(receiver, value, scope, params) {
    if (typeof value === 'function') {
        let result = value.apply(scope, params)

        if (result instanceof Promise) {
            result.then(i => runIfTypeOfFunction(receiver, i, scope, params))
        } else {
            receiver(result)
        }
    } else {
        receiver(value)
    }
}

export function tryCatch(el, expression, callback, ...args) {
    try {
        return callback(...args)
    } catch (e) {
        console.warn(`Alpine Expression Error: ${e.message}\n\nExpression: "${expression}"\n\n`, el)

        throw e
    }
}
