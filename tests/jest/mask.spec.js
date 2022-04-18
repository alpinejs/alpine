let { stripDown } = require('../../packages/mask/dist/module.cjs')

test('strip-down functionality', async () => {
    expect(stripDown('(***) ***-****', '7162256108')).toEqual('7162256108')
    expect(stripDown('(999) 999-9999', '7162256108')).toEqual('7162256108')
    expect(stripDown('999) 999-9999', '7162256108')).toEqual('7162256108')
    expect(stripDown('999 999-9999', '7162256108')).toEqual('7162256108')
    expect(stripDown('999999-9999', '7162256108')).toEqual('7162256108')
    expect(stripDown('9999999999', '7162256108')).toEqual('7162256108')
    expect(stripDown('9999999999', '7162256108')).toEqual('7162256108')
    expect(stripDown('(999) 999-9999', '716 2256108')).toEqual('7162256108')
    expect(stripDown('(999) 999-9999', '(716) 2256108')).toEqual('7162256108')
    expect(stripDown('(999) 999-9999', '(716) 2-25--6108')).toEqual('7162256108')
})
