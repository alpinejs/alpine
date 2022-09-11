import { directive } from "../directives";
import { skipDuringClone } from "../clone";

directive('destroy', skipDuringClone((el, { expression }, { evaluate, cleanup }) => {
    cleanup(() => evaluate(expression, {}, false))
}))
