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