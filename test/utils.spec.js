import { arrayUnique, parseHtmlAttribute, setErrorHandler, saferEval } from '../src/utils'

test('utils/arrayUnique', () => {
    const arrayMock = [1, 1, 2, 3, 1, 'a', 'b', 'c', 'b']
    const expected = arrayUnique(arrayMock)
    expect(expected).toEqual([1, 2, 3, 'a', 'b', 'c'])
})

test('utils/parseHtmlAttribute', () => {
    const attribute = { name: ':x1', value: 'x' };
    const expected = parseHtmlAttribute(attribute);
    expect(expected).toEqual({
        type: 'bind',
        value: 'x1',
        modifiers: [],
        expression: 'x'
    });
})

test('utils/setErrorHandler', () => {
    let handlerCallCount = 0;

    const handler = (el, expression, error) => {
        handlerCallCount++;
    };

    setErrorHandler(handler);

    expect(handlerCallCount).toEqual(0);

    saferEval(null, 'throw new Error("test");', {}, {});

    expect(handlerCallCount).toEqual(1);
})
