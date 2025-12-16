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
