import { setReactivityEngine, disableEffectScheduling, reactive, effect, release, raw, watch } from './reactivity.js'
import { mapAttributes, directive, setPrefix as prefix, prefix as prefixed } from './directives.js'
import { start, addRootSelector, addInitSelector, closestRoot, findClosest, initTree, destroyTree, interceptInit } from './lifecycle.js'
import { onElRemoved, onAttributeRemoved, onAttributesAdded, mutateDom, deferMutations, flushAndStopDeferringMutations, startObservingMutations, stopObservingMutations } from './mutation.js'
import { mergeProxies, closestDataStack, addScopeToNode, scope as $data } from './scope.js'
import { setEvaluator, evaluate, evaluateLater, dontAutoEvaluateFunctions } from './evaluator.js'
import { transition } from './directives/x-transition.js'
import { clone, cloneNode, skipDuringClone, onlyDuringClone, interceptClone } from './clone.js'
import { interceptor } from './interceptor.js'
import { getBinding as bound, extractProp } from './utils/bind.js'
import { debounce } from './utils/debounce.js'
import { throttle } from './utils/throttle.js'
import { setStyles } from './utils/styles.js'
import { entangle } from './entangle.js'
import { nextTick } from './nextTick.js'
import { walk } from './utils/walk.js'
import { plugin } from './plugin.js'
import { magic } from './magics.js'
import { store } from './store.js'
import { bind } from './binds.js'
import { data } from './datas.js'

let Alpine = {
    get reactive() { return reactive },
    get release() { return release },
    get effect() { return effect },
    get raw() { return raw },
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
    interceptClone,
    addScopeToNode,
    deferMutations,
    mapAttributes,
    evaluateLater,
    interceptInit,
    setEvaluator,
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
