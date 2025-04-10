import { haveText, html, test } from '../../utils'

test('x-for can be used inside x-teleport',
    html`
        <div x-data="{ items: ['a', 'b', 'c'] }" id="source">
            <template x-teleport="#target">
                <div>
                    <template x-for="item in items">
                        <span x-text="item"></span>
                    </template>
                </div>
            </template>
        </div>

        <div id="target"></div>
    `,
    ({ get }) => {
        get('#target span:nth-of-type(1)').should(haveText('a'))
        get('#target span:nth-of-type(2)').should(haveText('b'))
        get('#target span:nth-of-type(3)').should(haveText('c'))
    }
)

test('x-for in teleported content can update when data changes',
    html`
        <div x-data="{ items: ['a', 'b', 'c'] }" id="source">
            <button @click="items.push('d')" id="add">Add</button>
            
            <template x-teleport="#target">
                <div>
                    <template x-for="item in items">
                        <span x-text="item"></span>
                    </template>
                </div>
            </template>
        </div>

        <div id="target"></div>
    `,
    ({ get }) => {
        get('#target span:nth-of-type(1)').should(haveText('a'))
        get('#target span:nth-of-type(2)').should(haveText('b'))
        get('#target span:nth-of-type(3)').should(haveText('c'))
        get('#add').click()
        get('#target span:nth-of-type(4)').should(haveText('d'))
    }
)

test('x-for with complex data types inside x-teleport',
    html`
        <div x-data="{ items: [{name: 'Item 1', value: 1}, {name: 'Item 2', value: 2}] }" id="source">
            <template x-teleport="#target">
                <div>
                    <template x-for="item in items">
                        <div>
                            <span class="name" x-text="item.name"></span>
                            <span class="value" x-text="item.value"></span>
                        </div>
                    </template>
                </div>
            </template>
        </div>

        <div id="target"></div>
    `,
    ({ get }) => {
        get('#target div div:nth-of-type(1) .name').should(haveText('Item 1'))
        get('#target div div:nth-of-type(1) .value').should(haveText('1'))
        get('#target div div:nth-of-type(2) .name').should(haveText('Item 2'))
        get('#target div div:nth-of-type(2) .value').should(haveText('2'))
    }
)