// @vitest-environment jsdom

import { describe, it, expect, beforeAll } from 'vitest';
import Alpine from '../../packages/csp/src/index.js';
import { cspRawEvaluator } from '../../packages/csp/src/evaluator.js';

beforeAll(() => Alpine.start())

describe('cspRawEvaluator', () => {
    it('simple expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, '42')).toBe(42)
    });

    it('with scope', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, 'foo', { scope: { foo: 42 } })).toBe(42)
    });

    it('with params', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, 'fn', { scope: { fn: (i) => i }, params: [42] })).toBe(42)
    });

    it('auto-evaluating function expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let scope = { getAnswer: () => 42 }

        expect(cspRawEvaluator(element, 'getAnswer()', { scope })).toBe(42)
    });

    it('non auto-evaluating function expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let scope = { getAnswer: () => 42 }

        Alpine.dontAutoEvaluateFunctions(() => {
            let fn = cspRawEvaluator(element, 'getAnswer', { scope })
            expect(fn()).toBe(42)
        })
    });

    it('property access', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let scope = { user: { name: 'John' } }

        expect(cspRawEvaluator(element, 'user.name', { scope })).toBe('John')
    });

    it('method calls preserve context', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let scope = {
            counter: {
                count: 5,
                getCount() { return this.count }
            }
        }

        expect(cspRawEvaluator(element, 'counter.getCount()', { scope })).toBe(5)
    });

    it('ternary expressions', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, 'true ? 1 : 2')).toBe(1)
        expect(cspRawEvaluator(element, 'false ? 1 : 2')).toBe(2)
    });

    it('arithmetic operations', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, '2 + 3 * 4')).toBe(14)
        expect(cspRawEvaluator(element, '(2 + 3) * 4')).toBe(20)
    });

    it('comparison operations', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, '5 > 3')).toBe(true)
        expect(cspRawEvaluator(element, '5 === 5')).toBe(true)
        expect(cspRawEvaluator(element, '5 === "5"')).toBe(false)
    });

    it('logical operations', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, 'true && false')).toBe(false)
        expect(cspRawEvaluator(element, 'true || false')).toBe(true)
        expect(cspRawEvaluator(element, '!false')).toBe(true)
    });
});

describe('Optional chaining', () => {
    it('obj?.prop returns value when obj exists', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { user: { name: 'Alice' } }

        expect(cspRawEvaluator(element, 'user?.name', { scope })).toBe('Alice')
    });

    it('obj?.prop returns undefined when obj is null', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { user: null }

        expect(cspRawEvaluator(element, 'user?.name', { scope })).toBe(undefined)
    });

    it('obj?.prop returns undefined when obj is undefined', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { user: undefined }

        expect(cspRawEvaluator(element, 'user?.name', { scope })).toBe(undefined)
    });

    it('chained a?.b?.c', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, 'a?.b?.c', { scope: { a: { b: { c: 42 } } } })).toBe(42)
        expect(cspRawEvaluator(element, 'a?.b?.c', { scope: { a: null } })).toBe(undefined)
    });

    it('computed optional access obj?.[key]', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: { x: 'found' }, key: 'x' }

        expect(cspRawEvaluator(element, 'obj?.[key]', { scope })).toBe('found')
    });

    it('fn?.() returns result when fn exists', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { fn: () => 99 }

        expect(cspRawEvaluator(element, 'fn?.()', { scope })).toBe(99)
    });

    it('fn?.() returns undefined when fn is null', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { fn: null }

        expect(cspRawEvaluator(element, 'fn?.()', { scope })).toBe(undefined)
    });

    it('obj.method?.() with member callee', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: { greet: (name) => `hi ${name}` } }

        expect(cspRawEvaluator(element, 'obj.greet?.("world")', { scope })).toBe('hi world')
    });

    it('security: obj?.__proto__ blocked', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: {} }

        expect(() => {
            cspRawEvaluator(element, 'obj?.__proto__', { scope })
        }).toThrow('prohibited')
    });

    it('security: $el?.insertAdjacentHTML blocked', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { $el: domNode }

        expect(() => {
            cspRawEvaluator(element, '$el?.insertAdjacentHTML', { scope })
        }).toThrow('prohibited')
    });
});

