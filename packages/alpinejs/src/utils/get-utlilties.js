import { getElementBoundUtilities } from "../directives";
import { interceptor } from "../interceptor";
import { onElRemoved } from "../mutation";

/// Gets the utilities for a given element.
/// @param el - The element to get the utilities for.
/// @returns The utilities for the given element.
export function getUtilities(el) {
    let [utilities, cleanup] = getElementBoundUtilities(el)
    const utils = { interceptor, ...utilities }
    onElRemoved(el, cleanup)
    return utils;
}
