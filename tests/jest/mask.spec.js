let { stripDown, formatMoney } = require('../../packages/mask/dist/module.cjs');

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

test('formatMoney functionality', async () => {
    // Default arguments implicit and explicit
    expect(formatMoney('123456')).toEqual('123,456');
    expect(formatMoney('9900900')).toEqual('9,900,900');
    expect(formatMoney('5600.40')).toEqual('5,600.40');
    expect(formatMoney('123456', '.')).toEqual('123,456');
    expect(formatMoney('9900900', '.')).toEqual('9,900,900');
    expect(formatMoney('5600.40', '.')).toEqual('5,600.40');
    expect(formatMoney('123456', '.', ',')).toEqual('123,456');
    expect(formatMoney('9900900', '.', ',')).toEqual('9,900,900');
    expect(formatMoney('5600.40', '.', ',')).toEqual('5,600.40');

    // Switch decimal separator
    expect(formatMoney('123456', ',')).toEqual('123.456');
    expect(formatMoney('9900900', ',')).toEqual('9.900.900');
    expect(formatMoney('5600.40', ',')).toEqual('5.600,40');
    expect(formatMoney('123456', '/')).toEqual('123.456');
    expect(formatMoney('9900900', '/')).toEqual('9.900.900');
    expect(formatMoney('5600.40', '/')).toEqual('5.600/40');

    // Switch thousands separator
    expect(formatMoney('123456', '.', ' ')).toEqual('123 456');
    expect(formatMoney('9900900', '.', ' ')).toEqual('9 900 900');
    expect(formatMoney('5600.40', '.', ' ')).toEqual('5 600.40');

    // Switch decimal and thousands separator
    expect(formatMoney('123456', '#', ' ')).toEqual('123 456');
    expect(formatMoney('9900900', '#', ' ')).toEqual('9 900 900');
    expect(formatMoney('5600.40', '#', ' ')).toEqual('5 600#40');
});