describe('Nullish coalescing', () => {
    it('a ?? b returns a when a is not nullish', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { a: 'hello', b: 'fallback' }

        expect(cspRawEvaluator(element, 'a ?? b', { scope })).toBe('hello')
    });

    it('a ?? b returns b when a is null', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { a: null, b: 'fallback' }

        expect(cspRawEvaluator(element, 'a ?? b', { scope })).toBe('fallback')
    });

    it('a ?? b returns b when a is undefined', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { a: undefined, b: 'fallback' }

        expect(cspRawEvaluator(element, 'a ?? b', { scope })).toBe('fallback')
    });

    it('a ?? b returns a when a is 0 (unlike ||)', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { a: 0, b: 'fallback' }

        expect(cspRawEvaluator(element, 'a ?? b', { scope })).toBe(0)
    });

    it('a ?? b returns a when a is empty string (unlike ||)', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { a: '', b: 'fallback' }

        expect(cspRawEvaluator(element, 'a ?? b', { scope })).toBe('')
    });

    it('a ?? b returns a when a is false (unlike ||)', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { a: false, b: 'fallback' }

        expect(cspRawEvaluator(element, 'a ?? b', { scope })).toBe(false)
    });

    it('obj?.prop ?? default end-to-end', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(cspRawEvaluator(element, "user?.name ?? 'anon'", { scope: { user: { name: 'Alice' } } })).toBe('Alice')
        expect(cspRawEvaluator(element, "user?.name ?? 'anon'", { scope: { user: null } })).toBe('anon')
    });
});

