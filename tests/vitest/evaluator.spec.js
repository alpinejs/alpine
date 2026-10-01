// @vitest-environment jsdom

import { describe, it, expect, beforeAll } from 'vitest';
import Alpine from '../../packages/alpinejs/src/index.js';
import { evaluate, evaluateLater, evaluateRaw } from '../../packages/alpinejs/src/evaluator.js';

beforeAll(() => Alpine.start())

describe('evaluate([String])', () => {
    it('simple expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, '42')).toBe(42)
    });

    it('with scope', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, 'foo', { scope: { foo: 42 } })).toBe(42)
    });

    it('with params', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, '(foo) => foo', { params: [42] })).toBe(42)
    });

    it('with context', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, 'this.foo', { context: { foo: 42 } })).toBe(42)
    });

    it('auto-evaluating function expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, '() => 42')).toBe(42)
    });

    it('non auto-evaluating function expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        Alpine.dontAutoEvaluateFunctions(() => {
            expect(evaluate(element, '() => 42')()).toBe(42)
        })
    });

    it('conditional', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, 'if (true) { return 42 }')).toBe(undefined)
    });

    it('assignment', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, 'let foo = 42')).toBe(undefined)
    });

    it('await', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let scope = { foo: { bar: 'baz' } }

        expect(evaluate(element, 'await new Promise(resolve => { foo.bar = "qux"; resolve() })', { scope })).toBe(undefined)

        expect(scope.foo.bar).toBe('qux')
    });
});

describe('evaluateLater([String])', () => {
    it('simple expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let receiver = evaluateLater(element, '42')

        receiver(value => {
            expect(value).toBe(42)
        })
    });

    it('await', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let receiver = evaluateLater(element, 'await new Promise(resolve => { setTimeout(() => resolve(42), 10) })')

        receiver(value => {
            expect(value).toBe(42)
        })
    });
})

describe('evaluate([Function])', () => {
    it('simple expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, () => 42)).toBe(42)
    });

    it('with scope', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, function() { return this.foo }, { scope: { foo: 42 } })).toBe(42)
    });

    it('with params', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, (foo) => foo, { params: [42] })).toBe(42)
    });

    it.skip('with context', () => {
        // This is not supported with direct function evaluation...
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, () => this.foo, { context: { foo: 42 } })).toBe(42)
    });

    it('auto-evaluating function expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluate(element, () => 42)).toBe(42)
    });

    it('non auto-evaluating function expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        Alpine.dontAutoEvaluateFunctions(() => {
            expect(evaluate(element, () => 42)()).toBe(42)
        })
    });
});

describe('evaluateLater([Function])', () => {
    it('simple expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let receiver = evaluateLater(element, () => 42)

        receiver(value => {
            expect(value).toBe(42)
        })
    });

    it('await', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let receiver = evaluateLater(element, () => new Promise(resolve => { setTimeout(() => resolve(42), 10) }))

        receiver(value => {
            expect(value).toBe(42)
        })
    });
})

describe('evaluateRaw([String])', () => {
    it('simple expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluateRaw(element, '42')).toBe(42)
    });

    it('with scope', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluateRaw(element, 'foo', { scope: { foo: 42 } })).toBe(42)
    });

    it('with params', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluateRaw(element, '(foo) => foo', { params: [42] })).toBe(42)
    });

    it('auto-evaluating function expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        expect(evaluateRaw(element, '() => 42')).toBe(42)
    });

    it('non auto-evaluating function expression', () => {
        let element = { parentNode: null, _x_dataStack: [] }

        Alpine.dontAutoEvaluateFunctions(() => {
            expect(evaluateRaw(element, '() => 42')()).toBe(42)
        })
    });

    it('await returns promise directly', async () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let result = evaluateRaw(element, 'await Promise.resolve(42)')

        expect(result).toBeInstanceOf(Promise)
        expect(await result).toBe(42)
    });

    it('promise is returned directly', async () => {
        let element = { parentNode: null, _x_dataStack: [] }

        let result = evaluateRaw(element, '(() => { let promise = new Promise(() => {}); promise.foo = "bar"; return promise })()')

        expect(result).toBeInstanceOf(Promise)
        expect(result.foo).toBe('bar')
    });
})

describe('skipAutoEvaluate()', () => {
    it('returns the function as is', () => {
        let func = () => {}

        expect(Alpine.skipAutoEvaluate(func)).toBe(func)
    });

    it('is not called by the expression that produced it', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let calls = 0
        let scope = { unwatch: null, foo: null, subscribe: () => Alpine.skipAutoEvaluate(() => calls++) }

        evaluate(element, 'subscribe()', { scope })
        evaluate(element, 'unwatch = subscribe()', { scope })
        evaluate(element, '(foo = 1, subscribe())', { scope })
        evaluate(element, 'unwatch = subscribe(); foo = 1', { scope })

        expect(calls).toBe(0)
    });

    it('is called by later expressions', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let calls = 0
        let scope = { unwatch: null, subscribe: () => Alpine.skipAutoEvaluate(() => calls++) }

        evaluate(element, 'unwatch = subscribe()', { scope })
        evaluate(element, 'unwatch', { scope })

        expect(calls).toBe(1)

        scope.unwatch()

        expect(calls).toBe(2)
    });

    it('is not called by an async expression that produced it', async () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let calls = 0
        let tick = () => new Promise(resolve => setTimeout(resolve))
        let scope = {
            unwatch: null,
            tick,
            subscribe: () => Alpine.skipAutoEvaluate(() => calls++),
            subscribeAsync: async () => { await tick(); return Alpine.skipAutoEvaluate(() => calls++) },
        }

        evaluate(element, 'unwatch = subscribe(); await tick()', { scope })
        evaluate(element, 'let foo = await tick(); return subscribe()', { scope })
        evaluate(element, 'await subscribeAsync()', { scope })
        evaluate(element, 'subscribeAsync', { scope })

        await new Promise(resolve => setTimeout(resolve, 10))

        expect(calls).toBe(0)
    });

    it('is not called by a nested expression or the one around it', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let calls = 0
        let scope = { subscribe: () => Alpine.skipAutoEvaluate(() => calls++) }

        scope.nested = () => evaluate(element, 'subscribe()', { scope })

        evaluate(element, 'nested()', { scope })

        expect(calls).toBe(0)
    });

    it('is not called by a function expression that produced it', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let calls = 0
        let scope = { subscribe: () => Alpine.skipAutoEvaluate(() => calls++) }

        evaluate(element, function () { return this.subscribe() }, { scope })

        expect(calls).toBe(0)
    });

    it('is not called by a raw expression that produced it', () => {
        let element = { parentNode: null, _x_dataStack: [] }
        let calls = 0
        let scope = { unwatch: null, subscribe: () => Alpine.skipAutoEvaluate(() => calls++) }

        evaluateRaw(element, 'unwatch = subscribe()', { scope })

        expect(calls).toBe(0)

        evaluateRaw(element, 'unwatch', { scope })

        expect(calls).toBe(1)
    });
})
