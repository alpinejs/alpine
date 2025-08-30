import { describe, it, expect } from 'vitest';
import { evaluate } from './parser.js';

describe('CSP Parser', () => {
    describe('Literals', () => {
        it('should parse numbers', () => {
            expect(evaluate('42')()).toBe(42);
            expect(evaluate('-3.14')()).toBe(-3.14);
            expect(evaluate('0')()).toBe(0);
        });

        it('should parse strings', () => {
            expect(evaluate('"hello"')()).toBe('hello');
            expect(evaluate("'world'")()).toBe('world');
            expect(evaluate('"escaped \\"quotes\\""')()).toBe('escaped "quotes"');
            expect(evaluate("'mixed \"quotes\"'")()).toBe('mixed "quotes"');
        });

        it('should parse booleans', () => {
            expect(evaluate('true')()).toBe(true);
            expect(evaluate('false')()).toBe(false);
        });

        it('should parse null and undefined', () => {
            expect(evaluate('null')()).toBe(null);
            expect(evaluate('undefined')()).toBe(undefined);
        });
    });

    describe('Variable Access', () => {
        it('should access simple variables', () => {
            const scope = { foo: 'bar', count: 5 };
            expect(evaluate('foo')(scope)).toBe('bar');
            expect(evaluate('count')(scope)).toBe(5);
        });

        it('should throw on undefined variables', () => {
            expect(() => evaluate('nonExistent')()).toThrow('Undefined variable');
        });
    });

    describe('Property Access', () => {
        it('should access properties with dot notation', () => {
            const scope = { 
                user: { name: 'John', age: 30 },
                nested: { deep: { value: 'found' } }
            };
            expect(evaluate('user.name')(scope)).toBe('John');
            expect(evaluate('user.age')(scope)).toBe(30);
            expect(evaluate('nested.deep.value')(scope)).toBe('found');
        });

        it('should access properties with bracket notation', () => {
            const scope = { 
                obj: { foo: 'bar', 'with-dash': 'works' },
                key: 'foo'
            };
            expect(evaluate('obj["foo"]')(scope)).toBe('bar');
            expect(evaluate('obj["with-dash"]')(scope)).toBe('works');
            expect(evaluate('obj[key]')(scope)).toBe('bar');
        });

        it('should handle computed property access', () => {
            const scope = {
                arr: [1, 2, 3],
                index: 1
            };
            expect(evaluate('arr[index]')(scope)).toBe(2);
            expect(evaluate('arr[0]')(scope)).toBe(1);
        });

        it('should throw on null/undefined property access', () => {
            const scope = { nullValue: null };
            expect(() => evaluate('nullValue.prop')(scope)).toThrow('Cannot read property');
        });
    });

    describe('Function Calls', () => {
        it('should call functions without arguments', () => {
            const scope = {
                getValue: () => 42,
                getText: function() { return 'hello'; }
            };
            expect(evaluate('getValue()')(scope)).toBe(42);
            expect(evaluate('getText()')(scope)).toBe('hello');
        });

        it('should call functions with arguments', () => {
            const scope = {
                add: (a, b) => a + b,
                greet: (name) => `Hello, ${name}!`
            };
            expect(evaluate('add(2, 3)')(scope)).toBe(5);
            expect(evaluate('greet("World")')(scope)).toBe('Hello, World!');
        });

        it('should call methods on objects', () => {
            const scope = {
                obj: {
                    value: 10,
                    getValue: function() { return this.value; },
                    add: function(n) { return this.value + n; }
                }
            };
            expect(evaluate('obj.getValue()')(scope)).toBe(10);
            expect(evaluate('obj.add(5)')(scope)).toBe(15);
        });

        it('should preserve this context in method calls', () => {
            const scope = {
                counter: {
                    count: 0,
                    increment: function() { this.count++; return this.count; }
                }
            };
            expect(evaluate('counter.increment()')(scope)).toBe(1);
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
            expect(evaluate('api.users.get(1)')(scope)).toEqual({ id: 1, name: 'User1' });
        });
    });

    describe('Array Literals', () => {
        it('should parse empty arrays', () => {
            expect(evaluate('[]')()).toEqual([]);
        });

        it('should parse arrays with literals', () => {
            expect(evaluate('[1, 2, 3]')()).toEqual([1, 2, 3]);
            expect(evaluate('["a", "b", "c"]')()).toEqual(['a', 'b', 'c']);
            expect(evaluate('[true, false, null]')()).toEqual([true, false, null]);
        });

        it('should parse arrays with variables', () => {
            const scope = { a: 1, b: 2, c: 3 };
            expect(evaluate('[a, b, c]')(scope)).toEqual([1, 2, 3]);
        });

        it('should parse nested arrays', () => {
            expect(evaluate('[[1, 2], [3, 4]]')()).toEqual([[1, 2], [3, 4]]);
        });
    });

    describe('Object Literals', () => {
        it('should parse empty objects', () => {
            expect(evaluate('{}')()).toEqual({});
        });

        it('should parse objects with simple properties', () => {
            expect(evaluate('{ foo: "bar", count: 42 }')()).toEqual({ foo: 'bar', count: 42 });
        });

        it('should parse objects with string keys', () => {
            expect(evaluate('{ "foo-bar": 1, "with space": 2 }')()).toEqual({ 
                'foo-bar': 1, 
                'with space': 2 
            });
        });

        it('should parse objects with variable values', () => {
            const scope = { value: 'test', num: 100 };
            expect(evaluate('{ prop: value, count: num }')(scope)).toEqual({ 
                prop: 'test', 
                count: 100 
            });
        });

        it('should parse nested objects', () => {
            expect(evaluate('{ outer: { inner: "value" } }')()).toEqual({ 
                outer: { inner: 'value' } 
            });
        });
    });

    describe('Arithmetic Operators', () => {
        it('should handle addition', () => {
            expect(evaluate('2 + 3')()).toBe(5);
            expect(evaluate('10.5 + 0.5')()).toBe(11);
        });

        it('should handle subtraction', () => {
            expect(evaluate('10 - 3')()).toBe(7);
            expect(evaluate('5.5 - 0.5')()).toBe(5);
        });

        it('should handle multiplication', () => {
            expect(evaluate('4 * 5')()).toBe(20);
            expect(evaluate('2.5 * 2')()).toBe(5);
        });

        it('should handle division', () => {
            expect(evaluate('10 / 2')()).toBe(5);
            expect(evaluate('7 / 2')()).toBe(3.5);
        });

        it('should handle modulo', () => {
            expect(evaluate('10 % 3')()).toBe(1);
            expect(evaluate('8 % 2')()).toBe(0);
        });

        it('should handle string concatenation', () => {
            expect(evaluate('"Hello" + " " + "World"')()).toBe('Hello World');
            const scope = { name: 'John' };
            expect(evaluate('"Hello, " + name')(scope)).toBe('Hello, John');
        });

        it('should respect operator precedence', () => {
            expect(evaluate('2 + 3 * 4')()).toBe(14);
            expect(evaluate('(2 + 3) * 4')()).toBe(20);
            expect(evaluate('10 - 2 * 3')()).toBe(4);
        });
    });

    describe('Comparison Operators', () => {
        it('should handle equality', () => {
            expect(evaluate('5 == 5')()).toBe(true);
            expect(evaluate('5 == "5"')()).toBe(true);
            expect(evaluate('5 === 5')()).toBe(true);
            expect(evaluate('5 === "5"')()).toBe(false);
        });

        it('should handle inequality', () => {
            expect(evaluate('5 != 3')()).toBe(true);
            expect(evaluate('5 != 5')()).toBe(false);
            expect(evaluate('5 !== "5"')()).toBe(true);
            expect(evaluate('5 !== 5')()).toBe(false);
        });

        it('should handle relational operators', () => {
            expect(evaluate('5 > 3')()).toBe(true);
            expect(evaluate('3 > 5')()).toBe(false);
            expect(evaluate('5 >= 5')()).toBe(true);
            expect(evaluate('3 < 5')()).toBe(true);
            expect(evaluate('5 <= 5')()).toBe(true);
        });
    });

    describe('Logical Operators', () => {
        it('should handle logical AND', () => {
            expect(evaluate('true && true')()).toBe(true);
            expect(evaluate('true && false')()).toBe(false);
            expect(evaluate('5 > 3 && 2 < 4')()).toBe(true);
        });

        it('should handle logical OR', () => {
            expect(evaluate('true || false')()).toBe(true);
            expect(evaluate('false || false')()).toBe(false);
            expect(evaluate('5 > 10 || 2 < 4')()).toBe(true);
        });

        it('should handle logical NOT', () => {
            expect(evaluate('!true')()).toBe(false);
            expect(evaluate('!false')()).toBe(true);
            expect(evaluate('!(5 > 3)')()).toBe(false);
        });

        it('should handle complex logical expressions', () => {
            const scope = { a: true, b: false, c: true };
            expect(evaluate('a && (b || c)')(scope)).toBe(true);
            expect(evaluate('!a || (b && c)')(scope)).toBe(false);
        });
    });

    describe('Unary Operators', () => {
        it('should handle unary minus', () => {
            expect(evaluate('-5')()).toBe(-5);
            expect(evaluate('-(2 + 3)')()).toBe(-5);
            const scope = { value: 10 };
            expect(evaluate('-value')(scope)).toBe(-10);
        });

        it('should handle unary plus', () => {
            expect(evaluate('+5')()).toBe(5);
            expect(evaluate('+"5"')()).toBe(5);
            expect(evaluate('+true')()).toBe(1);
        });
    });

    describe('Conditional (Ternary) Operator', () => {
        it('should handle simple ternary', () => {
            expect(evaluate('true ? 1 : 2')()).toBe(1);
            expect(evaluate('false ? 1 : 2')()).toBe(2);
        });

        it('should handle ternary with expressions', () => {
            const scope = { age: 20 };
            expect(evaluate('age >= 18 ? "adult" : "minor"')(scope)).toBe('adult');
            scope.age = 15;
            expect(evaluate('age >= 18 ? "adult" : "minor"')(scope)).toBe('minor');
        });

        it('should handle nested ternary', () => {
            const scope = { score: 85 };
            expect(evaluate('score >= 90 ? "A" : score >= 80 ? "B" : "C"')(scope)).toBe('B');
        });
    });

    describe('Assignment Operators', () => {
        it('should handle simple assignment', () => {
            const scope = { x: 0 };
            expect(evaluate('x = 5')(scope)).toBe(5);
            expect(scope.x).toBe(5);
        });

        it('should handle property assignment', () => {
            const scope = { obj: { prop: 0 } };
            expect(evaluate('obj.prop = 10')(scope)).toBe(10);
            expect(scope.obj.prop).toBe(10);
        });

        it('should handle computed property assignment', () => {
            const scope = { 
                obj: { foo: 0 },
                key: 'foo'
            };
            expect(evaluate('obj[key] = 20')(scope)).toBe(20);
            expect(scope.obj.foo).toBe(20);
        });

        it('should handle chained assignment', () => {
            const scope = { a: 0, b: 0 };
            expect(evaluate('a = b = 5')(scope)).toBe(5);
            expect(scope.a).toBe(5);
            expect(scope.b).toBe(5);
        });
    });

    describe('Increment/Decrement Operators', () => {
        it('should handle prefix increment', () => {
            const scope = { x: 5 };
            expect(evaluate('++x')(scope)).toBe(6);
            expect(scope.x).toBe(6);
        });

        it('should handle postfix increment', () => {
            const scope = { x: 5 };
            expect(evaluate('x++')(scope)).toBe(5);
            expect(scope.x).toBe(6);
        });

        it('should handle prefix decrement', () => {
            const scope = { x: 5 };
            expect(evaluate('--x')(scope)).toBe(4);
            expect(scope.x).toBe(4);
        });

        it('should handle postfix decrement', () => {
            const scope = { x: 5 };
            expect(evaluate('x--')(scope)).toBe(5);
            expect(scope.x).toBe(4);
        });

        it('should handle increment on properties', () => {
            const scope = { obj: { count: 10 } };
            expect(evaluate('obj.count++')(scope)).toBe(10);
            expect(scope.obj.count).toBe(11);
            expect(evaluate('++obj.count')(scope)).toBe(12);
            expect(scope.obj.count).toBe(12);
        });
    });

    describe('Complex Expressions', () => {
        it('should handle mixed operators with correct precedence', () => {
            expect(evaluate('2 + 3 * 4 - 1')()).toBe(13);
            expect(evaluate('(2 + 3) * (4 - 1)')()).toBe(15);
            expect(evaluate('10 / 2 + 3 * 2')()).toBe(11);
        });

        it('should handle complex conditions', () => {
            const scope = { 
                user: { role: 'admin', active: true },
                permissions: ['read', 'write', 'delete']
            };
            expect(evaluate('user.role === "admin" && user.active')(scope)).toBe(true);
            expect(evaluate('user.role === "user" || user.active')(scope)).toBe(true);
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
            expect(evaluate('math.add(x * 2, y + 1)')(scope)).toBe(8);
            expect(evaluate('math.multiply(math.add(x, y), 2)')(scope)).toBe(10);
        });
    });

    describe('Context (this) Handling', () => {
        it('should use provided context', () => {
            const context = { value: 42 };
            const scope = {
                getValue: function() { return this.value; }
            };
            expect(evaluate('getValue()')(scope, context)).toBe(42);
        });

        it('should preserve method context over provided context', () => {
            const context = { value: 99 };
            const scope = {
                obj: {
                    value: 42,
                    getValue: function() { return this.value; }
                }
            };
            expect(evaluate('obj.getValue()')(scope, context)).toBe(42);
        });
    });

    describe('Error Handling', () => {
        it('should provide helpful parse errors', () => {
            expect(() => evaluate('5 +')).toThrow('CSP Parser Error');
            expect(() => evaluate('{ foo: }')).toThrow('CSP Parser Error');
            expect(() => evaluate('"unclosed string')).toThrow('Unterminated string');
        });

        it('should provide helpful runtime errors', () => {
            expect(() => evaluate('nonExistent')()).toThrow('Undefined variable');
            expect(() => evaluate('5()')()).toThrow('not a function');
            expect(() => evaluate('null.prop')()).toThrow('Cannot read property');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty input gracefully', () => {
            expect(() => evaluate('')).toThrow('CSP Parser Error');
        });

        it('should handle whitespace', () => {
            expect(evaluate('  5  ')()).toBe(5);
            expect(evaluate('2   +   3')()).toBe(5);
            expect(evaluate('  true   ?   1   :   2  ')()).toBe(1);
        });

        it('should handle line comments', () => {
            expect(evaluate('5 // this is a comment')()).toBe(5);
            expect(evaluate('2 + 3 // add numbers')()).toBe(5);
        });

        it('should handle deeply nested expressions', () => {
            const scope = {
                a: { b: { c: { d: { e: 'deep' } } } }
            };
            expect(evaluate('a.b.c.d.e')(scope)).toBe('deep');
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
            expect(evaluate('data.users[index].name')(scope)).toBe('Bob');
            expect(evaluate('data.users[0].scores[2]')(scope)).toBe(88);
        });
    });

    describe('Unsupported Features', () => {
        it('should not support arrow functions', () => {
            expect(() => evaluate('() => 5')).toThrow();
        });

        it('should not support function expressions', () => {
            expect(() => evaluate('function() { return 5; }')).toThrow();
        });

        it('should not support template literals', () => {
            expect(() => evaluate('`hello`')).toThrow();
        });

        it('should not support spread operator', () => {
            expect(() => evaluate('[...arr]')).toThrow();
            expect(() => evaluate('{ ...obj }')).toThrow();
        });

        it('should not support destructuring', () => {
            expect(() => evaluate('{ a, b } = obj')).toThrow();
            expect(() => evaluate('[a, b] = arr')).toThrow();
        });

        it('should not support optional chaining', () => {
            expect(() => evaluate('obj?.prop')).toThrow();
        });

        it('should not support nullish coalescing', () => {
            expect(() => evaluate('value ?? default')).toThrow();
        });

        it('should not support compound assignment', () => {
            expect(() => evaluate('x += 5')).toThrow();
            expect(() => evaluate('x *= 2')).toThrow();
        });

        it('should not support new operator', () => {
            expect(() => evaluate('new Date()')).toThrow();
        });

        it('should not support typeof operator', () => {
            expect(() => evaluate('typeof value')).toThrow();
        });

        it('should not support in operator', () => {
            expect(() => evaluate('"prop" in obj')).toThrow();
        });

        it('should not support instanceof operator', () => {
            expect(() => evaluate('obj instanceof Array')).toThrow();
        });

        it('should not support void operator', () => {
            expect(() => evaluate('void 0')).toThrow();
        });

        it('should not support delete operator', () => {
            expect(() => evaluate('delete obj.prop')).toThrow();
        });

        it('should not support regex literals', () => {
            expect(() => evaluate('/pattern/g')).toThrow();
        });

        it('should not support class expressions', () => {
            expect(() => evaluate('class Foo {}')).toThrow();
        });

        it('should not support async/await', () => {
            expect(() => evaluate('async function() {}')).toThrow();
            expect(() => evaluate('await promise')).toThrow();
        });

        it('should not support generators', () => {
            expect(() => evaluate('function* gen() {}')).toThrow();
            expect(() => evaluate('yield value')).toThrow();
        });

        it('should not support dynamic code execution', () => {
            // Parser can parse these calls, but they fail at runtime without unsafe globals
            const scope1 = {}; // No eval in scope
            expect(() => evaluate('eval("code")')(scope1)).toThrow('Undefined variable');
            
            // new operator is not supported by parser
            expect(() => evaluate('new Function("code")')).toThrow();
        });
    });
});