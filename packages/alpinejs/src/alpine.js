import { setReactivityEngine, disableEffectScheduling, reactive, effect, release, raw } from './reactivity'
import { mapAttributes, directive, setPrefix as prefix } from './directives'
import { setEvaluator, evaluate, evaluateLater } from './evaluator'
import { start, addRootSelector, closestRoot, initTree } from './lifecycle'
import { interceptor } from './interceptor'
import { mutateDom } from './mutation'
import { nextTick } from './nextTick'
import { plugin } from './plugin'
import { magic } from './magics'
import { store } from './store'
import { clone } from './clone'
import { data } from './datas'

let Alpine = {
    get reactive() { return reactive },
    get release() { return release },
    get effect() { return effect },
    get raw() { return raw },
    version: ALPINE_VERSION,
    disableEffectScheduling,
    setReactivityEngine,
    addRootSelector,
    mapAttributes,
    evaluateLater,
    setEvaluator,
    closestRoot,
    // Warning: interceptor is not public API and is subject to change without major release.
    interceptor,
    mutateDom,
    directive,
    evaluate,
    initTree,
    nextTick,
    prefix,
    plugin,
    magic,
    store,
    start,
    clone,
    data,
}

export default Alpine
