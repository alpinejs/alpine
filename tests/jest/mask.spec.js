let {stripDown, formatMoney, buildUp} = require('../../packages/mask/dist/module.cjs');

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

    expect(stripDown('ba9*b', 'a')).toEqual('a')
    expect(stripDown('ba9*b', 'aa')).toEqual('a')
    expect(stripDown('ba9*b', 'aa3')).toEqual('a3')
    expect(stripDown('ba9*b', 'aa3z')).toEqual('a3z')
    expect(stripDown('ba9*b', 'aa3z4')).toEqual('a3z')

    expect(stripDown('a', 'a9a')).toEqual('a')
    expect(stripDown('aa', 'b9a')).toEqual('ba')
    expect(stripDown('aa', 'bb')).toEqual('bb')
    expect(stripDown('aab', 'aba')).toEqual('ab')
    expect(stripDown('abb', 'ab')).toEqual('a')
    expect(stripDown('abb', 'ab9')).toEqual('a')
    expect(stripDown('abcd', 'aba')).toEqual('a')
    expect(stripDown('baba', 'a9a')).toEqual('aa')
    expect(stripDown('baba', 'aa')).toEqual('aa')
    expect(stripDown('bbbba', 'a')).toEqual('a')
    expect(stripDown('bbbba', 'aa')).toEqual('a')
})

test('build-up functionality', async () => {
    expect(buildUp('(***) ***-****', '7162256108')).toEqual('(716) 225-6108')
    expect(buildUp('(999) 999-9999', '7162256108')).toEqual('(716) 225-6108')
    expect(buildUp('999) 999-9999', '7162256108')).toEqual('716) 225-6108')
    expect(buildUp('999 999-9999', '7162256108')).toEqual('716 225-6108')
    expect(buildUp('999999-9999', '7162256108')).toEqual('716225-6108')
    expect(buildUp('9999999999', '7162256108')).toEqual('7162256108')

    expect(buildUp('ba9*b', 'a')).toEqual('ba')
    expect(buildUp('ba9*b', 'a3')).toEqual('ba3')
    expect(buildUp('ba9*b', 'a3z')).toEqual('ba3zb')

})

test('teardown and build-up functionality', async () => {
   let template = 'ba9*b';

   expect(buildUp(template, stripDown(template, 'a'))).toEqual('ba')
   expect(buildUp(template, stripDown(template, 'aa'))).toEqual('ba')
   expect(buildUp(template, stripDown(template, 'aa3'))).toEqual('ba3')
   expect(buildUp(template, stripDown(template, 'aa3z'))).toEqual('ba3zb')
   expect(buildUp(template, stripDown(template, 'aa4'))).toEqual('ba4')

});

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