describe('MemberExpression assignments', () => {
    it('simple dot-path assignment (x-model="form.name" setter)', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { form: { name: '' }, __placeholder: 'Alice' }

        cspRawEvaluator(element, 'form.name = __placeholder', { scope })

        expect(scope.form.name).toBe('Alice')
    });

    it('nested dot-path assignment', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { a: { b: { c: 0 } }, __placeholder: 42 }

        cspRawEvaluator(element, 'a.b.c = __placeholder', { scope })

        expect(scope.a.b.c).toBe(42)
    });

    it('computed property assignment', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: {}, key: 'x', __placeholder: 1 }

        cspRawEvaluator(element, 'obj[key] = __placeholder', { scope })

        expect(scope.obj.x).toBe(1)
    });

    it('assignment returns the assigned value', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { form: { name: '' }, __placeholder: 'Alice' }

        let result = cspRawEvaluator(element, 'form.name = __placeholder', { scope })

        expect(result).toBe('Alice')
    });

    it('computed property with string literal key', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: {}, __placeholder: 'hello' }

        cspRawEvaluator(element, "obj['key'] = __placeholder", { scope })

        expect(scope.obj.key).toBe('hello')
    });

    it('array index assignment', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { arr: ['a', 'b', 'c'], __placeholder: 'z' }

        cspRawEvaluator(element, 'arr[0] = __placeholder', { scope })

        expect(scope.arr[0]).toBe('z')
        expect(scope.arr).toEqual(['z', 'b', 'c'])
    });

    it('right-hand side reads a member expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { form: { name: '' }, other: { value: 'Bob' } }

        cspRawEvaluator(element, 'form.name = other.value', { scope })

        expect(scope.form.name).toBe('Bob')
    });

    it('identifier assignment still works (regression guard)', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { name: '', __placeholder: 'Carol' }

        cspRawEvaluator(element, 'name = __placeholder', { scope })

        expect(scope.name).toBe('Carol')
    });

    it('dangerous keyword assignment is still blocked', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: {}, __placeholder: 'evil' }

        expect(() => {
            cspRawEvaluator(element, 'obj.__proto__ = __placeholder', { scope })
        }).toThrow('prohibited')

        expect(() => {
            cspRawEvaluator(element, 'obj.constructor = __placeholder', { scope })
        }).toThrow('prohibited')

        expect(() => {
            cspRawEvaluator(element, 'obj.prototype = __placeholder', { scope })
        }).toThrow('prohibited')
    });

    it('DOM node check takes precedence over dangerous keyword check', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { $el: domNode, __placeholder: 'evil' }

        expect(() => {
            cspRawEvaluator(element, '$el.__proto__ = __placeholder', { scope })
        }).toThrow('DOM objects are prohibited')
    });

    it('DOM node update check takes precedence over dangerous keyword check', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { $el: domNode }

        expect(() => {
            cspRawEvaluator(element, '$el.__proto__++', { scope })
        }).toThrow('DOM objects are prohibited')
    });

    it('postfix increment on scope object', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: { count: 0 } }

        let result = cspRawEvaluator(element, 'obj.count++', { scope })

        expect(scope.obj.count).toBe(1)
        expect(result).toBe(0)
    });

    it('prefix increment on scope object', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: { count: 0 } }

        let result = cspRawEvaluator(element, '++obj.count', { scope })

        expect(scope.obj.count).toBe(1)
        expect(result).toBe(1)
    });

    it('decrement on scope object', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: { count: 5 } }

        cspRawEvaluator(element, 'obj.count--', { scope })

        expect(scope.obj.count).toBe(4)
    });

    it('computed property update expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: { x: 10 }, key: 'x' }

        cspRawEvaluator(element, 'obj[key]++', { scope })

        expect(scope.obj.x).toBe(11)
    });

    it('dangerous keyword update expression is blocked on scope object', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let scope = { obj: {} }

        expect(() => {
            cspRawEvaluator(element, 'obj.__proto__++', { scope })
        }).toThrow('prohibited')
    });

    it('DOM node property assignment is blocked', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { $el: domNode, __placeholder: 'evil' }

        expect(() => {
            cspRawEvaluator(element, '$el.innerHTML = __placeholder', { scope })
        }).toThrow('DOM objects are prohibited')

        expect(() => {
            cspRawEvaluator(element, '$el.textContent = __placeholder', { scope })
        }).toThrow('DOM objects are prohibited')
    });

    it('DOM node update expression is blocked', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        domNode.count = 5
        let scope = { $el: domNode }

        expect(() => {
            cspRawEvaluator(element, '$el.count++', { scope })
        }).toThrow('DOM objects are prohibited')
    });

    it('setAttribute is blocked via keyword blocklist', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { $el: domNode }

        expect(() => {
            cspRawEvaluator(element, '$el.setAttribute("onclick", "alert(1)")', { scope })
        }).toThrow('prohibited')
    });

    it('setAttributeNS is blocked via keyword blocklist', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { $el: domNode }

        expect(() => {
            cspRawEvaluator(element, '$el.setAttributeNS(null, "onclick", "alert(1)")', { scope })
        }).toThrow('prohibited')
    });

    it('setAttribute via computed property is blocked', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { $el: domNode, method: 'setAttribute' }

        expect(() => {
            cspRawEvaluator(element, '$el[method]("onclick", "alert(1)")', { scope })
        }).toThrow('prohibited')
    });

    it('CSSStyleDeclaration assignment is blocked', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { style: domNode.style, __placeholder: 'red' }

        expect(() => {
            cspRawEvaluator(element, 'style.background = __placeholder', { scope })
        }).toThrow('DOM objects are prohibited')
    });

    it('DOMStringMap assignment is blocked', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let domNode = document.createElement('div')
        let scope = { dataset: domNode.dataset, __placeholder: 'evil' }

        expect(() => {
            cspRawEvaluator(element, 'dataset.key = __placeholder', { scope })
        }).toThrow('DOM objects are prohibited')
    });
});
