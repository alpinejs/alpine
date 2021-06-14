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

    let dataProvider = getNamedDataProvider(expression)

    let data = {}

    if (dataProvider) {
        let magics = injectMagics({}, el)

        data = dataProvider.bind(magics)()
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
