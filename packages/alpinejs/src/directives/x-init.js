import { directive, prefix } from "../directives";
import { addInitSelector } from "../lifecycle";
import { skipDuringClone } from "../clone";
import { evaluate } from "../evaluator";

addInitSelector(() => `[${prefix('init')}]`)

directive('init', skipDuringClone((el, { expression }) => {
  if (typeof expression === 'string') {
    return !! expression.trim() && evaluate(el, expression, {}, false)
  }

  return evaluate(el, expression, {}, false)
}))
