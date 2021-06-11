import { directive, prefix } from "../directives";
import { addRootSelector } from "../lifecycle";
import { skipDuringClone } from "../clone";
import { evaluate } from "../evaluator";

addRootSelector(() => `[${prefix('init')}]`)

directive('init', skipDuringClone((el, { expression }) => evaluate(el, expression, {}, false)))
