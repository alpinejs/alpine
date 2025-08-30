
export function convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP(expression) {
    const tokens = tokenize(expression)

    // Check if expression starts with 'await'
    const isAsync = tokens[0] === 'await'
    if (isAsync) {
        tokens.shift() // Remove 'await' keyword
    }

    return (scope = {}, params = [], context = null) => {
        const result = evaluateTokens(tokens, scope, params, context)

        // If expression started with 'await', wrap result in Promise
        if (isAsync) {
            return Promise.resolve(result)
        }

        return result
    }
}

function evaluateExpression(expression, scope, params, context) {
    const tokens = tokenize(expression)
    return evaluateTokens(tokens, scope, params, context)
}

function tokenize(expression) {
    const tokens = []
    let current = ''
    let i = 0
    let inString = false
    let stringQuote = null

    while (i < expression.length) {
        const char = expression[i]

        // Handle string literals
        if ((char === '"' || char === "'") && !inString) {
            inString = true
            stringQuote = char
            if (current) {
                tokens.push(current)
                current = ''
            }
            current += char
        } else if (char === stringQuote && inString) {
            inString = false
            current += char
            tokens.push(current)
            current = ''
            stringQuote = null
        } else if (inString) {
            current += char
        } else if (char === ' ') {
            if (current) {
                tokens.push(current)
                current = ''
            }
        } else if ('+-*/()<>=!&|,[]{}:'.includes(char)) {
            if (current) {
                tokens.push(current)
                current = ''
            }

            // Handle multi-character operators
            if (i + 2 < expression.length) {
                const threeChar = expression.slice(i, i + 3)
                if (threeChar === '===' || threeChar === '!==') {
                    tokens.push(threeChar)
                    i += 2
                    i++
                    continue
                }
            }

            if (i + 1 < expression.length) {
                const twoChar = expression.slice(i, i + 2)
                if (twoChar === '<=' || twoChar === '>=' || twoChar === '&&' || twoChar === '||' || twoChar === '++' || twoChar === '--') {
                    tokens.push(twoChar)
                    i++
                    i++
                    continue
                }
            }

            tokens.push(char)
        } else {
            current += char
        }

        i++
    }

    if (current) {
        tokens.push(current)
    }

    return tokens
}

function updateNestedProperty(path, scope, newValue) {
    const parts = path.split('.')
    const lastPart = parts.pop()
    const obj = parts.reduce((currentObj, prop) => {
        return currentObj ? currentObj[prop] : undefined
    }, scope)

    if (obj === undefined) {
        throw new Error(`Cannot update property: ${path}`)
    }

    obj[lastPart] = newValue
}

function assignToNestedProperty(path, scope, newValue) {
    const parts = path.split('.')
    const lastPart = parts.pop()
    const obj = parts.reduce((currentObj, prop) => {
        return currentObj ? currentObj[prop] : undefined
    }, scope)

    if (obj === undefined) {
        throw new Error(`Cannot assign to undefined property: ${parts.join('.')}`)
    }

    obj[lastPart] = newValue
    return newValue
}

