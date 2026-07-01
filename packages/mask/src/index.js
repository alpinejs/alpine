
export default function (Alpine) {
    Alpine.directive('mask', (el, { value, expression, modifiers }, { effect, evaluateLater, cleanup }) => {
        let templateFn = () => expression
        let lastInputValue = ''
        let isDisplayOnly = modifiers.includes('display')

        let setModelValue = value => {
            if (isDisplayOnly) el._x_modelValue = value
        }

        let clearModelValue = () => {
            if (isDisplayOnly) delete el._x_modelValue
        }

        queueMicrotask(() => {
            if (['function', 'dynamic'].includes(value)) {
                // This is an x-mask:function directive.

                let evaluator = evaluateLater(expression)

                effect(() => {
                    templateFn = input => {
                        let result

                        // We need to prevent "auto-evaluation" of functions like
                        // x-on expressions do so that we can use them as mask functions.
                        Alpine.dontAutoEvaluateFunctions(() => {
                            evaluator(value => {
                                result = typeof value === 'function' ? value(input) : value
                            }, { scope: {
                                // These are "magics" we'll make available to the x-mask:function:
                                '$input': input,
                                '$money': formatMoney.bind({ el }),
                            }})
                        })

                        return result
                    }

                    // Run on initialize which serves a dual purpose:
                    // - Initializing the mask on the input if it has an initial value.
                    // - Running the template function to set up reactivity, so that
                    //   when a dependency inside it changes, the input re-masks.
                    processInputValue(el, false)
                })
            } else {
                processInputValue(el, false)
            }

            // Override x-model's initial value...
            if (el._x_model) {
                if (! isDisplayOnly) {
                    // If the x-model value is the same, don't override it as that will trigger updates...
                    if (el._x_model.get() !== el.value) {
                        // If the x-model value is `null` and the input value is an empty
                        // string, don't override it as that will trigger updates...
                        if (!(el._x_model.get() === null && el.value === '')) {
                            el._x_model.set(el.value)
                        }
                    }
                }

                let updater = el._x_forceModelUpdate
                el._x_forceModelUpdate = (value) => {
                    // If the model value was cleared (e.g. the parent object was
                    // removed), just clear the input — don't format and write back
                    // as that would resurrect the model path with an empty value.
                    if (value === undefined) {
                        lastInputValue = ''
                        clearModelValue()
                        return updater(value)
                    }

                    value = String(value)
                    let modelValue = value
                    let template = templateFn(value)
                    if (template && template !== 'false') {
                        let formatted = formatInputValues(template, value)

                        value = formatted.masked
                        modelValue = formatted.unmasked
                    }
                    lastInputValue = value
                    setModelValue(modelValue)
                    updater(value)
                    if (! isDisplayOnly) el._x_model.set(value)
                }
            }
        })

        const controller = new AbortController()

        cleanup(() => {
            controller.abort()

            clearModelValue()
        })

        el.addEventListener('input', () => processInputValue(el), {
            signal: controller.signal,
            // Setting this as a capture phase listener to ensure it runs
            // before wire:model or x-model added as a latent binding...
            capture: true,
        })

        // Don't "restoreCursorPosition" on "blur", because Safari
        // will re-focus the input and cause a focus trap.
        el.addEventListener('blur', () => processInputValue(el, false), { signal: controller.signal })

        function processInputValue (el, shouldRestoreCursor = true) {
            let input = el.value

            let template = templateFn(input)

            // If a template value is `falsy`, then don't process the input value
            if(!template || template === 'false') {
                clearModelValue()
                return false
            }

            let formatted = formatInputValues(template, input)

            setModelValue(formatted.unmasked)

            // If they hit backspace, don't process input.
            if (lastInputValue.length - el.value.length === 1) {
                return lastInputValue = el.value
            }

            let setInput = () => {
                lastInputValue = el.value = formatted.masked
            }

            if (shouldRestoreCursor) {
                // When an input element's value is set, it moves the cursor to the end
                // therefore we need to track, estimate, and restore the cursor after
                // a change was made.
                restoreCursorPosition(el, template, () => {
                    setInput()
                })
            } else {
                setInput()
            }
        }
    }).before('model')
}

export function restoreCursorPosition(el, template, callback) {
    let cursorPosition = el.selectionStart
    let unformattedValue = el.value

    callback()

    let beforeLeftOfCursorBeforeFormatting = unformattedValue.slice(0, cursorPosition)

    let newPosition = formatInput(
            template, beforeLeftOfCursorBeforeFormatting
    ).length

    el.setSelectionRange(newPosition, newPosition)
}

let regexes = {
    '9': /[0-9]/,
    'a': /[a-zA-Z]/,
    '*': /[a-zA-Z0-9]/,
}

export function formatInput(template, input) {
    return formatInputValues(template, input).masked
}

function formatInputValues(template, input) {
    let templateMark = 0
    let inputMark = 0
    let masked = ''
    let unmasked = ''

    // Walk the template and input chars simultaneously one by one...
    while (templateMark < template.length && inputMark < input.length) {
        let templateChar = template[templateMark]
        let inputChar = input[inputMark]

        // We've encountered a template placeholder...
        if (templateChar in regexes) {
            // If the input is "allowed" based on the placeholder...
            if (regexes[templateChar].test(inputChar)) {
                masked += inputChar
                unmasked += inputChar

                templateMark++
            }

            inputMark++
        } else { // We've encountered a template literal...
            masked += templateChar

            templateMark++

            if (templateChar === input[inputMark]) inputMark++
        }
    }

    return { masked, unmasked }
}

export function formatMoney(input, delimiter = '.', thousands, precision = 2) {
    if (input === '-') return '-'
    if (/^\D+$/.test(input)) return '9'

    if (thousands === null || thousands === undefined) {
        thousands = delimiter === "," ? "." : ","
    }

    let addThousands = (input, thousands) => {
        let output = ''
        let counter = 0

        for (let i = input.length - 1; i >= 0; i--) {
            if (input[i] === thousands) continue;

            if (counter === 3) {
                output = input[i] + thousands + output
                counter = 0
            } else {
                output = input[i] + output
            }
            counter++
        }

        return output
    }

    let minus = input.startsWith('-') ? '-' : ''
    let strippedInput = input.replaceAll(new RegExp(`[^0-9\\${delimiter}]`, 'g'), '')
    let template = Array.from({ length: strippedInput.split(delimiter)[0].length }).fill('9').join('')

    template = `${minus}${addThousands(template, thousands)}`

    if (precision > 0 && input.includes(delimiter))
        template += `${delimiter}` + '9'.repeat(precision)

    queueMicrotask(() => {
        if (this.el.value.endsWith(delimiter)) return

        if (this.el.value[this.el.selectionStart - 1] === delimiter) {
            this.el.setSelectionRange(this.el.selectionStart - 1, this.el.selectionStart - 1)
        }
    })

    return template
}
