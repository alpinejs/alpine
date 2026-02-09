import { exist, haveText, html, notExist, test } from '../../utils'

test('x-if',
    html`
        <div x-data="{ show: false }">
            <button @click="show = ! show">Toggle</button>

            <template x-if="show">
                <h1>Toggle Me</h1>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1').should(notExist())
        get('button').click()
        get('h1').should(exist())
        get('button').click()
        get('h1').should(notExist())
    }
)

test('x-if inside x-for allows nested directives',
    html`
        <div x-data="{items: [{id: 1, label: '1'}]}">

            <template x-for="item in items" :key="item.id">
                <div>
                    <template x-if="item.label">
                        <span x-text="item.label"></span>
                    </template>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('1'))
    }
)

test('x-if initializes after being added to the DOM to allow x-ref to work',
    html`
        <div x-data="{}">
            <template x-if="true">
                <ul x-ref="listbox" data-foo="bar">
                    <li x-text="$refs.listbox.dataset.foo"></li>
                </ul>
            </template>
        </div>
    `,
    ({ get }) => {
        get('li').should(haveText('bar'))
    }
)

// If x-if evaluates to false, the expectation is that no sub-expressions will be evaluated.
test('x-if removed dom does not evaluate reactive expressions in dom tree',
    html`
    <div x-data="{user: {name: 'lebowski'}}">
        <button @click="user = null">Log out</button>
        <template x-if="user">
            <span x-text="user.name"></span>
        </template>

    </div>
    `,
    ({ get }) => {
        get('span').should(haveText('lebowski'))

        // Clicking button sets user=null and thus x-if="user" will evaluate to false.
        // If the sub-expression x-text="user.name" is evaluated, the button click
        // will produce an error because user is no longer defined and the test will fail
        get('button').click()
        get('span').should(notExist())
    }
)

// Attempting to skip an already-flushed reactive effect would cause inconsistencies when updating other effects.
// See https://github.com/alpinejs/alpine/issues/2803 for more details.
test('x-if removed dom does not attempt skipping already-processed reactive effects in dom tree',
    html`
    <div x-data="{
        isEditing: true,
        foo: 'random text',
        stopEditing() {
          this.foo = '';
          this.isEditing = false;
        },
    }">
        <button @click="stopEditing">Stop editing</button>
        <template x-if="isEditing">
            <div id="div-editing">
              <h2>Editing</h2>
              <input id="foo" name="foo" type="text" x-model="foo" />
            </div>
        </template>

        <template x-if="!isEditing">
            <div id="div-not-editing"><h2>Not editing</h2></div>
        </template>

        <template x-if="!isEditing">
            <div id="div-also-not-editing"><h2>Also not editing</h2></div>
        </template>
    </div>
    `,
    ({ get }) => {
        get('button').click()
        get('div#div-editing').should(notExist())
        get('div#div-not-editing').should(exist())
        get('div#div-also-not-editing').should(exist())
    }
)

// If x-if evaluates to false, all cleanups in the tree should be handled.
test('x-if eagerly cleans tree',
    html`
        <div x-data="{ show: false, count: 0 }">
            <button @click="show^=true" x-text="count">Toggle</button>
            <template x-if="show">
                <div>
                <template x-if="true">
                    <p x-effect="if (show) count++">
                    hello
                    </p>
                </template>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('button').should(haveText('0'))
        get('button').click()
        get('button').should(haveText('1'))
        get('button').click()
        get('button').should(haveText('1'))
        get('button').click()
        get('button').should(haveText('2'))
        get('button').click()
        get('button').should(haveText('2'))
        get('button').click()
        get('button').should(haveText('3'))
        get('button').click()
        get('button').should(haveText('3'))
        get('button').click()
        get('button').should(haveText('4'))
        get('button').click()
        get('button').should(haveText('4'))
    }
)