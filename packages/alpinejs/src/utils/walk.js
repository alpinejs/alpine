export function walk(el, callback) {
    if (el instanceof ShadowRoot) {
        Array.from(el.children).forEach(el => walk(el, callback))

        return
    }

    let skip = false

    callback(el, () => skip = true)

    if (skip) return

    let node = el.firstElementChild

    while (node) {
        walk(node, callback, false)

        node = node.nextElementSibling
    }
}
// export function walk(el, callback) {
//     if (el instanceof ShadowRoot || el instanceof DocumentFragment) {
//         Array.from(el.children).forEach(el => walk(el, callback))

//         return
//     }

//     callback(el, () => {
//         let node = el.firstElementChild

//         while (node) {
//             walk(node, callback)

//             node = node.nextElementSibling
//         }
//     })
// }
