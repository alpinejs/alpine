import { describe, it, expect } from 'vitest'

import { convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP } from '../../packages/csp/src/parser'

describe('CSP (Content Security Policy)', () => {
    it('should handle basic literals', () => {
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('true')()).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('false')()).toEqual(false)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('null')()).toEqual(null)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('undefined')()).toEqual(undefined)
    })

    it('should handle numbers', () => {
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('42')()).toEqual(42)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('3.14')()).toEqual(3.14)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('-5')()).toEqual(-5)
    })

    it('should handle strings', () => {
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('"hello"')()).toEqual('hello')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP("'world'")()).toEqual('world')
    })

    it('should handle simple variable access', () => {
        const fn = convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count')
        expect(fn({ count: 5 })).toEqual(5)
    })

    it('should handle dot notation', () => {
        const fn = convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user.name')
        expect(fn({ user: { name: 'John' } })).toEqual('John')
    })

    it('should handle arithmetic operations', () => {
        const scope = { a: 10, b: 5 }
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('a + b')(scope)).toEqual(15)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('a - b')(scope)).toEqual(5)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('a * b')(scope)).toEqual(50)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('a / b')(scope)).toEqual(2)
    })

    it('should handle comparisons', () => {
        const scope = { count: 5, max: 10 }
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count < max')(scope)).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count > max')(scope)).toEqual(false)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count === 5')(scope)).toEqual(true)
    })

    it('should handle logical operations', () => {
        const scope = { isVisible: true, isEnabled: false }
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('isVisible && isEnabled')(scope)).toEqual(false)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('isVisible || isEnabled')(scope)).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('!isEnabled')(scope)).toEqual(true)
    })

    it('should handle complex expressions', () => {
        const scope = {
            count: 5,
            max: 10,
            isVisible: true,
            user: { name: 'John', age: 30 },
            items: ['apple', 'banana']
        }

        // Complex boolean logic
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count < max && isVisible')(scope)).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count > max || !isVisible')(scope)).toEqual(false)

        // Arithmetic with comparisons
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count + 5 === 10')(scope)).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user.age > 25')(scope)).toEqual(true)

        // Multiple comparisons
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count >= 5 && count <= 10')(scope)).toEqual(true)
    })

    it('should handle edge cases', () => {
        const scope = { empty: '', zero: 0, false: false }

        // Empty string comparisons
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('empty === ""')(scope)).toEqual(true)

        // Zero comparisons
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('zero === 0')(scope)).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('zero < 1')(scope)).toEqual(true)

        // Boolean edge cases
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('false === false')(scope)).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('!false')(scope)).toEqual(true)
    })

    it('should handle function calls', () => {
        const scope = {
            add: (a, b) => a + b,
            multiply: (a, b) => a * b,
            greet: (name) => `Hello ${name}!`,
            getLength: (str) => str.length,
            isEven: (num) => num % 2 === 0
        }

        // Simple function calls
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('add(5, 3)')(scope)).toEqual(8)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('multiply(4, 6)')(scope)).toEqual(24)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('greet("John")')(scope)).toEqual('Hello John!')

        // Function calls with expressions as arguments
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('add(2 + 3, 4)')(scope)).toEqual(9)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('getLength("hello")')(scope)).toEqual(5)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('isEven(10)')(scope)).toEqual(true)
    })

    it('should handle function calls with variables', () => {
        const scope = {
            add: (a, b) => a + b,
            formatName: (first, last) => `${first} ${last}`,
            count: 5,
            name: 'John',
            surname: 'Doe'
        }

        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('add(count, 3)')(scope)).toEqual(8)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('formatName(name, surname)')(scope)).toEqual('John Doe')
    })

    it('should handle the this context', () => {
        const context = { value: 42, name: 'context' }
        const scope = { getValue: function() { return this.value } }

        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('this.value')({}, [], context)).toEqual(42)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('this.name')({}, [], context)).toEqual('context')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('getValue()')(scope, [], context)).toEqual(42)
    })

    it('should handle params array', () => {
        const scope = { add: (a, b) => a + b }
        const params = [10, 20, 30]

        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('add(params[0], params[1])')(scope, params)).toEqual(30)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('params[2]')(scope, params)).toEqual(30)
    })

    it('should handle complex function calls', () => {
        const scope = {
            calculate: (a, b, c) => a * b + c,
            format: (name, age) => `${name} is ${age} years old`,
            user: { name: 'Alice', age: 25 }
        }

        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('calculate(2, 3, 4)')(scope)).toEqual(10)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('format(user.name, user.age)')(scope)).toEqual('Alice is 25 years old')
    })

    it('should handle JavaScript proxies', () => {
        // Create a proxy that returns 'foo' for any property access
        const proxyScope = new Proxy({}, {
            get(target, prop) {
                if (prop === 'foo') {
                    return 'magic foo value'
                }
                if (prop === 'bar') {
                    return 42
                }
                if (prop === 'nested') {
                    return new Proxy({}, {
                        get(target, nestedProp) {
                            if (nestedProp === 'value') {
                                return 'nested magic value'
                            }
                            return undefined
                        }
                    })
                }
                return undefined
            }
        })

        // Test simple property access through proxy
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('foo')(proxyScope)).toEqual('magic foo value')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('bar')(proxyScope)).toEqual(42)

        // Test dot notation through proxy
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('nested.value')(proxyScope)).toEqual('nested magic value')

        // Test expressions with proxy values
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('bar > 40')(proxyScope)).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('foo === "magic foo value"')(proxyScope)).toEqual(true)

        // Test function calls with proxy values
        const scopeWithFunctions = new Proxy({}, {
            get(target, prop) {
                if (prop === 'getLength') {
                    return (str) => str.length
                }
                if (prop === 'add') {
                    return (a, b) => a + b
                }
                // Delegate to the original proxy for other properties
                return proxyScope[prop]
            }
        })

        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('getLength(foo)')(scopeWithFunctions)).toEqual(15)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('add(bar, 8)')(scopeWithFunctions)).toEqual(50)
    })

    it('should handle object scope', () => {
        const scope = {
            $wire: 'foo'
        }

        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('$wire')(scope)).toEqual('foo')
    })

    it('should handle increment and decrement operators', () => {
        const scope = { count: 5, index: 0, value: 10, nested: { count: 10 } }

        // Postfix increment (returns original value, then increments)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count++')(scope)).toEqual(5)
        expect(scope.count).toEqual(6) // Variable should be updated

        // Nested increment
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('nested.count++')(scope)).toEqual(10)
        expect(scope.nested.count).toEqual(11) // Variable should be updated

        // Postfix decrement
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('count--')(scope)).toEqual(6)
        expect(scope.count).toEqual(5) // Variable should be updated

        // Prefix increment (increments first, then returns new value)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('++index')(scope)).toEqual(1)
        expect(scope.index).toEqual(1) // Variable should be updated

        // Prefix decrement
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('--value')(scope)).toEqual(9)
        expect(scope.value).toEqual(9) // Variable should be updated
    })

    it.skip('should handle increment/decrement with complex expressions', () => {
        const scope = { a: 1, b: 2, c: 3 }

        // Increment in comparison
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('a++ === 1')(scope)).toEqual(true)
        expect(scope.a).toEqual(2)

        // Decrement in logical expression
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('b-- > 0 && c > 2')(scope)).toEqual(true)
        expect(scope.b).toEqual(1)

        // Multiple operations
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('++a + b-- + ++c')(scope)).toEqual(7) // 3 + 1 + 4
        expect(scope.a).toEqual(3)
        expect(scope.b).toEqual(0)
        expect(scope.c).toEqual(4)
    })

    it('should handle increment/decrement edge cases', () => {
        const scope = { zero: 0, negative: -1, large: 1000 }

        // Increment from zero
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('zero++')(scope)).toEqual(0)
        expect(scope.zero).toEqual(1)

        // Decrement negative number
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('negative--')(scope)).toEqual(-1)
        expect(scope.negative).toEqual(-2)

        // Large numbers
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('++large')(scope)).toEqual(1001)
        expect(scope.large).toEqual(1001)

        // Decrement large number
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('large--')(scope)).toEqual(1001)
        expect(scope.large).toEqual(1000)
    })

    it('should throw error for non-numeric increment/decrement', () => {
        const scope = { text: 'hello', bool: true, obj: {} }

        // Should throw for string
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('text++')(scope)
        }).toThrow('Cannot increment/decrement non-numeric value: text')

        // Should throw for boolean
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('bool--')(scope)
        }).toThrow('Cannot increment/decrement non-numeric value: bool')

        // Should throw for object
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('++obj')(scope)
        }).toThrow('Cannot increment/decrement non-numeric value: obj')
    })

    it('should throw error for undefined variables', () => {
        const scope = { existing: 5 }

        // Should throw for undefined variable
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('undefinedVar++')(scope)
        }).toThrow('Variable not found: undefinedVar')

        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('--missingVar')(scope)
        }).toThrow('Variable not found: missingVar')
    })

    it('should handle object literals', () => {
        // Empty object
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{}')()).toEqual({})

        // Object with simple key-value pairs
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{name: "John", age: 30}')()).toEqual({
            name: 'John',
            age: 30
        })

        // Object with quoted keys
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{"first-name": "John", "last-name": "Doe"}')()).toEqual({
            'first-name': 'John',
            'last-name': 'Doe'
        })

        // Object with single quoted keys
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP("{'title': 'Developer', 'level': 'Senior'}")()).toEqual({
            'title': 'Developer',
            'level': 'Senior'
        })

        // Mixed key types
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{id: 1, "type": "user", active: true}')()).toEqual({
            id: 1,
            type: 'user',
            active: true
        })
    })

    it('should handle object literals with expressions', () => {
        const scope = { count: 5, name: 'Alice', isActive: true }

        // Object with variable values
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{id: count, name: name, active: isActive}')(scope)).toEqual({
            id: 5,
            name: 'Alice',
            active: true
        })

        // Object with computed values
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{nextId: count + 1, greeting: "Hello " + name}')(scope)).toEqual({
            nextId: 6,
            greeting: 'Hello Alice'
        })

        // Object with boolean expressions
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{isEven: count % 2 === 0, isPositive: count > 0}')(scope)).toEqual({
            isEven: false,
            isPositive: true
        })
    })

    it('should handle nested object literals', () => {
        // Nested objects
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{user: {name: "John", age: 30}}')()).toEqual({
            user: { name: 'John', age: 30 }
        })

        // Deep nesting
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{data: {user: {profile: {name: "John"}}}}')()).toEqual({
            data: { user: { profile: { name: 'John' } } }
        })

        // Mixed with arrays
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{items: [1, 2, 3], config: {enabled: true}}')()).toEqual({
            items: [1, 2, 3],
            config: { enabled: true }
        })
    })

    it.skip('should handle object literals with function calls', () => {
        const scope = {
            getName: () => 'John',
            getAge: () => 30,
            format: (prefix, name) => `${prefix} ${name}`
        }

        // Object with function calls
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{name: getName(), age: getAge()}')(scope)).toEqual({
            name: 'John',
            age: 30
        })

        // Object with function calls with parameters
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{greeting: format("Hello", "John")}')(scope)).toEqual({
            greeting: 'Hello John'
        })
    })

    it('should handle object literals with complex expressions', () => {
        const scope = { count: 5, items: [1, 2, 3], user: { name: 'John' } }

        // Object with array access
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{firstItem: items[0], userName: user.name}')(scope)).toEqual({
            firstItem: 1,
            userName: 'John'
        })

        // Object with conditional expressions
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{status: count > 3 ? "high" : "low", type: count % 2 === 0 ? "even" : "odd"}')(scope)).toEqual({
            status: 'high',
            type: 'odd'
        })

        // Object with arithmetic expressions
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{doubled: count * 2, squared: count * count}')(scope)).toEqual({
            doubled: 10,
            squared: 25
        })
    })

    it('should handle edge cases for object literals', () => {
        // Object with empty values
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{empty: "", zero: 0, null: null, undefined: undefined}')()).toEqual({
            empty: '',
            zero: 0,
            null: null,
            undefined: undefined
        })

        // Object with special characters in keys
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{"key-with-dashes": "value", "key_with_underscores": "value2"}')()).toEqual({
            'key-with-dashes': 'value',
            'key_with_underscores': 'value2'
        })

        // Object with numeric keys
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{"0": "zero", "1": "one"}')()).toEqual({
            '0': 'zero',
            '1': 'one'
        })
    })

    it('should throw errors for invalid object literals', () => {
        // Missing colon
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{name "John"}')()
        }).toThrow('Expected colon after object key')

        // Invalid key
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{123: "value"}')()
        }).toThrow('Invalid object key: 123')

        // Missing closing brace
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('{name: "John"')()
        }).toThrow()
    })

    it('supports string concatenation', () => {
        const result = convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('"Hello " + "World"')()

        expect(result).toEqual('Hello World')
    })

    it('supports async/await', async () => {
        let scope = {
            getName: async () => 'John'
        }

        // assert "await getName()" returns a promise that resolves to "John"
        const result = await convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('await getName()')(scope)
        expect(result).toEqual('John')
    })

    it('supports assignment operations', () => {
        const scope = {
            name: 'John',
            age: 30,
            user: { profile: { name: 'Alice' } },
            nested: { deep: { value: 42 } }
        }

        // Simple assignment
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('name = "Jane"')(scope)).toEqual('Jane')
        expect(scope.name).toEqual('Jane')

        // Assignment with variable
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('age = 25')(scope)).toEqual(25)
        expect(scope.age).toEqual(25)

        // Assignment with expression
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('age = age + 5')(scope)).toEqual(30)
        expect(scope.age).toEqual(30)

        // Nested property assignment
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user.profile.name = "Bob"')(scope)).toEqual('Bob')
        expect(scope.user.profile.name).toEqual('Bob')

        // Deep nested assignment
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('nested.deep.value = 100')(scope)).toEqual(100)
        expect(scope.nested.deep.value).toEqual(100)

        // Assignment with complex expression
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('age = age * 2')(scope)).toEqual(60)
        expect(scope.age).toEqual(60)
    })

    it('supports assignment with function calls', () => {
        const scope = {
            getName: () => 'John',
            getAge: () => 25,
            user: { profile: {} }
        }

        // Assignment with function call
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('name = getName()')(scope)).toEqual('John')
        expect(scope.name).toEqual('John')

        // Nested assignment with function call
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user.profile.age = getAge()')(scope)).toEqual(25)
        expect(scope.user.profile.age).toEqual(25)
    })

    it('throws error for assignment to undefined nested property', () => {
        const scope = { user: {} }

        // Should throw when trying to assign to undefined nested property
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user.profile.name = "John"')(scope)
        }).toThrow('Cannot assign to undefined property: user.profile')
    })

    it('supports array notation property access', () => {
        const scope = {
            user: { name: 'John', age: 30 },
            items: ['apple', 'banana', 'cherry'],
            data: {
                'first-name': 'Jane',
                'last-name': 'Doe',
                '123': 'numeric key',
                'special.key': 'dot in key'
            },
            index: 1,
            key: 'name'
        }

        // Basic array notation with string literal
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user["name"]')(scope)).toEqual('John')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user["age"]')(scope)).toEqual(30)

        // Array notation with variable key
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user[key]')(scope)).toEqual('John')

        // Array notation with numeric index
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('items[0]')(scope)).toEqual('apple')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('items[1]')(scope)).toEqual('banana')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('items[index]')(scope)).toEqual('banana')

        // Array notation with special keys
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('data["first-name"]')(scope)).toEqual('Jane')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('data["123"]')(scope)).toEqual('numeric key')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('data["special.key"]')(scope)).toEqual('dot in key')

        // Nested array notation
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('data["first-name"]')(scope)).toEqual('Jane')
    })

    it('supports array notation in expressions', () => {
        const scope = {
            user: { name: 'John', age: 30 },
            items: [10, 20, 30],
            index: 1,
            key: 'age'
        }

        // Array notation in arithmetic expressions
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('items[0] + items[1]')(scope)).toEqual(30)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user[key] * 2')(scope)).toEqual(60)

        // Array notation in comparisons
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('items[index] > 15')(scope)).toEqual(true)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user["name"] === "John"')(scope)).toEqual(true)

        // Array notation in logical expressions
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('items[0] > 5 && items[1] < 25')(scope)).toEqual(true)
    })

    it('supports array notation assignment', () => {
        const scope = {
            user: { name: 'John', age: 30 },
            items: ['apple', 'banana', 'cherry'],
            data: {},
            index: 1,
            key: 'status'
        }

        // Assignment using array notation
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user["status"] = "active"')(scope)).toEqual('active')
        expect(scope.user.status).toEqual('active')

        // Assignment using variable key
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('user[key] = "inactive"')(scope)).toEqual('inactive')
        expect(scope.user.status).toEqual('inactive')

        // Assignment to array elements
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('items[0] = "orange"')(scope)).toEqual('orange')
        expect(scope.items[0]).toEqual('orange')

        // Assignment using variable index
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('items[index] = "grape"')(scope)).toEqual('grape')
        expect(scope.items[1]).toEqual('grape')

        // Assignment to new properties
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('data["new-key"] = "new-value"')(scope)).toEqual('new-value')
        expect(scope.data['new-key']).toEqual('new-value')
    })

    it.skip('supports nested array notation', () => {
        const scope = {
            users: [
                { name: 'John', profile: { age: 30 } },
                { name: 'Jane', profile: { age: 25 } }
            ],
            data: {
                items: [
                    { id: 1, value: 'first' },
                    { id: 2, value: 'second' }
                ]
            },
            index: 0,
            key: 'name'
        }

        // Nested array notation access
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('users[0]["name"]')(scope)).toEqual('John')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('users[index][key]')(scope)).toEqual('John')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('users[0].profile["age"]')(scope)).toEqual(30)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('data["items"][0]["value"]')(scope)).toEqual('first')

        // Nested array notation assignment
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('users[0]["status"] = "active"')(scope)).toEqual('active')
        expect(scope.users[0].status).toEqual('active')

        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('data["items"][1]["status"] = "pending"')(scope)).toEqual('pending')
        expect(scope.data.items[1].status).toEqual('pending')
    })

    it('handles array notation edge cases', () => {
        const scope = {
            obj: {},
            arr: [],
            key: 'test',
            index: 0
        }

        // Accessing undefined properties
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('obj["nonexistent"]')(scope)).toEqual(undefined)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('arr[5]')(scope)).toEqual(undefined)

        // Accessing with undefined variables
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('obj[undefined]')(scope)).toEqual(undefined)
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('arr[undefined]')(scope)).toEqual(undefined)

        // Mixed dot and bracket notation
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('obj["key"] = "value"')(scope)).toEqual('value')
        expect(convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('obj.key')(scope)).toEqual('value')
    })

    it('throws error for invalid array notation', () => {
        const scope = { obj: {} }

        // Missing closing bracket
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('obj["key"')(scope)
        }).toThrow()

        // Missing opening bracket
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('obj"key"]')(scope)
        }).toThrow()

        // Empty brackets
        expect(() => {
            convertJsExpressionIntoRuntimeFunctionWithoutViolatingCSP('obj[]')(scope)
        }).toThrow()
    })

})
