import { haveValue, html, test } from '../../utils'

test('x-mask',
    [html`<input x-data x-mask="(999) 999-9999">`],
    ({ get }) => {
        // Type a phone number:
        get('input').type('12').should(haveValue('(12'))
        get('input').type('3').should(haveValue('(123) '))
        get('input').type('4567890').should(haveValue('(123) 456-7890'))
        // Clear it & paste formatted version in:
        get('input').type('{selectAll}{backspace}')
        get('input').invoke('val', '(123) 456-7890').trigger('blur')
        get('input').should(haveValue('(123) 456-7890'))
        // Clear it & paste un-formatted version in:
        get('input').type('{selectAll}{backspace}')
        get('input').invoke('val', '1234567890').trigger('blur')
        get('input').should(haveValue('(123) 456-7890'))
        // Make sure backspace works.
        get('input').type('{backspace}').should(haveValue('(123) 456-789'))
        get('input').type('{backspace}').should(haveValue('(123) 456-78'))
        get('input').type('{backspace}').should(haveValue('(123) 456-7'))
        get('input').type('{backspace}').should(haveValue('(123) 456-'))
        get('input').type('{backspace}').should(haveValue('(123) 456'))
        get('input').type('{backspace}').should(haveValue('(123) 45'))
        // Make sure you can't type other characters.
        get('input').type('a').should(haveValue('(123) 45'))
        get('input').type('-').should(haveValue('(123) 45'))
        // Put cursor in other places in the input and make sure you can type.
        get('input').type('67890').should(haveValue('(123) 456-7890'))
        get('input').type('{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}')
        get('input').type('123456').should(haveValue('(123) 456-1234'))
    },
)

test('x-mask with x-model',
    [html`
        <div x-data="{ value: '' }">
            <input x-mask="(999) 999-9999" x-model="value" id="1">
            <input id="2" x-model="value">
        </div>
    `],
    ({ get }) => {
        // Type a phone number:
        get('#1').type('12').should(haveValue('(12'))
        get('#2').should(haveValue('(12'))
        get('#1').type('3').should(haveValue('(123) '))
        get('#2').should(haveValue('(123) '))
        get('#1').type('4567890').should(haveValue('(123) 456-7890'))
        get('#2').should(haveValue('(123) 456-7890'))
        // Clear it & paste formatted version in:
        get('#1').type('{selectAll}{backspace}')
        get('#1').invoke('val', '(123) 456-7890').trigger('input')
        get('#1').should(haveValue('(123) 456-7890'))
        get('#2').should(haveValue('(123) 456-7890'))
        // Clear it & paste un-formatted version in:
        get('#1').type('{selectAll}{backspace}')
        get('#1').invoke('val', '1234567890').trigger('input')
        get('#1').should(haveValue('(123) 456-7890'))
        get('#2').should(haveValue('(123) 456-7890'))
    },
)

// This passes locally but fails in CI...
test.skip('x-mask with latently bound x-model',
    [html`
        <div x-data="{ value: '' }">
            <input x-mask="(999) 999-9999" x-bind="{ 'x-model': 'value' }" id="1">
            <input id="2" x-model="value">
        </div>
    `],
    ({ get }) => {
        get('#1').type('a').should(haveValue('('))
        get('#2').should(haveValue('('))
        get('#1').type('1').should(haveValue('(1'))
        get('#2').should(haveValue('(1'))
    },
)

test('x-mask with x-model with initial value',
    [html`
        <div x-data="{ value: '1234567890' }">
            <input x-mask="(999) 999-9999" x-model="value" id="1">
            <input id="2" x-model="value">
        </div>
    `],
    ({ get }) => {
        get('#1').should(haveValue('(123) 456-7890'))
        get('#2').should(haveValue('(123) 456-7890'))
    },
)

test('x-mask with a falsy input',
    [html`<input x-data x-mask="">`],
    ({ get }) => {
	    get('input').type('1').should(haveValue('1'))
	    get('input').type('2').should(haveValue('12'))
	    get('input').type('ua').should(haveValue('12ua'))
	    get('input').type('/').should(haveValue('12ua/'))
	    get('input').type('cs').should(haveValue('12ua/cs'))
	    get('input').type('  3').should(haveValue('12ua/cs  3'))
    }
)

test('x-mask with a falsy string input',
    [html`<input x-data x-mask="false">`],
    ({ get }) => {
	    get('input').type('1').should(haveValue('1'))
	    get('input').type('2').should(haveValue('12'))
	    get('input').type('ua').should(haveValue('12ua'))
	    get('input').type('/').should(haveValue('12ua/'))
	    get('input').type('cs').should(haveValue('12ua/cs'))
	    get('input').type('  3').should(haveValue('12ua/cs  3'))
    }
)

test('x-mask with non wildcard alpha-numeric characters (b)',
    [html`<input x-data x-mask="ba9*b">`],
    ({ get }) => {
        get('input').type('a').should(haveValue('ba'))
        get('input').type('a').should(haveValue('ba'))
        get('input').type('3').should(haveValue('ba3'))
        get('input').type('z').should(haveValue('ba3zb'))
        get('input').type('{backspace}{backspace}4').should(haveValue('ba34b'))
    }
)

test('x-mask:dynamic',
    [html`<input x-data x-mask:dynamic="'(999)'">`],
    ({ get }) => {
        get('input').type('123').should(haveValue('(123)'))
    }
)

