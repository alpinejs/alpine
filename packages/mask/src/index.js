
export default function (Alpine) {
    Alpine.directive('mask', (el, { value, expression }, { effect, evaluateLater }) => {
        let templateFn = () => expression
        let lastInputValue = ''

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
                //   when a dependancy inside it changes, the input re-masks.
                processInputValue(el)
            })
        } else {
            processInputValue(el)
        }

        el.addEventListener('input', () => processInputValue(el))
        // Don't "restoreCursorPosition" on "blur", because Safari
        // will re-focus the input and cause a focus trap.
        el.addEventListener('blur', () => processInputValue(el, false))

        function processInputValue (el, shouldRestoreCursor = true) {
            let input = el.value

            let template = templateFn(input)

            // If a template value is `falsy`, then don't process the input value
            if(!template || template === 'false') return false

            // If they hit backspace, don't process input.
            if (lastInputValue.length - el.value.length === 1) {
                return lastInputValue = el.value
            }

            let setInput = () => { lastInputValue = el.value = formatInput(input, template) }

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

        function formatInput(input, template) {
            // Let empty inputs be empty inputs.
            if (input === '') return ''

            let strippedDownInput = stripDown(template, input)
            let rebuiltInput = buildUp(template, strippedDownInput)

            return rebuiltInput
        }
    })
}

export function restoreCursorPosition(el, template, callback) {
    let cursorPosition = el.selectionStart
    let unformattedValue = el.value

    callback()

    let beforeLeftOfCursorBeforeFormatting = unformattedValue.slice(0, cursorPosition)

    let newPosition = buildUp(
        template, stripDown(
            template, beforeLeftOfCursorBeforeFormatting
        )
    ).length

    el.setSelectionRange(newPosition, newPosition)
}

export function stripDown(template, input) {
    let inputToBeStripped = input
    let output = ''
    let regexes = {
        '9': /[0-9]/,
        'a': /[a-zA-Z]/,
        '*': /[a-zA-Z0-9]/,
    }

    let wildcardTemplate = ''

    // Strip away non wildcard template characters.
    for (let i = 0; i < template.length; i++) {
        if (['9', 'a', '*'].includes(template[i])) {
            wildcardTemplate += template[i]
            continue;
        }

        for (let j = 0; j < inputToBeStripped.length; j++) {
            if (inputToBeStripped[j] === template[i]) {
                inputToBeStripped = inputToBeStripped.slice(0, j) + inputToBeStripped.slice(j+1)

                break;
            }
        }
    }

    for (let i = 0; i < wildcardTemplate.length; i++) {
        let found = false

        for (let j = 0; j < inputToBeStripped.length; j++) {
            if (regexes[wildcardTemplate[i]].test(inputToBeStripped[j])) {
                output += inputToBeStripped[j]
                inputToBeStripped = inputToBeStripped.slice(0, j) + inputToBeStripped.slice(j+1)

                found = true
                break;
            }
        }

        if (! found) break;
    }

    return output
}

export function buildUp(template, input) {
    let clean = Array.from(input)
    let output = ''

    for (let i = 0; i < template.length; i++) {
        if (! ['9', 'a', '*'].includes(template[i])) {
            output += template[i]
            continue;
        }

        if (clean.length === 0) break;

        output += clean.shift()
    }

    return output
}

function formatMoney(input, delimeter = '.', thousands) {
    thousands = (delimeter === ',' && thousands === undefined)
        ? '.' : ','

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

    let strippedInput = input.replaceAll(new RegExp(`[^0-9\\${delimeter}]`, 'g'), '')
    let template = Array.from({ length: strippedInput.split(delimeter)[0].length }).fill('9').join('')

    template = addThousands(template, thousands)

    if (input.includes(delimeter)) template += `${delimeter}99`

    queueMicrotask(() => {
        if (this.el.value.endsWith(delimeter)) return

        if (this.el.value[this.el.selectionStart - 1] === delimeter) {
            this.el.setSelectionRange(this.el.selectionStart - 1, this.el.selectionStart - 1)
        }
    })

    return template
}
