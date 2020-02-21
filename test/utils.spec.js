import utils from '../src/utils'

test('utils/arrayUnique', () => {
    const arrayMock = [1, 1, 2, 3, 1, 'a', 'b', 'c', 'b']
    const expected = utils.arrayUnique(arrayMock)
    expect(expected).toEqual([1, 2, 3, 'a', 'b', 'c'])
})