test('$money',
    [html`<input x-data x-mask:function="$money">`],
    ({ get }) => {
        get('input').type('30.00').should(haveValue('30.00'))
        get('input').type('5').should(haveValue('30.00'))
        get('input').type('{backspace}').should(haveValue('30.0'))
        get('input').type('5').should(haveValue('30.05'))
        get('input').type('{selectAll}{backspace}').should(haveValue(''))
        get('input').type('123').should(haveValue('123'))
        get('input').type('4').should(haveValue('1,234'))
        get('input').type('567').should(haveValue('1,234,567'))
        get('input').type('.89').should(haveValue('1,234,567.89'))
        get('input').type('{leftArrow}7').should(haveValue('1,234,567.87'))
        get('input').type('{leftArrow}{leftArrow}{leftArrow}89').should(haveValue('123,456,789.87'))
        get('input').type('{leftArrow}{leftArrow}{leftArrow}{leftArrow}12').should(haveValue('12,345,612,789.87'))
        get('input').type('{leftArrow}3').should(haveValue('123,456,123,789.87'))
        // Clear it & paste formatted version in:
        get('input').type('{selectAll}{backspace}')
        get('input').invoke('val', '123,456,132,789.87').trigger('blur')
        get('input').should(haveValue('123,456,132,789.87'))
        // Clear it & paste un-formatted version in:
        get('input').type('{selectAll}{backspace}')
        get('input').invoke('val', '123456132789.87').trigger('blur')
        get('input').should(haveValue('123,456,132,789.87'))
    },
)

test('$money swapping commas and periods',
    [html`<input x-data x-mask:function="$money($input, ',')">`],
    ({ get }) => {
        get('input').type('30,00').should(haveValue('30,00'))
        get('input').type('5').should(haveValue('30,00'))
        get('input').type('{backspace}').should(haveValue('30,0'))
        get('input').type('5').should(haveValue('30,05'))
        get('input').type('{selectAll}{backspace}').should(haveValue(''))
        get('input').type('123').should(haveValue('123'))
        get('input').type('4').should(haveValue('1.234'))
        get('input').type('567').should(haveValue('1.234.567'))
        get('input').type(',89').should(haveValue('1.234.567,89'))
    },
)

test('$money with different thousands separator',
    [html`<input x-data x-mask:function="$money($input, '.', ' ')" />`],
    ({ get }) => {
        get('input').type('3000').should(haveValue('3 000'));
        get('input').type('{backspace}').blur().should(haveValue('300'));
        get('input').type('5').should(haveValue('3 005'));
        get('input').type('{selectAll}{backspace}').should(haveValue(''));
        get('input').type('123').should(haveValue('123'));
        get('input').type('4').should(haveValue('1 234'));
        get('input').type('567').should(haveValue('1 234 567'));
        get('input').type('.89').should(haveValue('1 234 567.89'));
    }
);

test('$money works with permanent inserted at beginning',
    [html`<input x-data x-mask:dynamic="$money">`],
    ({ get }) => {
        get('input').type('40.00').should(haveValue('40.00'))
        get('input').type('{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}')
        get('input').type('$')
        get('input').should(haveValue('40.00'))
    }
)

test('$money mask should remove letters or non numeric characters',
    [html`<input x-data x-mask:dynamic="$money">`],
    ({ get }) => {
        get('input').type('A').should(haveValue(''))
        get('input').type('ABC').should(haveValue(''))
        get('input').type('$').should(haveValue(''))
        get('input').type('/').should(haveValue(''))
        get('input').type('40').should(haveValue('40'))
    }
)

test('$money mask negative values',
    [html`
        <input id="1" x-data x-mask:dynamic="$money($input)" value="-1234.50" />
        <input id="2" x-data x-mask:dynamic="$money($input)" />
    `],
    ({ get }) => {
        get('#1').should(haveValue('-1,234.50'))
        get('#2').type('-12.509').should(haveValue('-12.50'))
        get('#2').type('{leftArrow}{leftArrow}{leftArrow}-').should(haveValue('-12.50'))
        get('#2').type('{leftArrow}{leftArrow}{backspace}').should(haveValue('12.50'))
        get('#2').type('{rightArrow}-').should(haveValue('12.50'))
        get('#2').type('{rightArrow}-').should(haveValue('12.50'))
        get('#2').type('{rightArrow}{rightArrow}{rightArrow}-').should(haveValue('12.50'))
        get('#2').type('{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}-').should(haveValue('-12.50'))
    }
)

test('$money with custom decimal precision',
    [html`
        <input id="0" x-data x-mask:dynamic="$money($input, '.', ',', 0)" />
        <input id="1" x-data x-mask:dynamic="$money($input, '.', ',', 1)" />
        <input id="2" x-data x-mask:dynamic="$money($input, '.', ',', 2)" />
        <input id="3" x-data x-mask:dynamic="$money($input, '.', ',', 3)" />
    `],
    ({ get }) => {
        get('#0').type('1234.5678').should(haveValue('12,345,678'))
        get('#1').type('1234.5678').should(haveValue('1,234.5'))
        get('#2').type('1234.5678').should(haveValue('1,234.56'))
        get('#3').type('1234.5678').should(haveValue('1,234.567'))
    }
)
