import { directive, prefix } from '../directives'
import { initInterceptors } from '../interceptor'
import { getNamedDataProvider } from '../datas'
import { addRootSelector } from '../lifecycle'
import { skipDuringClone } from '../clone'
import { addScopeToNode } from '../scope'
import { injectMagics } from '../magics'
import { reactive } from '../reactivity'
import { evaluate } from '../evaluator'

addRootSelector(() => `[${prefix('data')}]`)

directive('data', skipDuringClone((el, { expression }, { cleanup }) => {
    expression = expression === '' ? '{}' : expression

    // This returns everything up until the first `(` in the expression,
    // returning the name of the data provider in scenarios where arguments
    // are being passed to the callback.
    const dataProviderName = expression.substr(0, expression.indexOf('(')) || expression

    let dataProvider = getNamedDataProvider(dataProviderName)

    let data = {}

    if (dataProvider) {
        let magics = injectMagics({}, el)
        let args = [];

        // This adds support for passing arguments to `Alpine.data()`
        // callbacks by evaluating the parts inside of `()` as an `[]`
        // expression and then spreading that out to the data provider.
        if (dataProviderName !== '' && expression !== dataProviderName) {
            // Get everything after the first `(` in expression and remove the final character,
            // which should be the closing `)`.
            const argsString = expression.substring(expression.indexOf('(') + 1).slice(0, -1)

            args = evaluate(el, `[${argsString}]`)
        }

        data = dataProvider.bind(magics)(...args)
    } else {
        data = evaluate(el, expression)
    }

    injectMagics(data, el)

    let reactiveData = reactive(data)

    initInterceptors(reactiveData)

    let undo = addScopeToNode(el, reactiveData)

    if (reactiveData['init']) reactiveData['init']()

    cleanup(() => {
        undo()

        reactiveData['destroy'] && reactiveData['destroy']()
    })
}))
