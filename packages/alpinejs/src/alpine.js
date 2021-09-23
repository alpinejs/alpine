import { setReactivityEngine, disableEffectScheduling, reactive, effect, release, raw } from './reactivity'
import { mutateDom, deferMutations, flushAndStopDeferringMutations } from './mutation'
import { mapAttributes, directive, setPrefix as prefix } from './directives'
import { start, addRootSelector, closestRoot, initTree } from './lifecycle'
import { setEvaluator, evaluate, evaluateLater } from './evaluator'
import { interceptor } from './interceptor'
import { debounce } from './utils/debounce'
import { throttle } from './utils/throttle'
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
    flushAndStopDeferringMutations,
    disableEffectScheduling,
    setReactivityEngine,
    addRootSelector,
    deferMutations,
    mapAttributes,
    evaluateLater,
    setEvaluator,
    closestRoot,
    // Warning: interceptor is not public API and is subject to change without major release.
    interceptor,
    mutateDom,
    directive,
    throttle,
    debounce,
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
