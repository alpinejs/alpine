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
				expect(stripDown('+1 (999) 999-9999', '7162256108')).toEqual('7162256108')
				expect(stripDown('+1 (999) 999-9999', '+1 (716) 225-6108')).toEqual('7162256108')
				expect(stripDown('ABC (999) 999-9999', '7162256108')).toEqual('7162256108')
				expect(stripDown('ABC (999) 999-9999', 'ABC (716) 225-6108')).toEqual('7162256108')
				expect(stripDown('999.999.9999', '7162256108')).toEqual('7162256108')
				expect(stripDown('999.999.9999', '716.2256108')).toEqual('7162256108')
				expect(stripDown('999.999.9999', '716.225 6108')).toEqual('7162256108')
				expect(stripDown('aaaa aaaa aaaa aaaa', 'abcd9abcd9abcd9abcd9')).toEqual('abcdabcdabcdabcd')
				expect(stripDown('aaaa aaaa aaaa aaaa', 'abcd abcd abcd abcd')).toEqual('abcdabcdabcdabcd')
				expect(stripDown('aaaa aaaa aaaa aaaa', 'abcdabcdabcdabcd')).toEqual('abcdabcdabcdabcd')
				expect(stripDown('aaaa aaaa aaaa aaaa', 'abcd9abcd9abcd9abc')).toEqual('abcdabcdabcdabc')
				expect(stripDown('### aaaa aaaa aaaa aaaa', 'abcd abcd abcd abcd')).toEqual('abcdabcdabcdabcd')
				expect(stripDown('### aaaa aaaa aaaa aaaa', '### abcd abcd abcd abcd')).toEqual('abcdabcdabcdabcd')
				expect(stripDown('### aaaa aaaa aaaa aaaa', '### abcd abcd #### abcd')).toEqual('abcdabcdabcd')
				expect(stripDown('#### #### #### 9999', '1234 5678 9101 2345')).toEqual('2345')
				expect(stripDown('ba9*b', 'aa')).toEqual('a')
				expect(stripDown('ba9*b', 'aa3')).toEqual('a3')
				expect(stripDown('ba9*b', 'aa3z')).toEqual('a3a')
				expect(stripDown('ba9*b', 'aa3z4')).toEqual('a3z')
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
