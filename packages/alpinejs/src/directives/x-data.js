import { directive, prefix } from '../directives'
import { initInterceptors } from '../interceptor'
import { injectDataProviders } from '../datas'
import { addRootSelector } from '../lifecycle'
import { skipDuringClone } from '../clone'
import { addScopeToNode } from '../scope'
import { injectMagics, magic } from '../magics'
import { reactive } from '../reactivity'
import { evaluate } from '../evaluator'

addRootSelector(() => `[${prefix('data')}]`)

directive('data', skipDuringClone((el, { expression }, { cleanup }) => {
    expression = expression === '' ? '{}' : expression

    let magicContext = {}
    injectMagics(magicContext, el)

    let dataProviderContext = {}
    injectDataProviders(dataProviderContext, magicContext)

    let data = evaluate(el, expression, { scope: dataProviderContext })

    if (data === undefined) data = {}

    injectMagics(data, el)

    let reactiveData = reactive(data)

    initInterceptors(reactiveData)

    let undo = addScopeToNode(el, reactiveData)

    reactiveData['init'] && evaluate(el, reactiveData['init'])

    cleanup(() => {
        undo()

        reactiveData['destroy'] && evaluate(el, reactiveData['destroy'])
    })
}))
