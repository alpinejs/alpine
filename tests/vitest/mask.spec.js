import { describe, it, expect } from 'vitest'
import { formatInput } from '../../packages/mask/src/index.js'

describe('formatInput', () => {
    it('formats phone numbers with various templates', () => {
        expect(formatInput('(***) ***-****', '7162256108')).toEqual('(716) 225-6108')
        expect(formatInput('(999) 999-9999', '7162256108')).toEqual('(716) 225-6108')
        expect(formatInput('999) 999-9999', '7162256108')).toEqual('716) 225-6108')
        expect(formatInput('999 999-9999', '7162256108')).toEqual('716 225-6108')
        expect(formatInput('999999-9999', '7162256108')).toEqual('716225-6108')
        expect(formatInput('9999999999', '7162256108')).toEqual('7162256108')
    })

    it('strips existing formatting from input', () => {
        expect(formatInput('(999) 999-9999', '716 2256108')).toEqual('(716) 225-6108')
        expect(formatInput('(999) 999-9999', '(716) 2256108')).toEqual('(716) 225-6108')
        expect(formatInput('(999) 999-9999', '(716) 2-25--6108')).toEqual('(716) 225-6108')
    })

    it('handles templates with leading literals that overlap input', () => {
        expect(formatInput('+1 (999) 999-9999', '7162256108')).toEqual('+1 (716) 225-6108')
        expect(formatInput('+1 (999) 999-9999', '+1 (716) 225-6108')).toEqual('+1 (716) 225-6108')
        expect(formatInput('ABC (999) 999-9999', '7162256108')).toEqual('ABC (716) 225-6108')
        expect(formatInput('ABC (999) 999-9999', 'ABC (716) 225-6108')).toEqual('ABC (716) 225-6108')
    })

    it('handles dot-separated templates', () => {
        expect(formatInput('999.999.9999', '7162256108')).toEqual('716.225.6108')
        expect(formatInput('999.999.9999', '716.2256108')).toEqual('716.225.6108')
        expect(formatInput('999.999.9999', '716.225 6108')).toEqual('716.225.6108')
    })

    it('handles alpha masks with spaces', () => {
        expect(formatInput('aaaa aaaa aaaa aaaa', 'abcd9abcd9abcd9abcd9')).toEqual('abcd abcd abcd abcd')
        expect(formatInput('aaaa aaaa aaaa aaaa', 'abcd abcd abcd abcd')).toEqual('abcd abcd abcd abcd')
        expect(formatInput('aaaa aaaa aaaa aaaa', 'abcdabcdabcdabcd')).toEqual('abcd abcd abcd abcd')
        expect(formatInput('aaaa aaaa aaaa aaaa', 'abcd9abcd9abcd9abc')).toEqual('abcd abcd abcd abc')
    })

    it('handles templates with leading non-wildcard literals', () => {
        expect(formatInput('### aaaa aaaa aaaa aaaa', 'abcd abcd abcd abcd')).toEqual('### abcd abcd abcd abcd')
        expect(formatInput('### aaaa aaaa aaaa aaaa', '### abcd abcd abcd abcd')).toEqual('### abcd abcd abcd abcd')
        expect(formatInput('### aaaa aaaa aaaa aaaa', '### abcd abcd #### abcd')).toEqual('### abcd abcd abcd')
    })

    it('handles template with only trailing wildcards', () => {
        expect(formatInput('#### #### #### 9999', '1234 5678 9101 2345')).toEqual('#### #### #### 1234')
    })

    it('handles non-wildcard alphanumeric characters in template', () => {
        expect(formatInput('ba9*b', 'a')).toEqual('ba')
        expect(formatInput('ba9*b', 'aa')).toEqual('ba')
        expect(formatInput('ba9*b', 'aa3')).toEqual('ba3')
        expect(formatInput('ba9*b', 'aa3z')).toEqual('ba3z')
        expect(formatInput('ba9*b', 'aa3z4')).toEqual('ba3zb')
    })

    it('handles short templates', () => {
        expect(formatInput('a', 'a9a')).toEqual('a')
        expect(formatInput('aa', 'b9a')).toEqual('ba')
        expect(formatInput('aa', 'bb')).toEqual('bb')
        expect(formatInput('aab', 'aba')).toEqual('abb')
        expect(formatInput('abb', 'ab')).toEqual('ab')
        expect(formatInput('abb', 'ab9')).toEqual('abb')
    })
})
