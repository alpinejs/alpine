import { directive, prefix } from "../directives";
import { addInitSelector } from "../lifecycle";
import { skipDuringClone } from "../clone";
import { evaluate } from "../evaluator";

addInitSelector(() => `[${prefix('init')}]`)

directive('init', skipDuringClone((el, { expression }) => evaluate(el, expression, {}, false)))
