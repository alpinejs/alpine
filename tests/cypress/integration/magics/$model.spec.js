import { haveData, html, test } from '../../utils';

test('$model returns a proxy for the nearest x-model',
    html`
        <div x-data="{ foo: 1 }">
            <div x-model="foo">
                <button id="add" @click="$model++">+</button>
                <button id="sub" @click="$model--">-</button>
            </div>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', 1))
        get('#add').click()
        get('div').should(haveData('foo', 2))
        get('#sub').click()
        get('div').should(haveData('foo', 1))
    }
)

test('$model handles nested x-model scope',
    html`
        <div x-data="{ foo: 1, bar: 'baz' }">
            <div x-model="bar">
                <div x-model="foo">
                    <button id="add" @click="$model++">+</button>
                    <button id="sub" @click="$model--">-</button>
                </div>
            </div>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveData('foo', 1))
        get('#add').click()
        get('div').should(haveData('foo', 2))
        get('#sub').click()
        get('div').should(haveData('foo', 1))
    }
)
