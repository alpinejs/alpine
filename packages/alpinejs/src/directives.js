import { onAttributeRemoved, onElRemoved } from './mutation'
import { evaluate, evaluateLater } from './evaluator'
import { elementBoundEffect } from './reactivity'
import Alpine from './alpine'

let prefixAsString = 'x-'

export function prefix(subject = '') {
    return prefixAsString + subject
}

export function setPrefix(newPrefix) {
    prefixAsString = newPrefix
}

let directiveHandlers = {}

export function directive(name, callback) {
    directiveHandlers[name] = callback
}

export function directives(el, attributes, originalAttributeOverride) {
    let transformedAttributeMap = {}

    let directives = Array.from(attributes)
        .map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName))
        .filter(outNonAlpineAttributes)
        .map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride))
        .sort(byPriority)

    return directives.map(directive => {
        return getDirectiveHandler(el, directive)
    })
}

let isDeferringHandlers = false
let directiveHandlerStack = []

export function deferHandlingDirectives(callback) {
    isDeferringHandlers = true

    let flushHandlers = () => {
        while (directiveHandlerStack.length) directiveHandlerStack.shift()()
    }

    let stopDeferring = () => { isDeferringHandlers = false; flushHandlers() }

    callback(flushHandlers)

    stopDeferring()
}

export function getDirectiveHandler(el, directive) {
    let noop = () => {}

    let handler = directiveHandlers[directive.type] || noop

    let cleanups = []

    let cleanup = callback => cleanups.push(callback)

    let [effect, cleanupEffect] = elementBoundEffect(el)

    cleanups.push(cleanupEffect)

    let utilities = {
        Alpine,
        effect,
        cleanup,
        evaluateLater: evaluateLater.bind(evaluateLater, el),
        evaluate: evaluate.bind(evaluate, el),
    }

    let doCleanup = () => cleanups.forEach(i => i())

    onAttributeRemoved(el, directive.original, doCleanup)

    let fullHandler = () => {
        if (el._x_ignore || el._x_ignoreSelf) return

        handler.inline && handler.inline(el, directive, utilities)

        handler = handler.bind(handler, el, directive, utilities)

        isDeferringHandlers ? directiveHandlerStack.push(handler) : handler()
    }

    fullHandler.runCleanups = doCleanup

    return fullHandler
}

export let startingWith = (subject, replacement) => ({ name, value }) => {
    if (name.startsWith(subject)) name = name.replace(subject, replacement)

    return { name, value }
}

export let into = i => i

function toTransformedAttributes(callback) {
    return ({ name, value }) => {
        let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
            return transform(carry)
        }, { name, value })

        if (newName !== name) callback(newName, name)

        return { name: newName, value: newValue }
    }
}

let attributeTransformers = []

export function mapAttributes(callback) {
    attributeTransformers.push(callback)
}

function outNonAlpineAttributes({ name }) {
    return alpineAttributeRegex().test(name)
}

let alpineAttributeRegex = () => (new RegExp(`^${prefixAsString}([^:^.]+)\\b`))

function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
    return ({ name, value }) => {
        let typeMatch = name.match(alpineAttributeRegex())
        let valueMatch = name.match(/:([a-zA-Z0-9\-:]+)/)
        let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || []
        let original = originalAttributeOverride || transformedAttributeMap[name] || name

        return {
            type: typeMatch ? typeMatch[1] : null,
            value: valueMatch ? valueMatch[1] : null,
            modifiers: modifiers.map(i => i.replace('.', '')),
            expression: value,
            original,
        }
    }
}

const DEFAULT = 'DEFAULT'

let directiveOrder = [
    'ignore',
    'ref',
    'data',
    'bind',
    'init',
    'for',
    'model',
    'transition',
    'show',
    'if',
    DEFAULT,
    'element',
]

function byPriority(a, b) {
    let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type
    let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type

    return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB)
}
