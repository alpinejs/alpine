/**
 * Alpine CSP Build.
 *
 * Alpine allows you to use JavaScript directly inside your HTML. This is an
 * incredibly powerful features. However, it violates the "unsafe-eval"
 * Content Security Policy. This alternate Alpine build provides a
 * more constrained API for Alpine that is also CSP-friendly...
 */
import Alpine from 'alpinejs/src/alpine'

/**
 * _______________________________________________________
 * The Evaluator
 * -------------------------------------------------------
 *
 * By default, Alpine's evaluator "eval"-like utilties to
 * interpret strings as runtime JS. We're going to use
 * a more CSP-friendly evaluator for this instead.
 */
import { cspEvaluator } from './evaluator'

Alpine.setEvaluator(cspEvaluator)

/**
 * The rest of this file bootstraps Alpine the way it is
 * normally bootstrapped in the default build. We will
 * set and define it's directives, magics, etc...
 */
import { reactive, effect, stop, toRaw } from '@vue/reactivity'

Alpine.setReactivityEngine({ reactive, effect, release: stop, raw: toRaw })

import 'alpinejs/src/magics/index'

import 'alpinejs/src/directives/index'

export default Alpine
