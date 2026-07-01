
export default function (Alpine) {
    Alpine.directive('mask', (el, { value, expression, modifiers }, { effect, evaluateLater, cleanup }) => {
        let templateFn = () => expression
        let lastInputValue = ''
        let lastModelValue = ''
        let isDisplayOnly = modifiers.includes('display')
        let restoreValueGetter = () => {}

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
                    processInputValue(el, false, false)
                })
            } else {
                processInputValue(el, false, false)
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
                        return updater(value)
                    }

                    value = String(value)
                    let template = templateFn(value)
                    if (template && template !== 'false') {
                        let formatted = formatInputValues(template, value)

                        value = formatted.masked
                    }
                    lastInputValue = value
                    updater(value)
                    if (! isDisplayOnly) el._x_model.set(value)
                }
            }
        })

        const controller = new AbortController()

        cleanup(() => {
            controller.abort()

            restoreValueGetter()
        })

        el.addEventListener('input', () => processInputValue(el), {
            signal: controller.signal,
            // Setting this as a capture phase listener to ensure it runs
            // before wire:model or x-model added as a latent binding...
            capture: true,
        })

        // Don't "restoreCursorPosition" on "blur", because Safari
        // will re-focus the input and cause a focus trap.
        el.addEventListener('blur', () => processInputValue(el, false), { signal: controller.signal, capture: true })
        el.addEventListener('change', () => processInputValue(el, false), { signal: controller.signal, capture: true })
        el.addEventListener('keydown', event => {
            if (event.key !== 'Enter') return

            exposeModelValue(lastModelValue, true)
        }, { signal: controller.signal, capture: true })

        function processInputValue (el, shouldRestoreCursor = true, shouldExposeModelValue = true) {
            restoreValueGetter()

            let input = el.value

            let template = templateFn(input)

            // If a template value is `falsy`, then don't process the input value
            if(!template || template === 'false') {
                lastModelValue = input
                exposeModelValue(input, shouldExposeModelValue)
                return false
            }

            let formatted = formatInputValues(template, input)

            lastModelValue = formatted.unmasked

            // If they hit backspace, don't process input.
            if (lastInputValue.length - el.value.length === 1) {
                exposeModelValue(formatted.unmasked, shouldExposeModelValue)

                return lastInputValue = input
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

            exposeModelValue(formatted.unmasked, shouldExposeModelValue)
        }

        function exposeModelValue(value, shouldExposeModelValue) {
            if (! isDisplayOnly || ! shouldExposeModelValue) return

            restoreValueGetter()

            let descriptor = Object.getOwnPropertyDescriptor(el, 'value')
            let nativeDescriptor = getNativeValueDescriptor(el)

            let restore = () => {
                if (restoreValueGetter !== restore) return

                if (descriptor) {
                    Object.defineProperty(el, 'value', descriptor)
                } else {
                    delete el.value
                }

                restoreValueGetter = () => {}
            }

            restoreValueGetter = restore

            Object.defineProperty(el, 'value', {
                configurable: true,
                get() {
                    return value
                },
                set(value) {
                    nativeDescriptor.set.call(el, value)
                },
            })

            setTimeout(restore, getModelValueExposureDuration(el))
        }
    }).before('model')
}

function getNativeValueDescriptor(el) {
    let prototype = Object.getPrototypeOf(el)

    while (prototype) {
        let descriptor = Object.getOwnPropertyDescriptor(prototype, 'value')

        if (descriptor) return descriptor

        prototype = Object.getPrototypeOf(prototype)
    }
}

function getModelValueExposureDuration(el) {
    let modifiers = getModelModifiers(el)
    let debounce = modifiers.indexOf('debounce')

    if (debounce === -1) return 0

    let duration = modifiers[debounce + 1] || 'invalid-wait'
    let milliseconds = Number(duration.split('ms')[0])

    return (isNaN(milliseconds) ? 250 : milliseconds) + 25
}

function getModelModifiers(el) {
    let modelAttribute = Array.from(el.attributes).find(attribute => {
        return attribute.name === 'x-model' || attribute.name.startsWith('x-model.')
    })

    return modelAttribute ? modelAttribute.name.split('.').slice(1) : []
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
