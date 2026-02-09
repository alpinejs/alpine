import { setReactivityEngine, disableEffectScheduling, reactive, effect, release, raw, watch, transaction } from './reactivity'
import { mapAttributes, directive, setPrefix as prefix, prefix as prefixed } from './directives'
import { start, addRootSelector, addInitSelector, closestRoot, findClosest, initTree, destroyTree, interceptInit } from './lifecycle'
import { onElRemoved, onAttributeRemoved, onAttributesAdded, mutateDom, deferMutations, flushAndStopDeferringMutations, startObservingMutations, stopObservingMutations } from './mutation'
import { mergeProxies, closestDataStack, addScopeToNode, scope as $data } from './scope'
import { setEvaluator, setRawEvaluator, evaluate, evaluateLater, dontAutoEvaluateFunctions, evaluateRaw } from './evaluator'
import { transition } from './directives/x-transition'
import { clone, cloneNode, skipDuringClone, onlyDuringClone, interceptClone } from './clone'
import { interceptor, initInterceptors } from './interceptor'
import { getBinding as bound, extractProp } from './utils/bind'
import { setErrorHandler } from './utils/error'
import { debounce } from './utils/debounce'
import { throttle } from './utils/throttle'
import { setStyles } from './utils/styles'
import { entangle } from './entangle'
import { nextTick } from './nextTick'
import { walk } from './utils/walk'
import { plugin } from './plugin'
import { magic, injectMagics } from './magics'
import { store } from './store'
import { bind } from './binds'
import { data } from './datas'

let Alpine = {
    get reactive() { return reactive },
    get release() { return release },
    get effect() { return effect },
    get raw() { return raw },
    get transaction() { return transaction },
    version: ALPINE_VERSION,
    flushAndStopDeferringMutations,
    dontAutoEvaluateFunctions,
    disableEffectScheduling,
    startObservingMutations,
    stopObservingMutations,
    setReactivityEngine,
    onAttributeRemoved,
    onAttributesAdded,
    closestDataStack,
    skipDuringClone,
    onlyDuringClone,
    addRootSelector,
    addInitSelector,
    setErrorHandler,
    interceptClone,
    addScopeToNode,
    deferMutations,
    mapAttributes,
    evaluateLater,
    interceptInit,
    initInterceptors,
    injectMagics,
    setEvaluator,
    setRawEvaluator,
    mergeProxies,
    extractProp,
    findClosest,
    onElRemoved,
    closestRoot,
    destroyTree,
    interceptor, // INTERNAL: not public API and is subject to change without major release.
    transition, // INTERNAL
    setStyles, // INTERNAL
    mutateDom,
    directive,
    entangle,
    throttle,
    debounce,
    evaluate,
    evaluateRaw,
    initTree,
    nextTick,
    prefixed,
    prefix,
    plugin,
    magic,
    store,
    start,
    clone, // INTERNAL
    cloneNode, // INTERNAL
    bound,
    $data,
    watch,
    walk,
    data,
    bind,
}

export default Alpine