function evaluateTokens(tokens, scope, params, context) {
    // Handle single token literals first
    if (tokens.length === 1) {
        const token = tokens[0]

        // Handle basic literals
        if (token === 'true') return true
        if (token === 'false') return false
        if (token === 'null') return null
        if (token === 'undefined') return undefined

        // Handle numbers
        if (typeof token === 'string' && !isNaN(token) && token.trim() !== '') {
            return Number(token)
        }

        // Handle strings (quoted)
        if (typeof token === 'string' &&
            ((token.startsWith('"') && token.endsWith('"')) ||
             (token.startsWith("'") && token.endsWith("'")))) {
            return token.slice(1, -1)
        }

        // Handle variable access (simple identifiers)
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token)) {
            // Handle 'this' keyword
            if (token === 'this') return context
            const value = scope[token]
            return value !== undefined ? value : token
        }

        // Handle dot notation (e.g., user.name, this.value)
        if (typeof token === 'string' && token.includes('.') && !token.includes(' ') && !token.includes('(')) {
            const parts = token.split('.')
            let obj
            if (parts[0] === 'this') {
                obj = context
            } else {
                obj = scope[parts[0]]
            }

            return parts.slice(1).reduce((currentObj, prop) => {
                return currentObj ? currentObj[prop] : undefined
            }, obj)
        }

        // Use getValue for any other single token
        return getValue(token, scope, params, context)
    }

    // Handle array access first
    tokens = evaluateArrayAccess(tokens, scope, params, context)

    // Handle function calls (before object literals)
    tokens = evaluateFunctionCalls(tokens, scope, params, context)

    // Handle object literals (after function calls)
    tokens = evaluateObjectLiterals(tokens, scope, params, context)

    // Handle array literals
    tokens = evaluateArrayLiterals(tokens, scope, params, context)

    // Handle unary operators
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '!') {
            const operand = getValue(tokens[i + 1], scope, params, context)
            tokens.splice(i, 2, !operand)
        } else if (tokens[i] === '-' && i === 0) {
            // Handle unary minus at the start
            const operand = getValue(tokens[i + 1], scope, params, context)
            tokens.splice(i, 2, -operand)
        } else if (tokens[i] === '-' && i > 0 &&
                   (tokens[i - 1] === '+' || tokens[i - 1] === '-' || tokens[i - 1] === '*' ||
                    tokens[i - 1] === '/' || tokens[i - 1] === '%' || tokens[i - 1] === '(' ||
                    tokens[i - 1] === '[' || tokens[i - 1] === '{' || tokens[i - 1] === ',')) {
            // Handle unary minus after operators or opening brackets
            const operand = getValue(tokens[i + 1], scope, params, context)
            tokens.splice(i, 2, -operand)
        }
    }

    // Handle prefix increment/decrement before arithmetic (higher precedence)
    for (let i = 0; i < tokens.length - 1; i++) {
        if ((tokens[i] === '++' || tokens[i] === '--') && i + 1 < tokens.length) {
            // Process if the next token is a valid variable name or dot notation
            const nextToken = tokens[i + 1]
            if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/.test(nextToken)) {
                const variablePath = nextToken
                const currentValue = getValueForIncrement(variablePath, scope, params, context)

                if (typeof currentValue !== 'number') {
                    throw new Error(`Cannot increment/decrement non-numeric value: ${variablePath}`)
                }

                const newValue = tokens[i] === '++' ? currentValue + 1 : currentValue - 1

                // Update the variable in scope (handles nested properties)
                updateNestedProperty(variablePath, scope, newValue)

                // For prefix, return the new value
                tokens.splice(i, 2, newValue)
                i--
            }
        }
    }

    // Handle arithmetic operators
    for (let i = 1; i < tokens.length - 1; i += 2) {
        const left = getValue(tokens[i - 1], scope, params, context)
        const operator = tokens[i]
        const right = getValue(tokens[i + 1], scope, params, context)

        let result
        switch (operator) {
            case '+': result = left + right; break
            case '-': result = left - right; break
            case '*': result = left * right; break
            case '/': result = left / right; break
            case '%': result = left % right; break
            case '<': result = left < right; break
            case '>': result = left > right; break
            case '<=': result = left <= right; break
            case '>=': result = left >= right; break
            case '===': result = left === right; break
            case '!==': result = left !== right; break
            case '&&': result = left && right; break
            case '||': result = left || right; break
            default: continue
        }

        tokens.splice(i - 1, 3, result)
        i -= 2
    }

    // Handle postfix increment/decrement after arithmetic (lower precedence)
    for (let i = 0; i < tokens.length; i++) {
        if ((tokens[i] === '++' || tokens[i] === '--') && i > 0) {
            // Handle postfix increment/decrement (e.g., foo++)
            // Process if the previous token is a valid variable name or dot notation
            const previousToken = tokens[i - 1]
            if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/.test(previousToken)) {
                const variablePath = previousToken
                const currentValue = getValueForIncrement(variablePath, scope, params, context)

                if (typeof currentValue !== 'number') {
                    throw new Error(`Cannot increment/decrement non-numeric value: ${variablePath}`)
                }

                const newValue = tokens[i] === '++' ? currentValue + 1 : currentValue - 1

                // Update the variable in scope (handles nested properties)
                updateNestedProperty(variablePath, scope, newValue)

                // For postfix, return the original value, but update the variable
                tokens.splice(i - 1, 2, currentValue)
                i--
            }
        }
    }

    // Handle assignment operators (lowest precedence)
    for (let i = 1; i < tokens.length - 1; i += 2) {
        if (tokens[i] === '=') {
            const leftToken = tokens[i - 1]

            // Evaluate the right side as an expression
            const rightTokens = tokens.slice(i + 1)
            const rightValue = evaluateTokens(rightTokens, scope, params, context)

            // Check if left side is a valid assignment target
            if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/.test(leftToken)) {
                // Handle nested property assignment
                if (leftToken.includes('.')) {
                    assignToNestedProperty(leftToken, scope, rightValue)
                } else {
                    // Simple variable assignment
                    scope[leftToken] = rightValue
                }

                // Replace the assignment with the actual value (not the token)
                tokens.splice(i - 1, tokens.length - i + 1, rightValue)
                i -= 2
            } else {
                throw new Error(`Invalid assignment target: ${leftToken}`)
            }
        }
    }

    // If we have a single token, make sure it's properly evaluated
    if (tokens.length === 1) {
        return getValue(tokens[0], scope, params, context)
    }

    return tokens[0]
}

