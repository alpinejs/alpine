import { getElementBoundUtilities } from "../directives";
import { interceptor } from "../interceptor";
import { onElRemoved } from "../mutation";

/// Get the utilities for a given element.
/// @param el - The element to get the utilities for.
export function getUtilities(el) {
    let [utilities, cleanup] = getElementBoundUtilities(el)
    const utils = { interceptor, ...utilities }
    onElRemoved(el, cleanup)
    return utils;
}
