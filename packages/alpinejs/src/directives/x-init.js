import { addRootSelector, closestRoot } from "../lifecycle";
import { directive, prefix } from "../directives";
import { skipDuringClone } from "../clone";
import { evaluate } from "../evaluator";

const isNestedInsideAComponent = (el) =>
    el && el.hasAttribute(prefix('init'))
    && closestRoot(el.parentNode || closestRoot(el))

// If an element has init, but is a child of data then do not add it as a root selector
addRootSelector((el) => isNestedInsideAComponent(el) ? null : `[${prefix('init')}]`)

directive('init', skipDuringClone((el, { expression }) => evaluate(el, expression, {}, false)))