function evaluateTokensWithTernary(tokens, scope, params, context) {
    // First handle ternary operators
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '?') {
            // Find the condition (everything before the ?)
            const conditionTokens = tokens.slice(0, i)

            // Find the colon (separates then and else parts)
            let colonIndex = -1
            for (let j = i + 1; j < tokens.length; j++) {
                if (tokens[j] === ':') {
                    colonIndex = j
                    break
                }
            }

            if (colonIndex === -1) {
                throw new Error('Missing colon in ternary operator')
            }

            // Extract then and else parts
            const thenTokens = tokens.slice(i + 1, colonIndex)
            const elseTokens = tokens.slice(colonIndex + 1)

            // Evaluate condition
            const condition = evaluateTokens(conditionTokens, scope, params, context)

            // Evaluate then and else parts
            const thenValue = evaluateTokens(thenTokens, scope, params, context)
            const elseValue = evaluateTokens(elseTokens, scope, params, context)

            // Return the result
            return condition ? thenValue : elseValue
        }
    }

    // If no ternary operator found, use regular evaluation
    const result = evaluateTokens(tokens, scope, params, context)
    return result
}

function evaluateArrayAccess(tokens, scope, params, context) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '[') {
            // Find the matching closing bracket
            let bracketCount = 1
            let j = i + 1
            while (j < tokens.length && bracketCount > 0) {
                if (tokens[j] === '[') bracketCount++
                else if (tokens[j] === ']') bracketCount--
                j++
            }

            if (bracketCount === 0) {
                // Check if this is actually array access (not object literal)
                if (i > 0 && tokens[i - 1] !== ':') {
                    const arrayName = tokens[i - 1]
                    const indexTokens = tokens.slice(i + 1, j - 1)
                    const index = evaluateTokens(indexTokens, scope, params, context)

                    // Get the array from scope or params
                    let array
                    if (arrayName === 'params') {
                        array = params
                    } else {
                        array = getValue(arrayName, scope, params, context)
                    }

                    if (Array.isArray(array)) {
                        const result = array[index]
                        tokens.splice(i - 1, j - i + 1, result)
                        i = i - 1
                    } else {
                        throw new Error(`'${arrayName}' is not an array`)
                    }
                }
            }
        }
    }

    return tokens
}

function evaluateFunctionCalls(tokens, scope, params, context) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '(' && i > 0) {
            // This is a function call
            const functionName = tokens[i - 1]

            // Find the matching closing parenthesis
            let parenCount = 1
            let j = i + 1
            while (j < tokens.length && parenCount > 0) {
                if (tokens[j] === '(') parenCount++
                else if (tokens[j] === ')') parenCount--
                j++
            }

            if (parenCount === 0) {
                // Extract the arguments
                const argTokens = tokens.slice(i + 1, j - 1)
                const args = parseArguments(argTokens, scope, params, context)

                // Get the function from scope
                const func = getValue(functionName, scope, params, context)

                if (typeof func === 'function') {
                    const result = func.apply(context, args)
                    tokens.splice(i - 1, j - i + 1, result)
                    i = i - 1
                } else {
                    throw new Error(`'${functionName}' is not a function`)
                }
            }
        }
    }

    return tokens
}

