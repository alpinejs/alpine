import { directive, prefix } from "../directives";
import { addInitSelector } from "../lifecycle";
import { skipDuringClone } from "../clone";

addInitSelector(() => `[${prefix('init')}]`)

directive('init', skipDuringClone((el, { expression }, { evaluate }) => {
  if (typeof expression === 'string') {
    return !! expression.trim() && evaluate(expression, {}, false)
  }

  return evaluate(expression, {}, false)
}))
