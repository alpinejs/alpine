import { setReactivityEngine, disableEffectScheduling, reactive, effect, release, raw } from './reactivity'
import { mapAttributes, directive, setPrefix as prefix, prefix as prefixed } from './directives'
import { start, addRootSelector, addInitSelector, closestRoot, initTree } from './lifecycle'
import { mutateDom, deferMutations, flushAndStopDeferringMutations } from './mutation'
import { mergeProxies, closestDataStack, addScopeToNode } from './scope'
import { setEvaluator, evaluate, evaluateLater } from './evaluator'
import { transition } from './directives/x-transition'
import { clone, skipDuringClone } from './clone'
import { interceptor } from './interceptor'
import { debounce } from './utils/debounce'
import { throttle } from './utils/throttle'
import { setStyles } from './utils/styles'
import { nextTick } from './nextTick'
import { plugin } from './plugin'
import { magic } from './magics'
import { store } from './store'
import { data } from './datas'

let Alpine = {
    get reactive() { return reactive },
    get release() { return release },
    get effect() { return effect },
    get raw() { return raw },
    version: ALPINE_VERSION,
    flushAndStopDeferringMutations,
    disableEffectScheduling,
    setReactivityEngine,
    closestDataStack,
    skipDuringClone,
    addRootSelector,
    addInitSelector,
    addScopeToNode,
    deferMutations,
    mapAttributes,
    evaluateLater,
    setEvaluator,
    mergeProxies,
    closestRoot,
    interceptor, // INTERNAL: not public API and is subject to change without major release.
    transition, // INTERNAL
    setStyles, // INTERNAL
    mutateDom,
    directive,
    throttle,
    debounce,
    evaluate,
    initTree,
    nextTick,
    prefixed,
    prefix,
    plugin,
    magic,
    store,
    start,
    clone,
    data,
}

export default Alpine