function parseArguments(argsTokens, scope, params, context) {
    if (argsTokens.length === 0) return []

    const args = []
    let currentArg = []
    let parenCount = 0
    let bracketCount = 0

    for (let i = 0; i < argsTokens.length; i++) {
        const token = argsTokens[i]

        if (token === '(') parenCount++
        else if (token === ')') parenCount--
        else if (token === '[') bracketCount++
        else if (token === ']') bracketCount--
        else if (token === ',' && parenCount === 0 && bracketCount === 0) {
            // End of current argument
            if (currentArg.length > 0) {
                const evaluatedArg = evaluateTokens([...currentArg], scope, params, context)
                args.push(evaluatedArg)
                currentArg = []
            }
            continue
        }

        currentArg.push(token)
    }

    // Add the last argument
    if (currentArg.length > 0) {
        const evaluatedArg = evaluateTokens([...currentArg], scope, params, context)
        args.push(evaluatedArg)
    }

    return args
}

function evaluateObjectLiterals(tokens, scope, params, context) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '{') {
            // Find the matching closing brace
            let braceCount = 1
            let j = i + 1
            while (j < tokens.length && braceCount > 0) {
                if (tokens[j] === '{') braceCount++
                else if (tokens[j] === '}') braceCount--
                j++
            }

            if (braceCount > 0) {
                // Missing closing brace
                throw new Error('Missing closing brace in object literal')
            }

            if (braceCount === 0) {
                // Extract the object literal content
                const objectTokens = tokens.slice(i + 1, j - 1)
                const object = parseObjectLiteral(objectTokens, scope, params, context)

                // Replace the object literal with the parsed object
                tokens.splice(i, j - i, object)
            }
        }
    }

    return tokens
}

function parseObjectLiteral(tokens, scope, params, context) {
    if (tokens.length === 0) {
        return {}
    }

    const object = {}
    let i = 0

    while (i < tokens.length) {
        // Skip whitespace and commas
        while (i < tokens.length && (tokens[i] === ',' || tokens[i].trim() === '')) {
            i++
        }

        if (i >= tokens.length) break

        // Parse key
        let key
        if (tokens[i].startsWith('"') && tokens[i].endsWith('"')) {
            // Quoted key
            key = tokens[i].slice(1, -1)
            i++
        } else if (tokens[i].startsWith("'") && tokens[i].endsWith("'")) {
            // Single quoted key
            key = tokens[i].slice(1, -1)
            i++
        } else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(tokens[i])) {
            // Identifier key
            key = tokens[i]
            i++
        } else {
            throw new Error(`Invalid object key: ${tokens[i]}`)
        }

        // Expect colon
        if (i >= tokens.length || tokens[i] !== ':') {
            throw new Error('Expected colon after object key')
        }
        i++

        // Parse value - collect tokens until we hit a comma at the top level
        let valueTokens = []
        let parenCount = 0
        let bracketCount = 0
        let braceCount = 0

        while (i < tokens.length) {
            const token = tokens[i]

            if (token === '(') parenCount++
            else if (token === ')') parenCount--
            else if (token === '[') bracketCount++
            else if (token === ']') bracketCount--
            else if (token === '{') braceCount++
            else if (token === '}') braceCount--
            else if (token === ',' && parenCount === 0 && bracketCount === 0 && braceCount === 0) {
                i++
                break
            }

            valueTokens.push(token)
            i++
        }

        // Evaluate the value as a complete expression
        let value
        if (valueTokens.length === 0) {
            value = undefined
        } else if (valueTokens.length === 1) {
            // Single token - use getValue for efficiency
            value = getValue(valueTokens[0], scope, params, context)
        } else {
            // Multiple tokens - evaluate as expression (this will handle function calls)
            value = evaluateTokensWithTernary(valueTokens, scope, params, context)
        }

        object[key] = value
    }

    return object
}

