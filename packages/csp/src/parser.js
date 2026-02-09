let safemap = new WeakMap()
let globals = new Set()

Object.getOwnPropertyNames(globalThis).forEach(key => {
    // Prevent Safari deprecation warning...
    if (key === 'styleMedia') return

    globals.add(globalThis[key])
})

class Token {
    constructor(type, value, start, end) {
        this.type = type;
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

class Tokenizer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.tokens = [];
    }

    tokenize() {
        while (this.position < this.input.length) {
            this.skipWhitespace();
            if (this.position >= this.input.length) break;

            const char = this.input[this.position];

            if (this.isDigit(char)) {
                this.readNumber();
            } else if (this.isAlpha(char) || char === '_' || char === '$') {
                this.readIdentifierOrKeyword();
            } else if (char === '"' || char === "'") {
                this.readString();
            } else if (char === '/' && this.peek() === '/') {
                this.skipLineComment();
            } else {
                this.readOperatorOrPunctuation();
            }
        }

        this.tokens.push(new Token('EOF', null, this.position, this.position));
        return this.tokens;
    }

    skipWhitespace() {
        while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
            this.position++;
        }
    }

    skipLineComment() {
        while (this.position < this.input.length && this.input[this.position] !== '\n') {
            this.position++;
        }
    }

    isDigit(char) {
        return /[0-9]/.test(char);
    }

    isAlpha(char) {
        return /[a-zA-Z]/.test(char);
    }

    isAlphaNumeric(char) {
        return /[a-zA-Z0-9_$]/.test(char);
    }

    peek(offset = 1) {
        return this.input[this.position + offset] || '';
    }

    readNumber() {
        const start = this.position;
        let hasDecimal = false;

        while (this.position < this.input.length) {
            const char = this.input[this.position];
            if (this.isDigit(char)) {
                this.position++;
            } else if (char === '.' && !hasDecimal) {
                hasDecimal = true;
                this.position++;
            } else {
                break;
            }
        }

        const value = this.input.slice(start, this.position);
        this.tokens.push(new Token('NUMBER', parseFloat(value), start, this.position));
    }

    readIdentifierOrKeyword() {
        const start = this.position;

        while (this.position < this.input.length && this.isAlphaNumeric(this.input[this.position])) {
            this.position++;
        }

        const value = this.input.slice(start, this.position);
        const keywords = ['true', 'false', 'null', 'undefined', 'new', 'typeof', 'void', 'delete', 'in', 'instanceof'];

        if (keywords.includes(value)) {
            if (value === 'true' || value === 'false') {
                this.tokens.push(new Token('BOOLEAN', value === 'true', start, this.position));
            } else if (value === 'null') {
                this.tokens.push(new Token('NULL', null, start, this.position));
            } else if (value === 'undefined') {
                this.tokens.push(new Token('UNDEFINED', undefined, start, this.position));
            } else {
                this.tokens.push(new Token('KEYWORD', value, start, this.position));
            }
        } else {
            this.tokens.push(new Token('IDENTIFIER', value, start, this.position));
        }
    }

    readString() {
        const start = this.position;
        const quote = this.input[this.position];
        this.position++; // Skip opening quote

        let value = '';
        let escaped = false;

        while (this.position < this.input.length) {
            const char = this.input[this.position];

            if (escaped) {
                switch (char) {
                    case 'n': value += '\n'; break;
                    case 't': value += '\t'; break;
                    case 'r': value += '\r'; break;
                    case '\\': value += '\\'; break;
                    case quote: value += quote; break;
                    default: value += char;
                }
                escaped = false;
            } else if (char === '\\') {
                escaped = true;
            } else if (char === quote) {
                this.position++; // Skip closing quote
                this.tokens.push(new Token('STRING', value, start, this.position));
                return;
            } else {
                value += char;
            }

            this.position++;
        }

        throw new Error(`Unterminated string starting at position ${start}`);
    }

    readOperatorOrPunctuation() {
        const start = this.position;
        const char = this.input[this.position];
        const next = this.peek();
        const nextNext = this.peek(2);

        // Three-character operators
        if (char === '=' && next === '=' && nextNext === '=') {
            this.position += 3;
            this.tokens.push(new Token('OPERATOR', '===', start, this.position));
        } else if (char === '!' && next === '=' && nextNext === '=') {
            this.position += 3;
            this.tokens.push(new Token('OPERATOR', '!==', start, this.position));
        }
        // Two-character operators
        else if (char === '=' && next === '=') {
            this.position += 2;
            this.tokens.push(new Token('OPERATOR', '==', start, this.position));
        } else if (char === '!' && next === '=') {
            this.position += 2;
            this.tokens.push(new Token('OPERATOR', '!=', start, this.position));
        } else if (char === '<' && next === '=') {
            this.position += 2;
            this.tokens.push(new Token('OPERATOR', '<=', start, this.position));
        } else if (char === '>' && next === '=') {
            this.position += 2;
            this.tokens.push(new Token('OPERATOR', '>=', start, this.position));
        } else if (char === '&' && next === '&') {
            this.position += 2;
            this.tokens.push(new Token('OPERATOR', '&&', start, this.position));
        } else if (char === '|' && next === '|') {
            this.position += 2;
            this.tokens.push(new Token('OPERATOR', '||', start, this.position));
        } else if (char === '+' && next === '+') {
            this.position += 2;
            this.tokens.push(new Token('OPERATOR', '++', start, this.position));
        } else if (char === '-' && next === '-') {
            this.position += 2;
            this.tokens.push(new Token('OPERATOR', '--', start, this.position));
        }
        // Single-character operators and punctuation
        else {
            this.position++;
            const type = '()[]{},.;:?'.includes(char) ? 'PUNCTUATION' : 'OPERATOR';
            this.tokens.push(new Token(type, char, start, this.position));
        }
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }

    parse() {
        if (this.isAtEnd()) {
            throw new Error('Empty expression');
        }
        const expr = this.parseExpression();

        // Allow optional trailing semicolon
        this.match('PUNCTUATION', ';');

        if (!this.isAtEnd()) {
            throw new Error(`Unexpected token: ${this.current().value}`);
        }
        return expr;
    }

    parseExpression() {
        return this.parseAssignment();
    }

    parseAssignment() {
        const expr = this.parseTernary();

        if (this.match('OPERATOR', '=')) {
            const value = this.parseAssignment();
            if (expr.type === 'Identifier' || expr.type === 'MemberExpression') {
                return {
                    type: 'AssignmentExpression',
                    left: expr,
                    operator: '=',
                    right: value
                };
            }
            throw new Error('Invalid assignment target');
        }

        return expr;
    }

    parseTernary() {
        const expr = this.parseLogicalOr();

        if (this.match('PUNCTUATION', '?')) {
            const consequent = this.parseExpression();
            this.consume('PUNCTUATION', ':');
            const alternate = this.parseExpression();
            return {
                type: 'ConditionalExpression',
                test: expr,
                consequent,
                alternate
            };
        }

        return expr;
    }

    parseLogicalOr() {
        let expr = this.parseLogicalAnd();

        while (this.match('OPERATOR', '||')) {
            const operator = this.previous().value;
            const right = this.parseLogicalAnd();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }

        return expr;
    }

    parseLogicalAnd() {
        let expr = this.parseEquality();

        while (this.match('OPERATOR', '&&')) {
            const operator = this.previous().value;
            const right = this.parseEquality();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }

        return expr;
    }

    parseEquality() {
        let expr = this.parseRelational();

        while (this.match('OPERATOR', '==', '!=', '===', '!==')) {
            const operator = this.previous().value;
            const right = this.parseRelational();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }

        return expr;
    }

    parseRelational() {
        let expr = this.parseAdditive();

        while (this.match('OPERATOR', '<', '>', '<=', '>=')) {
            const operator = this.previous().value;
            const right = this.parseAdditive();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }

        return expr;
    }

    parseAdditive() {
        let expr = this.parseMultiplicative();

        while (this.match('OPERATOR', '+', '-')) {
            const operator = this.previous().value;
            const right = this.parseMultiplicative();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }

        return expr;
    }

    parseMultiplicative() {
        let expr = this.parseUnary();

        while (this.match('OPERATOR', '*', '/', '%')) {
            const operator = this.previous().value;
            const right = this.parseUnary();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }

        return expr;
    }

    parseUnary() {
        // Handle prefix increment/decrement
        if (this.match('OPERATOR', '++', '--')) {
            const operator = this.previous().value;
            const argument = this.parseUnary();
            return {
                type: 'UpdateExpression',
                operator,
                argument,
                prefix: true
            };
        }

        // Handle other unary operators
        if (this.match('OPERATOR', '!', '-', '+')) {
            const operator = this.previous().value;
            const argument = this.parseUnary();
            return {
                type: 'UnaryExpression',
                operator,
                argument,
                prefix: true
            };
        }

        return this.parsePostfix();
    }

    parsePostfix() {
        let expr = this.parseMember();

        // Handle postfix increment/decrement
        if (this.match('OPERATOR', '++', '--')) {
            const operator = this.previous().value;
            return {
                type: 'UpdateExpression',
                operator,
                argument: expr,
                prefix: false
            };
        }

        return expr;
    }

    parseMember() {
        let expr = this.parsePrimary();

        while (true) {
            if (this.match('PUNCTUATION', '.')) {
                const property = this.consume('IDENTIFIER');
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property: { type: 'Identifier', name: property.value },
                    computed: false
                };
            } else if (this.match('PUNCTUATION', '[')) {
                const property = this.parseExpression();
                this.consume('PUNCTUATION', ']');
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property,
                    computed: true
                };
            } else if (this.match('PUNCTUATION', '(')) {
                const args = this.parseArguments();
                expr = {
                    type: 'CallExpression',
                    callee: expr,
                    arguments: args
                };
            } else {
                break;
            }
        }

        return expr;
    }

    parseArguments() {
        const args = [];

        if (!this.check('PUNCTUATION', ')')) {
            do {
                args.push(this.parseExpression());
            } while (this.match('PUNCTUATION', ','));
        }

        this.consume('PUNCTUATION', ')');
        return args;
    }

    parsePrimary() {
        // Numbers
        if (this.match('NUMBER')) {
            return { type: 'Literal', value: this.previous().value };
        }

        // Strings
        if (this.match('STRING')) {
            return { type: 'Literal', value: this.previous().value };
        }

        // Booleans
        if (this.match('BOOLEAN')) {
            return { type: 'Literal', value: this.previous().value };
        }

        // Null
        if (this.match('NULL')) {
            return { type: 'Literal', value: null };
        }

        // Undefined
        if (this.match('UNDEFINED')) {
            return { type: 'Literal', value: undefined };
        }

        // Identifiers
        if (this.match('IDENTIFIER')) {
            return { type: 'Identifier', name: this.previous().value };
        }

        // Grouping expressions
        if (this.match('PUNCTUATION', '(')) {
            const expr = this.parseExpression();
            this.consume('PUNCTUATION', ')');
            return expr;
        }

        // Array literals
        if (this.match('PUNCTUATION', '[')) {
            return this.parseArrayLiteral();
        }

        // Object literals
        if (this.match('PUNCTUATION', '{')) {
            return this.parseObjectLiteral();
        }

        throw new Error(`Unexpected token: ${this.current().type} "${this.current().value}"`);
    }

    parseArrayLiteral() {
        const elements = [];

        while (!this.check('PUNCTUATION', ']') && !this.isAtEnd()) {
            elements.push(this.parseExpression());
            if (this.match('PUNCTUATION', ',')) {
                // Handle trailing comma
                if (this.check('PUNCTUATION', ']')) {
                    break;
                }
            } else {
                break;
            }
        }

        this.consume('PUNCTUATION', ']');
        return {
            type: 'ArrayExpression',
            elements
        };
    }

    parseObjectLiteral() {
        const properties = [];

        while (!this.check('PUNCTUATION', '}') && !this.isAtEnd()) {
            let key;
            let computed = false;

            if (this.match('STRING')) {
                key = { type: 'Literal', value: this.previous().value };
            } else if (this.match('IDENTIFIER')) {
                const name = this.previous().value;
                key = { type: 'Identifier', name };
            } else if (this.match('PUNCTUATION', '[')) {
                key = this.parseExpression();
                computed = true;
                this.consume('PUNCTUATION', ']');
            } else {
                throw new Error('Expected property key');
            }

            this.consume('PUNCTUATION', ':');
            const value = this.parseExpression();

            properties.push({
                type: 'Property',
                key,
                value,
                computed,
                shorthand: false
            });

            if (this.match('PUNCTUATION', ',')) {
                // Handle trailing comma
                if (this.check('PUNCTUATION', '}')) {
                    break;
                }
            } else {
                break;
            }
        }

        this.consume('PUNCTUATION', '}');
        return {
            type: 'ObjectExpression',
            properties
        };
    }

    match(...args) {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (i === 0 && args.length > 1) {
                // First arg is type when multiple args provided
                const type = arg;
                for (let j = 1; j < args.length; j++) {
                    if (this.check(type, args[j])) {
                        this.advance();
                        return true;
                    }
                }
                return false;
            } else if (args.length === 1) {
                // Single arg is just type
                if (this.checkType(arg)) {
                    this.advance();
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    check(type, value) {
        if (this.isAtEnd()) return false;
        if (value !== undefined) {
            return this.current().type === type && this.current().value === value;
        }
        return this.current().type === type;
    }

    checkType(type) {
        if (this.isAtEnd()) return false;
        return this.current().type === type;
    }

    advance() {
        if (!this.isAtEnd()) this.position++;
        return this.previous();
    }

    isAtEnd() {
        return this.current().type === 'EOF';
    }

    current() {
        return this.tokens[this.position];
    }

    previous() {
        return this.tokens[this.position - 1];
    }

    consume(type, value) {
        if (value !== undefined) {
            if (this.check(type, value)) return this.advance();
            throw new Error(`Expected ${type} "${value}" but got ${this.current().type} "${this.current().value}"`);
        }
        if (this.check(type)) return this.advance();
        throw new Error(`Expected ${type} but got ${this.current().type} "${this.current().value}"`);
    }
}

class Evaluator {
    evaluate({ node, scope = {}, context = null, forceBindingRootScopeToFunctions = true }) {
        switch (node.type) {
            case 'Literal':
                return node.value;

            case 'Identifier':
                if (node.name in scope) {
                    const value = scope[node.name];

                    this.checkForDangerousValues(value)

                    // If it's a function and we're accessing it directly (not calling it),
                    // bind it to scope to preserve 'this' context for later calls
                    if (typeof value === 'function') {
                        return value.bind(scope);
                    }

                    return value;
                }

                throw new Error(`Undefined variable: ${node.name}`);

            case 'MemberExpression':
                const object = this.evaluate({ node: node.object, scope, context, forceBindingRootScopeToFunctions });
                if (object == null) {
                    throw new Error('Cannot read property of null or undefined');
                }

                let property;
                if (node.computed) {
                    property = this.evaluate({ node: node.property, scope, context, forceBindingRootScopeToFunctions });
                } else {
                    property = node.property.name;
                }

                this.checkForDangerousKeywords(property)

                let memberValue = object[property];

                this.checkForDangerousValues(memberValue)

                // If the accessed value is a function, bind it based on forceBindingRootScopeToFunctions flag
                if (typeof memberValue === 'function') {
                    if (forceBindingRootScopeToFunctions) {
                        return memberValue.bind(scope);
                    } else {
                        return memberValue.bind(object);
                    }
                }

                return memberValue;

            case 'CallExpression':
                const args = node.arguments.map(arg => this.evaluate({ node: arg, scope, context, forceBindingRootScopeToFunctions }));

                let returnValue;

                if (node.callee.type === 'MemberExpression') {
                    // For member expressions, get the object and function separately to preserve context
                    const obj = this.evaluate({ node: node.callee.object, scope, context, forceBindingRootScopeToFunctions });
                    
                    let prop;
                    if (node.callee.computed) {
                        prop = this.evaluate({ node: node.callee.property, scope, context, forceBindingRootScopeToFunctions });
                    } else {
                        prop = node.callee.property.name
                    }

                    this.checkForDangerousKeywords(prop)

                    let func = obj[prop];
                    if (typeof func !== 'function') {
                        throw new Error('Value is not a function');
                    }

                    // For member expressions, always use the object as the 'this' context
                    returnValue = func.apply(obj, args);
                } else {
                    // For direct function calls (identifiers), get the original function and apply context
                    if (node.callee.type === 'Identifier') {
                        const name = node.callee.name;

                        let func;
                        if (name in scope) {
                            func = scope[name];
                        } else {
                            throw new Error(`Undefined variable: ${name}`);
                        }

                        if (typeof func !== 'function') {
                            throw new Error('Value is not a function');
                        }

                        // For direct calls, use provided context or the scope
                        const thisContext = context !== null ? context : scope;
                        returnValue = func.apply(thisContext, args);
                    } else {
                        // For other expressions
                        const callee = this.evaluate({ node: node.callee, scope, context, forceBindingRootScopeToFunctions });
                        if (typeof callee !== 'function') {
                            throw new Error('Value is not a function');
                        }

                        // For other expressions, use provided context
                        returnValue = callee.apply(context, args);
                    }
                }

                this.checkForDangerousValues(returnValue)
                
                return returnValue

            case 'UnaryExpression':
                const argument = this.evaluate({ node: node.argument, scope, context, forceBindingRootScopeToFunctions });
                switch (node.operator) {
                    case '!': return !argument;
                    case '-': return -argument;
                    case '+': return +argument;
                    default:
                        throw new Error(`Unknown unary operator: ${node.operator}`);
                }

            case 'UpdateExpression':
                if (node.argument.type === 'Identifier') {
                    const name = node.argument.name;
                    if (!(name in scope)) {
                        throw new Error(`Undefined variable: ${name}`);
                    }

                    const oldValue = scope[name];
                    if (node.operator === '++') {
                        scope[name] = oldValue + 1;
                    } else if (node.operator === '--') {
                        scope[name] = oldValue - 1;
                    }

                    return node.prefix ? scope[name] : oldValue;
                } else if (node.argument.type === 'MemberExpression') {
                    const obj = this.evaluate({ node: node.argument.object, scope, context, forceBindingRootScopeToFunctions });
                    const prop = node.argument.computed
                        ? this.evaluate({ node: node.argument.property, scope, context, forceBindingRootScopeToFunctions })
                        : node.argument.property.name;

                    const oldValue = obj[prop];
                    if (node.operator === '++') {
                        obj[prop] = oldValue + 1;
                    } else if (node.operator === '--') {
                        obj[prop] = oldValue - 1;
                    }

                    return node.prefix ? obj[prop] : oldValue;
                }
                throw new Error('Invalid update expression target');

            case 'BinaryExpression':
                const left = this.evaluate({ node: node.left, scope, context, forceBindingRootScopeToFunctions });
                const right = this.evaluate({ node: node.right, scope, context, forceBindingRootScopeToFunctions });

                switch (node.operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return left / right;
                    case '%': return left % right;
                    case '==': return left == right;
                    case '!=': return left != right;
                    case '===': return left === right;
                    case '!==': return left !== right;
                    case '<': return left < right;
                    case '>': return left > right;
                    case '<=': return left <= right;
                    case '>=': return left >= right;
                    case '&&': return left && right;
                    case '||': return left || right;
                    default:
                        throw new Error(`Unknown binary operator: ${node.operator}`);
                }

            case 'ConditionalExpression':
                const test = this.evaluate({ node: node.test, scope, context, forceBindingRootScopeToFunctions });
                return test
                    ? this.evaluate({ node: node.consequent, scope, context, forceBindingRootScopeToFunctions })
                    : this.evaluate({ node: node.alternate, scope, context, forceBindingRootScopeToFunctions });

            case 'AssignmentExpression':
                const value = this.evaluate({ node: node.right, scope, context, forceBindingRootScopeToFunctions });

                if (node.left.type === 'Identifier') {
                    scope[node.left.name] = value;
                    return value;
                } else if (node.left.type === 'MemberExpression') {
                    throw new Error('Property assignments are prohibited in the CSP build')
                }
                throw new Error('Invalid assignment target');

            case 'ArrayExpression':
                return node.elements.map(el => this.evaluate({ node: el, scope, context, forceBindingRootScopeToFunctions }));

            case 'ObjectExpression':
                const result = {};
                for (const prop of node.properties) {
                    const key = prop.computed
                        ? this.evaluate({ node: prop.key, scope, context, forceBindingRootScopeToFunctions })
                        : prop.key.type === 'Identifier'
                            ? prop.key.name
                            : this.evaluate({ node: prop.key, scope, context, forceBindingRootScopeToFunctions });
                    const value = this.evaluate({ node: prop.value, scope, context, forceBindingRootScopeToFunctions });
                    result[key] = value;
                }
                return result;

            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    checkForDangerousKeywords(keyword) {
        let blacklist = [
            'constructor', 'prototype', '__proto__',
            '__defineGetter__', '__defineSetter__',
            'insertAdjacentHTML',
        ]
        
        if (blacklist.includes(keyword)) {
            throw new Error(`Accessing "${keyword}" is prohibited in the CSP build`)
        }
    }

    checkForDangerousValues(prop) {
        if (prop === null) {
            return
        }
        
        if (typeof prop !== 'object' && typeof prop !== 'function') {
            return
        }

        if (safemap.has(prop)) {
            return
        }
        
        if (prop instanceof HTMLIFrameElement || prop instanceof HTMLScriptElement) {
            throw new Error('Accessing iframes and scripts is prohibited in the CSP build')
        }

        if (globals.has(prop)) {
            throw new Error('Accessing global variables is prohibited in the CSP build')
        }

        safemap.set(prop, true)

        return true
    }
}

export function generateRuntimeFunction(expression) {
    try {
        const tokenizer = new Tokenizer(expression);
        const tokens = tokenizer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const evaluator = new Evaluator();

        return function(options = {}) {
            const { scope = {}, context = null, forceBindingRootScopeToFunctions = false } = options;
            // Use the scope directly - mutations are expected for assignments
            return evaluator.evaluate({ node: ast, scope, context, forceBindingRootScopeToFunctions });
        };
    } catch (error) {
        throw new Error(`CSP Parser Error: ${error.message}`);
    }
}

// Also export the individual components for testing
export { Tokenizer, Parser, Evaluator };