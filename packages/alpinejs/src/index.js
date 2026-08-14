/**
 *           _
 *     /\   | |     (_)            (_)
 *    /  \  | |_ __  _ _ __   ___   _ ___
 *   / /\ \ | | '_ \| | '_ \ / _ \ | / __|
 *  / ____ \| | |_) | | | | |  __/_| \__ \
 * /_/    \_\_| .__/|_|_| |_|\___(_) |___/
 *            | |                 _/ |
 *            |_|                |__/
 *
 * Let's build Alpine together. It's easier than you think.
 * For starters, we'll import Alpine's core. This is the
 * object that will expose all of Alpine's public API.
 */
import Alpine from './alpine'

/**
 * _______________________________________________________
 * The Evaluator
 * -------------------------------------------------------
 *
 * Now we're ready to bootstrap Alpine's evaluation system.
 * It's the function that converts raw JavaScript string
 * expressions like @click="toggle()", into actual JS.
 */
import { normalEvaluator, normalRawEvaluator } from './evaluator'

Alpine.setEvaluator(normalEvaluator)
Alpine.setRawEvaluator(normalRawEvaluator)

/**
 * _______________________________________________________
 * The Reactivity Engine
 * -------------------------------------------------------
 *
 * This is the reactivity core of Alpine. It's the part of
 * Alpine that triggers an element with x-text="message"
 * to update its inner text when "message" is changed.
 */
import { reactive, effect, stop, toRaw } from '@vue/reactivity'

Alpine.setReactivityEngine({
    reactive,
    // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
    // the effect to hand Alpine's scheduler the runner it expects to queue.
    effect: (callback, options = {}) => {
        let runner

        runner = effect(callback, {
            scheduler: () => {
                // Defensively preserve Vue 3.1's behavior if an engine ever
                // schedules during its initial run, before returning a runner.
                if (! runner) return

                options.scheduler ? options.scheduler(runner) : runner()
            },
        })

        return runner
    },
    release: stop,
    raw: toRaw,
})

/**
 * _______________________________________________________
 * The Magics
 * -------------------------------------------------------
 *
 * Yeah, we're calling them magics here like they're nouns.
 * These are the properties that are magically available
 * to all the Alpine expressions, within your web app.
 */
import './magics/index'

/**
 * _______________________________________________________
 * The Directives
 * -------------------------------------------------------
 *
 * Now that the core is all set up, we can register Alpine
 * directives like x-text or x-on that form the basis of
 * how Alpine adds behavior to an app's static markup.
 */
import './directives/index'

/**
 * _______________________________________________________
 * The Alpine Global
 * -------------------------------------------------------
 *
 * Now that we have set everything up internally, anything
 * Alpine-related that will need to be accessed on-going
 * will be made available through the "Alpine" global.
 */
export default Alpine
