import {dispatch} from "./dispatch";

export function tryCatch(el, expression, callback, ...args) {
    try {
        return callback(...args)
    } catch (e) {
        handleError( e, el, expression )
    }
}

export function handleError(error, el, expression = undefined) {
    console.warn(`Alpine Expression Error: ${error.message}\n\n${ expression ? 'Expression: \"' + expression + '\"\n\n' : '' }`, el)

    dispatch( document, "alpine:error", { error, el, expression } )
}
