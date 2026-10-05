export function resolveBlockEnd(el) {
    // The last node rendered by a directive may itself render more siblings.
    // Follow those links to find where the whole block currently ends...
    while (el._x_lastRenderedEl) {
        el = el._x_lastRenderedEl
    }

    return el
}
