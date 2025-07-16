let { formatInput } = require('../../packages/mask/dist/module.cjs');

test('format-input functionality', async () => {

    expect(formatInput('(***) ***-****', '7162256108')).toEqual('(716) 225-6108')
    expect(formatInput('(999) 999-9999', '7162256108')).toEqual('(716) 225-6108')
    expect(formatInput('999) 999-9999', '7162256108')).toEqual('716) 225-6108')
    expect(formatInput('999 999-9999', '7162256108')).toEqual('716 225-6108')
    expect(formatInput('999999-9999', '7162256108')).toEqual('716225-6108')
    expect(formatInput('9999999999', '7162256108')).toEqual('7162256108')
    expect(formatInput('(999) 999-9999', '716 2256108')).toEqual('(716) 225-6108')
    expect(formatInput('(999) 999-9999', '(716) 2256108')).toEqual('(716) 225-6108')
    expect(formatInput('(999) 999-9999', '(716) 2-25--6108')).toEqual('(716) 225-6108')
    expect(formatInput('+1 (999) 999-9999', '7162256108')).toEqual('+1 (716) 225-6108')
    expect(formatInput('+1 (999) 999-9999', '+1 (716) 225-6108')).toEqual('+1 (716) 225-6108')
    expect(formatInput('ABC (999) 999-9999', '7162256108')).toEqual('ABC (716) 225-6108')
    expect(formatInput('ABC (999) 999-9999', 'ABC (716) 225-6108')).toEqual('ABC (716) 225-6108')
    expect(formatInput('999.999.9999', '7162256108')).toEqual('716.225.6108')
    expect(formatInput('999.999.9999', '716.2256108')).toEqual('716.225.6108')
    expect(formatInput('999.999.9999', '716.225 6108')).toEqual('716.225.6108')

    expect(formatInput('aaaa aaaa aaaa aaaa', 'abcd9abcd9abcd9abcd9')).toEqual('abcd abcd abcd abcd')
    expect(formatInput('aaaa aaaa aaaa aaaa', 'abcd abcd abcd abcd')).toEqual('abcd abcd abcd abcd')
    expect(formatInput('aaaa aaaa aaaa aaaa', 'abcdabcdabcdabcd')).toEqual('abcd abcd abcd abcd')
    expect(formatInput('aaaa aaaa aaaa aaaa', 'abcd9abcd9abcd9abc')).toEqual('abcd abcd abcd abc')
    expect(formatInput('### aaaa aaaa aaaa aaaa', 'abcd abcd abcd abcd')).toEqual('### abcd abcd abcd abcd')
    expect(formatInput('### aaaa aaaa aaaa aaaa', '### abcd abcd abcd abcd')).toEqual('### abcd abcd abcd abcd')
    expect(formatInput('### aaaa aaaa aaaa aaaa', '### abcd abcd #### abcd')).toEqual('### abcd abcd abcd')

    expect(formatInput('#### #### #### 9999', '1234 5678 9101 2345')).toEqual('#### #### #### 1234')

    expect(formatInput('ba9*b', 'a')).toEqual('ba')
    expect(formatInput('ba9*b', 'aa')).toEqual('ba')
    expect(formatInput('ba9*b', 'aa3')).toEqual('ba3')
    expect(formatInput('ba9*b', 'aa3z')).toEqual('ba3z')
    expect(formatInput('ba9*b', 'aa3z4')).toEqual('ba3zb')

    expect(formatInput('a', 'a9a')).toEqual('a')
    expect(formatInput('aa', 'b9a')).toEqual('ba')
    expect(formatInput('aa', 'bb')).toEqual('bb')
    expect(formatInput('aab', 'aba')).toEqual('abb')
    expect(formatInput('abb', 'ab')).toEqual('ab')
    expect(formatInput('abb', 'ab9')).toEqual('abb')

});
