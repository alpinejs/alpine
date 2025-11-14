// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { generateRuntimeFunction } from '../../packages/csp/src/parser.js';

describe('CSP Parser', () => {
    describe('Literals', () => {
        it('should parse numbers', () => {
            expect(generateRuntimeFunction('42')()).toBe(42);
            expect(generateRuntimeFunction('-3.14')()).toBe(-3.14);
            expect(generateRuntimeFunction('0')()).toBe(0);
        });

        it('should parse strings', () => {
            expect(generateRuntimeFunction('"hello"')()).toBe('hello');
            expect(generateRuntimeFunction("'world'")()).toBe('world');
            expect(generateRuntimeFunction('"escaped \\"quotes\\""')()).toBe('escaped "quotes"');
            expect(generateRuntimeFunction("'mixed \"quotes\"'")()).toBe('mixed "quotes"');
        });

        it('should parse booleans', () => {
            expect(generateRuntimeFunction('true')()).toBe(true);
            expect(generateRuntimeFunction('false')()).toBe(false);
        });

        it('should parse null and undefined', () => {
            expect(generateRuntimeFunction('null')()).toBe(null);
            expect(generateRuntimeFunction('undefined')()).toBe(undefined);
        });
    });

    describe('Variable Access', () => {
        it('should access simple variables', () => {
            const scope = { foo: 'bar', count: 5 };
            expect(generateRuntimeFunction('foo')({ scope })).toBe('bar');
            expect(generateRuntimeFunction('count')({ scope })).toBe(5);
        });

        it('should throw on undefined variables', () => {
            expect(() => generateRuntimeFunction('nonExistent')()).toThrow('Undefined variable');
        });

        it('should not access global variables by default when called with no parameters', () => {
            expect(() => generateRuntimeFunction('console')()).toThrow('Undefined variable: console');
            expect(() => generateRuntimeFunction('Math')()).toThrow('Undefined variable: Math');
            expect(() => generateRuntimeFunction('JSON')()).toThrow('Undefined variable: JSON');
        });

        it('should prefer scope over globals', () => {
            const scope = { console: 'local console' };
            expect(generateRuntimeFunction('console')({ scope })).toBe('local console');
        });

        it('should not access global variables', () => {
            expect(() => generateRuntimeFunction('console')()).toThrow('Undefined variable: console');
            expect(() => generateRuntimeFunction('Math')()).toThrow('Undefined variable: Math');
            expect(() => generateRuntimeFunction('JSON')()).toThrow('Undefined variable: JSON');
        });
    });

    describe('Property Access', () => {
        it('should access properties with dot notation', () => {
            const scope = {
                user: { name: 'John', age: 30 },
                nested: { deep: { value: 'found' } }
            };
            expect(generateRuntimeFunction('user.name')({ scope })).toBe('John');
            expect(generateRuntimeFunction('user.age')({ scope })).toBe(30);
            expect(generateRuntimeFunction('nested.deep.value')({ scope })).toBe('found');
        });

        it('should access properties with bracket notation', () => {
            const scope = {
                obj: { foo: 'bar', 'with-dash': 'works' },
                key: 'foo'
            };
            expect(generateRuntimeFunction('obj["foo"]')({ scope })).toBe('bar');
            expect(generateRuntimeFunction('obj["with-dash"]')({ scope })).toBe('works');
            expect(generateRuntimeFunction('obj[key]')({ scope })).toBe('bar');
        });

        it('should handle computed property access', () => {
            const scope = {
                arr: [1, 2, 3],
                index: 1
            };
            expect(generateRuntimeFunction('arr[index]')({ scope })).toBe(2);
            expect(generateRuntimeFunction('arr[0]')({ scope })).toBe(1);
        });

        it('should throw on null/undefined property access', () => {
            const scope = { nullValue: null };
            expect(() => generateRuntimeFunction('nullValue.prop')({ scope })).toThrow('Cannot read property');
        });
    });

    describe('Function Calls', () => {
        it('should call functions without arguments', () => {
            const scope = {
                getValue: () => 42,
                getText: function() { return 'hello'; }
            };
            expect(generateRuntimeFunction('getValue()')({ scope })).toBe(42);
            expect(generateRuntimeFunction('getText()')({ scope })).toBe('hello');
        });

        it('should call functions with arguments', () => {
            const scope = {
                add: (a, b) => a + b,
                greet: (name) => `Hello, ${name}!`
            };
            expect(generateRuntimeFunction('add(2, 3)')({ scope })).toBe(5);
            expect(generateRuntimeFunction('greet("World")')({ scope })).toBe('Hello, World!');
        });

        it('should call methods on objects', () => {
            const scope = {
                obj: {
                    value: 10,
                    getValue: function() { return this.value; },
                    add: function(n) { return this.value + n; }
                }
            };
            expect(generateRuntimeFunction('obj.getValue()')({ scope })).toBe(10);
            expect(generateRuntimeFunction('obj.add(5)')({ scope })).toBe(15);
        });

        it('should preserve this context in method calls', () => {
            const scope = {
                counter: {
                    count: 0,
                    increment: function() { this.count++; return this.count; }
                }
            };
            expect(generateRuntimeFunction('counter.increment()')({ scope })).toBe(1);
            expect(scope.counter.count).toBe(1);
        });

        it('should call nested methods', () => {
            const scope = {
                api: {
                    users: {
                        get: (id) => ({ id, name: 'User' + id })
                    }
                }
            };
            expect(generateRuntimeFunction('api.users.get(1)')({ scope })).toEqual({ id: 1, name: 'User1' });
        });

        it('should call methods with scope', () => {
            const scope = {
                foo: {
                    bar: 'baz',
                    change() { this.bar = 'qux' }
                }
            };

            let fn = generateRuntimeFunction('foo.change')({ scope, forceBindingRootScopeToFunctions: false })

            fn.apply(fn, [])

            expect(scope.foo.bar).toEqual('qux');
        });

        it('should call methods with root scope instead of nested scope if forceBindingRootScopeToFunctions is true', () => {
            const scope = {
                foo: {
                    bar: 'baz',
                    change() { this.foo.bar = 'qux' }
                }
            };

            let fn = generateRuntimeFunction('foo.change')({ scope, forceBindingRootScopeToFunctions: true })

            fn.apply(fn, [])

            expect(scope.foo.bar).toEqual('qux');
        });
    });

    describe('Array Literals', () => {
        it('should parse empty arrays', () => {
            expect(generateRuntimeFunction('[]')()).toEqual([]);
        });

        it('should parse arrays with literals', () => {
            expect(generateRuntimeFunction('[1, 2, 3]')()).toEqual([1, 2, 3]);
            expect(generateRuntimeFunction('["a", "b", "c"]')()).toEqual(['a', 'b', 'c']);
            expect(generateRuntimeFunction('[true, false, null]')()).toEqual([true, false, null]);
        });

        it('should parse arrays with variables', () => {
            const scope = { a: 1, b: 2, c: 3 };
            expect(generateRuntimeFunction('[a, b, c]')({ scope })).toEqual([1, 2, 3]);
        });

        it('should parse nested arrays', () => {
            expect(generateRuntimeFunction('[[1, 2], [3, 4]]')()).toEqual([[1, 2], [3, 4]]);
        });
    });

    describe('Object Literals', () => {
        it('should parse empty objects', () => {
            expect(generateRuntimeFunction('{}')()).toEqual({});
        });

        it('should parse objects with simple properties', () => {
            expect(generateRuntimeFunction('{ foo: "bar", count: 42 }')()).toEqual({ foo: 'bar', count: 42 });
        });

        it('should parse objects with string keys', () => {
            expect(generateRuntimeFunction('{ "foo-bar": 1, "with space": 2 }')()).toEqual({
                'foo-bar': 1,
                'with space': 2
            });
        });

        it('should parse objects with variable values', () => {
            const scope = { value: 'test', num: 100 };
            expect(generateRuntimeFunction('{ prop: value, count: num }')({ scope })).toEqual({
                prop: 'test',
                count: 100
            });
        });

        it('should parse nested objects', () => {
            expect(generateRuntimeFunction('{ outer: { inner: "value" } }')()).toEqual({
                outer: { inner: 'value' }
            });
        });
    });

    describe('Arithmetic Operators', () => {
        it('should handle addition', () => {
            expect(generateRuntimeFunction('2 + 3')()).toBe(5);
            expect(generateRuntimeFunction('10.5 + 0.5')()).toBe(11);
        });

        it('should handle subtraction', () => {
            expect(generateRuntimeFunction('10 - 3')()).toBe(7);
            expect(generateRuntimeFunction('5.5 - 0.5')()).toBe(5);
        });

        it('should handle multiplication', () => {
            expect(generateRuntimeFunction('4 * 5')()).toBe(20);
            expect(generateRuntimeFunction('2.5 * 2')()).toBe(5);
        });

        it('should handle division', () => {
            expect(generateRuntimeFunction('10 / 2')()).toBe(5);
            expect(generateRuntimeFunction('7 / 2')()).toBe(3.5);
        });

        it('should handle modulo', () => {
            expect(generateRuntimeFunction('10 % 3')()).toBe(1);
            expect(generateRuntimeFunction('8 % 2')()).toBe(0);
        });

        it('should handle string concatenation', () => {
            expect(generateRuntimeFunction('"Hello" + " " + "World"')()).toBe('Hello World');
            const scope = { name: 'John' };
            expect(generateRuntimeFunction('"Hello, " + name')({ scope })).toBe('Hello, John');
        });

        it('should respect operator precedence', () => {
            expect(generateRuntimeFunction('2 + 3 * 4')()).toBe(14);
            expect(generateRuntimeFunction('(2 + 3) * 4')()).toBe(20);
            expect(generateRuntimeFunction('10 - 2 * 3')()).toBe(4);
        });
    });

    describe('Comparison Operators', () => {
        it('should handle equality', () => {
            expect(generateRuntimeFunction('5 == 5')()).toBe(true);
            expect(generateRuntimeFunction('5 == "5"')()).toBe(true);
            expect(generateRuntimeFunction('5 === 5')()).toBe(true);
            expect(generateRuntimeFunction('5 === "5"')()).toBe(false);
        });

        it('should handle inequality', () => {
            expect(generateRuntimeFunction('5 != 3')()).toBe(true);
            expect(generateRuntimeFunction('5 != 5')()).toBe(false);
            expect(generateRuntimeFunction('5 !== "5"')()).toBe(true);
            expect(generateRuntimeFunction('5 !== 5')()).toBe(false);
        });

        it('should handle relational operators', () => {
            expect(generateRuntimeFunction('5 > 3')()).toBe(true);
            expect(generateRuntimeFunction('3 > 5')()).toBe(false);
            expect(generateRuntimeFunction('5 >= 5')()).toBe(true);
            expect(generateRuntimeFunction('3 < 5')()).toBe(true);
            expect(generateRuntimeFunction('5 <= 5')()).toBe(true);
        });
    });

    describe('Logical Operators', () => {
        it('should handle logical AND', () => {
            expect(generateRuntimeFunction('true && true')()).toBe(true);
            expect(generateRuntimeFunction('true && false')()).toBe(false);
            expect(generateRuntimeFunction('5 > 3 && 2 < 4')()).toBe(true);
        });

        it('should handle logical OR', () => {
            expect(generateRuntimeFunction('true || false')()).toBe(true);
            expect(generateRuntimeFunction('false || false')()).toBe(false);
            expect(generateRuntimeFunction('5 > 10 || 2 < 4')()).toBe(true);
        });

        it('should handle logical NOT', () => {
            expect(generateRuntimeFunction('!true')()).toBe(false);
            expect(generateRuntimeFunction('!false')()).toBe(true);
            expect(generateRuntimeFunction('!(5 > 3)')()).toBe(false);
        });

        it('should handle complex logical expressions', () => {
            const scope = { a: true, b: false, c: true };
            expect(generateRuntimeFunction('a && (b || c)')({ scope })).toBe(true);
            expect(generateRuntimeFunction('!a || (b && c)')({ scope })).toBe(false);
        });
    });

    describe('Unary Operators', () => {
        it('should handle unary minus', () => {
            expect(generateRuntimeFunction('-5')()).toBe(-5);
            expect(generateRuntimeFunction('-(2 + 3)')()).toBe(-5);
            const scope = { value: 10 };
            expect(generateRuntimeFunction('-value')({ scope })).toBe(-10);
        });

        it('should handle unary plus', () => {
            expect(generateRuntimeFunction('+5')()).toBe(5);
            expect(generateRuntimeFunction('+"5"')()).toBe(5);
            expect(generateRuntimeFunction('+true')()).toBe(1);
        });
    });

    describe('Conditional (Ternary) Operator', () => {
        it('should handle simple ternary', () => {
            expect(generateRuntimeFunction('true ? 1 : 2')()).toBe(1);
            expect(generateRuntimeFunction('false ? 1 : 2')()).toBe(2);
        });

        it('should handle ternary with expressions', () => {
            const scope = { age: 20 };
            expect(generateRuntimeFunction('age >= 18 ? "adult" : "minor"')({ scope })).toBe('adult');
            scope.age = 15;
            expect(generateRuntimeFunction('age >= 18 ? "adult" : "minor"')({ scope })).toBe('minor');
        });

        it('should handle nested ternary', () => {
            const scope = { score: 85 };
            expect(generateRuntimeFunction('score >= 90 ? "A" : score >= 80 ? "B" : "C"')({ scope })).toBe('B');
        });
    });

    describe('Assignment Operators', () => {
        it('should handle simple assignment', () => {
            const scope = { x: 0 };
            expect(generateRuntimeFunction('x = 5')({ scope })).toBe(5);
            expect(scope.x).toBe(5);
        });

        it('should handle chained assignment', () => {
            const scope = { a: 0, b: 0 };
            expect(generateRuntimeFunction('a = b = 5')({ scope })).toBe(5);
            expect(scope.a).toBe(5);
            expect(scope.b).toBe(5);
        });
    });

    describe('Increment/Decrement Operators', () => {
        it('should handle prefix increment', () => {
            const scope = { x: 5 };
            expect(generateRuntimeFunction('++x')({ scope })).toBe(6);
            expect(scope.x).toBe(6);
        });

        it('should handle postfix increment', () => {
            const scope = { x: 5 };
            expect(generateRuntimeFunction('x++')({ scope })).toBe(5);
            expect(scope.x).toBe(6);
        });

        it('should handle prefix decrement', () => {
            const scope = { x: 5 };
            expect(generateRuntimeFunction('--x')({ scope })).toBe(4);
            expect(scope.x).toBe(4);
        });

        it('should handle postfix decrement', () => {
            const scope = { x: 5 };
            expect(generateRuntimeFunction('x--')({ scope })).toBe(5);
            expect(scope.x).toBe(4);
        });

        it('should handle increment on properties', () => {
            const scope = { obj: { count: 10 } };
            expect(generateRuntimeFunction('obj.count++')({ scope })).toBe(10);
            expect(scope.obj.count).toBe(11);
            expect(generateRuntimeFunction('++obj.count')({ scope })).toBe(12);
            expect(scope.obj.count).toBe(12);
        });
    });

    describe('Complex Expressions', () => {
        it('should handle mixed operators with correct precedence', () => {
            expect(generateRuntimeFunction('2 + 3 * 4 - 1')()).toBe(13);
            expect(generateRuntimeFunction('(2 + 3) * (4 - 1)')()).toBe(15);
            expect(generateRuntimeFunction('10 / 2 + 3 * 2')()).toBe(11);
        });

        it('should handle complex conditions', () => {
            const scope = {
                user: { role: 'admin', active: true },
                permissions: ['read', 'write', 'delete']
            };
            expect(generateRuntimeFunction('user.role === "admin" && user.active')({ scope })).toBe(true);
            expect(generateRuntimeFunction('user.role === "user" || user.active')({ scope })).toBe(true);
        });

        it('should handle method calls with complex arguments', () => {
            const scope = {
                math: {
                    add: (a, b) => a + b,
                    multiply: (a, b) => a * b
                },
                x: 2,
                y: 3
            };
            expect(generateRuntimeFunction('math.add(x * 2, y + 1)')({ scope })).toBe(8);
            expect(generateRuntimeFunction('math.multiply(math.add(x, y), 2)')({ scope })).toBe(10);
        });
    });

    describe('Context (this) Handling', () => {
        it('should use provided context', () => {
            const context = { value: 42 };
            const scope = {
                getValue: function() { return this.value; }
            };
            expect(generateRuntimeFunction('getValue()')({ scope, context })).toBe(42);
        });

        it('should preserve method context over provided context', () => {
            const context = { value: 99 };
            const scope = {
                obj: {
                    value: 42,
                    getValue: function() { return this.value; }
                }
            };
            expect(generateRuntimeFunction('obj.getValue()')({ scope, context })).toBe(42);
        });
    });

    describe('Error Handling', () => {
        it('should provide helpful parse errors', () => {
            expect(() => generateRuntimeFunction('5 +')).toThrow('CSP Parser Error');
            expect(() => generateRuntimeFunction('{ foo: }')).toThrow('CSP Parser Error');
            expect(() => generateRuntimeFunction('"unclosed string')).toThrow('Unterminated string');
        });

        it('should provide helpful runtime errors', () => {
            expect(() => generateRuntimeFunction('nonExistent')()).toThrow('Undefined variable');
            expect(() => generateRuntimeFunction('5()')()).toThrow('not a function');
            expect(() => generateRuntimeFunction('null.prop')()).toThrow('Cannot read property');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty input gracefully', () => {
            expect(() => generateRuntimeFunction('')).toThrow('CSP Parser Error');
        });

        it('should handle whitespace', () => {
            expect(generateRuntimeFunction('  5  ')()).toBe(5);
            expect(generateRuntimeFunction('2   +   3')()).toBe(5);
            expect(generateRuntimeFunction('  true   ?   1   :   2  ')()).toBe(1);
        });

        it('should handle line comments', () => {
            expect(generateRuntimeFunction('5 // this is a comment')()).toBe(5);
            expect(generateRuntimeFunction('2 + 3 // add numbers')()).toBe(5);
        });

        it('should handle deeply nested expressions', () => {
            const scope = {
                a: { b: { c: { d: { e: 'deep' } } } }
            };
            expect(generateRuntimeFunction('a.b.c.d.e')({ scope })).toBe('deep');
        });

        it('should handle complex nested structures', () => {
            const scope = {
                data: {
                    users: [
                        { name: 'Alice', scores: [90, 85, 88] },
                        { name: 'Bob', scores: [78, 92, 85] }
                    ]
                },
                index: 1
            };
            expect(generateRuntimeFunction('data.users[index].name')({ scope })).toBe('Bob');
            expect(generateRuntimeFunction('data.users[0].scores[2]')({ scope })).toBe(88);
        });
    });

    describe('Unsupported Features', () => {
        it('should not support arrow functions', () => {
            expect(() => generateRuntimeFunction('() => 5')).toThrow();
        });

        it('should not support function expressions', () => {
            expect(() => generateRuntimeFunction('function() { return 5; }')).toThrow();
        });

        it('should not support template literals', () => {
            expect(() => generateRuntimeFunction('`hello`')).toThrow();
        });

        it('should not support spread operator', () => {
            expect(() => generateRuntimeFunction('[...arr]')).toThrow();
            expect(() => generateRuntimeFunction('{ ...obj }')).toThrow();
        });

        it('should not support destructuring', () => {
            expect(() => generateRuntimeFunction('{ a, b } = obj')).toThrow();
            expect(() => generateRuntimeFunction('[a, b] = arr')).toThrow();
        });

        it('should not support optional chaining', () => {
            expect(() => generateRuntimeFunction('obj?.prop')).toThrow();
        });

        it('should not support nullish coalescing', () => {
            expect(() => generateRuntimeFunction('value ?? default')).toThrow();
        });

        it('should not support compound assignment', () => {
            expect(() => generateRuntimeFunction('x += 5')).toThrow();
            expect(() => generateRuntimeFunction('x *= 2')).toThrow();
        });

        it('should not support new operator', () => {
            expect(() => generateRuntimeFunction('new Date()')).toThrow();
        });

        it('should not support typeof operator', () => {
            expect(() => generateRuntimeFunction('typeof value')).toThrow();
        });

        it('should not support in operator', () => {
            expect(() => generateRuntimeFunction('"prop" in obj')).toThrow();
        });

        it('should not support instanceof operator', () => {
            expect(() => generateRuntimeFunction('obj instanceof Array')).toThrow();
        });

        it('should not support void operator', () => {
            expect(() => generateRuntimeFunction('void 0')).toThrow();
        });

        it('should not support delete operator', () => {
            expect(() => generateRuntimeFunction('delete obj.prop')).toThrow();
        });

        it('should not support regex literals', () => {
            expect(() => generateRuntimeFunction('/pattern/g')).toThrow();
        });

        it('should not support class expressions', () => {
            expect(() => generateRuntimeFunction('class Foo {}')).toThrow();
        });

        it('should not support async/await', () => {
            expect(() => generateRuntimeFunction('async function() {}')).toThrow();
            expect(() => generateRuntimeFunction('await promise')).toThrow();
        });

        it('should not support generators', () => {
            expect(() => generateRuntimeFunction('function* gen() {}')).toThrow();
            expect(() => generateRuntimeFunction('yield value')).toThrow();
        });

        it('should not support dynamic code execution', () => {
            // eval is not accessible as a global
            expect(() => generateRuntimeFunction('eval("code")')()).toThrow('Undefined variable: eval');

            // new operator is not supported by parser
            expect(() => generateRuntimeFunction('new Function("code")')).toThrow();
        });

        it('should not call global functions', () => {
            expect(() => generateRuntimeFunction('parseInt("42")')()).toThrow();
            expect(() => generateRuntimeFunction('Math.max(1, 2, 3)')()).toThrow();
            expect(() => generateRuntimeFunction('JSON.stringify({a: 1})')()).toThrow();
        });

        it('should not handle property assignment', () => {
            expect(() => generateRuntimeFunction('obj.prop = 10')()).toThrow();
        });

        it('should not handle computed property assignment', () => {
            expect(() => generateRuntimeFunction('obj[key] = 20')()).toThrow();
        });
    });

    describe('Trailing Semicolons', () => {
        it('should handle expressions with trailing semicolons', () => {
            expect(generateRuntimeFunction('42;')()).toBe(42);
            expect(generateRuntimeFunction('"hello";')()).toBe('hello');
            expect(generateRuntimeFunction('true;')()).toBe(true);
            expect(generateRuntimeFunction('null;')()).toBe(null);
        });

        it('should handle complex expressions with trailing semicolons', () => {
            expect(generateRuntimeFunction('2 + 3;')()).toBe(5);
            expect(generateRuntimeFunction('10 > 5;')()).toBe(true);
            expect(generateRuntimeFunction('false || true;')()).toBe(true);

            const scope = { name: 'world' };
            expect(generateRuntimeFunction('"hello " + name;')({ scope })).toBe('hello world');
        });

        it('should handle function calls with trailing semicolons', () => {
            const scope = {
                getValue: () => 42,
                obj: {
                    method: function() { return this.name; },
                    name: 'test'
                }
            };

            expect(generateRuntimeFunction('getValue();')({ scope })).toBe(42);
            expect(generateRuntimeFunction('obj.method();')({ scope })).toBe('test');
        });

        it('should handle assignments with trailing semicolons', () => {
            const scope = { x: 0, obj: { prop: 5 } };

            expect(generateRuntimeFunction('x = 10;')({ scope })).toBe(10);
            expect(scope.x).toBe(10);
        });

        it('should handle increment/decrement with trailing semicolons', () => {
            const scope = { count: 5 };

            expect(generateRuntimeFunction('++count;')({ scope })).toBe(6);
            expect(scope.count).toBe(6);

            expect(generateRuntimeFunction('count--;')({ scope })).toBe(6);
            expect(scope.count).toBe(5);
        });

        it('should work with ternary expressions and trailing semicolons', () => {
            expect(generateRuntimeFunction('true ? "yes" : "no";')()).toBe('yes');
            expect(generateRuntimeFunction('false ? 1 : 2;')()).toBe(2);

            const scope = { age: 25 };
            expect(generateRuntimeFunction('age >= 18 ? "adult" : "minor";')({ scope })).toBe('adult');
        });

        it('should work without semicolons (backward compatibility)', () => {
            expect(generateRuntimeFunction('42')()).toBe(42);
            expect(generateRuntimeFunction('2 + 3')()).toBe(5);
            expect(generateRuntimeFunction('true ? "yes" : "no"')()).toBe('yes');
        });
    });
});