function evaluateArrayLiterals(tokens, scope, params, context) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '[') {
            // Find the matching closing bracket
            let bracketCount = 1
            let j = i + 1
            while (j < tokens.length && bracketCount > 0) {
                if (tokens[j] === '[') bracketCount++
                else if (tokens[j] === ']') bracketCount--
                j++
            }

            if (bracketCount === 0) {
                // Extract the array literal content
                const arrayTokens = tokens.slice(i + 1, j - 1)
                const array = parseArrayLiteral(arrayTokens, scope, params, context)

                // Replace the array literal with the parsed array
                tokens.splice(i, j - i, array)
            }
        }
    }

    return tokens
}

function parseArrayLiteral(tokens, scope, params, context) {
    if (tokens.length === 0) {
        return []
    }

    const array = []
    let i = 0

    while (i < tokens.length) {
        // Skip whitespace and commas
        while (i < tokens.length && (tokens[i] === ',' || tokens[i].trim() === '')) {
            i++
        }

        if (i >= tokens.length) break

        // Parse array element - collect tokens until we hit a comma at the top level
        let elementTokens = []
        let parenCount = 0
        let bracketCount = 0
        let braceCount = 0

        while (i < tokens.length) {
            const token = tokens[i]

            if (token === '(') parenCount++
            else if (token === ')') parenCount--
            else if (token === '[') bracketCount++
            else if (token === ']') bracketCount--
            else if (token === '{') braceCount++
            else if (token === '}') braceCount--
            else if (token === ',' && parenCount === 0 && bracketCount === 0 && braceCount === 0) {
                i++
                break
            }

            elementTokens.push(token)
            i++
        }

        // Evaluate the element as a complete expression
        let element
        if (elementTokens.length === 0) {
            element = undefined
        } else if (elementTokens.length === 1) {
            // Single token - use getValue for efficiency
            element = getValue(elementTokens[0], scope, params, context)
        } else {
            // Multiple tokens - evaluate as expression
            element = evaluateTokens(elementTokens, scope, params, context)
        }

        array.push(element)
    }

    return array
}

function getValue(token, scope, params, context) {
    // If it's already a value (number, boolean, object, array), return it
    if (typeof token === 'number' || typeof token === 'boolean' ||
        typeof token === 'object' || Array.isArray(token)) {
        return token
    }

    // Handle literals
    if (token === 'true') return true
    if (token === 'false') return false
    if (token === 'null') return null
    if (token === 'undefined') return undefined

    // Handle numbers
    if (typeof token === 'string' && !isNaN(token) && token.trim() !== '') {
        return Number(token)
    }

    // Handle strings (quoted)
    if (typeof token === 'string' &&
        ((token.startsWith('"') && token.endsWith('"')) ||
         (token.startsWith("'") && token.endsWith("'")))) {
        return token.slice(1, -1)
    }

    // Handle 'this' keyword
    if (token === 'this') return context

    // Handle variable access
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token)) {
        const value = scope[token]
        return value !== undefined ? value : token
    }

    // Handle dot notation
    if (typeof token === 'string' && token.includes('.')) {
        return token.split('.').reduce((obj, prop) => {
            return obj ? obj[prop] : undefined
        }, scope)
    }

    return token
}

function getValueForIncrement(token, scope, params, context) {
    // Special version of getValue for increment/decrement that throws better errors
    if (token === undefined || token === null) {
        throw new Error('Cannot increment/decrement undefined or null value')
    }

    if (typeof token === 'number' || typeof token === 'boolean') {
        return token
    }

    // Handle numbers
    if (typeof token === 'string' && !isNaN(token) && token.trim() !== '') {
        return Number(token)
    }

    // Handle strings (quoted)
    if ((token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))) {
        return token.slice(1, -1)
    }

    // Handle 'this' keyword
    if (token === 'this') return context

    // Handle variable access
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token)) {
        if (scope[token] === undefined) {
            throw new Error(`Variable not found: ${token}`)
        }
        return scope[token]
    }

    // Handle dot notation
    if (token.includes('.')) {
        return token.split('.').reduce((obj, prop) => {
            return obj ? obj[prop] : undefined
        }, scope)
    }

    return token
}
