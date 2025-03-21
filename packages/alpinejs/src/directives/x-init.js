import { directive, prefix } from "../directives.js";
import { addInitSelector } from "../lifecycle.js";
import { skipDuringClone } from "../clone.js";

addInitSelector(() => `[${prefix('init')}]`)

directive('init', skipDuringClone((el, { expression }, { evaluate }) => {
    if (typeof expression === 'string') {
        return !! expression.trim() && evaluate(expression, {}, false)
    }

    return evaluate(expression, {}, false)
}))
