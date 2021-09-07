import { directive, prefix } from "../directives";
import { addInitSelector } from "../lifecycle";
import { skipDuringClone } from "../clone";
import { evaluate } from "../evaluator";

addInitSelector(() => `[${prefix('init')}]`)

directive('init', skipDuringClone((el, { expression }) => {
  const evaluation = evaluate(el, expression, {}, false)

  if (typeof expression === 'string') {
    return !! expression.trim() && evaluation
  }

  return evaluation
}))
