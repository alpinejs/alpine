import { haveText, html, test } from "../../utils";

test(
    '$mixin merges multiple data objects',
    html`
        <div
            x-data="$mixin(
                {
                    foo: 'bar',
                },
                {
                    baz: 'qux',
                }
            )"
        >
            <span id="1" x-text="foo"></span>
            <span id="2" x-text="baz"></span>
        </div>
    `,
    ({ get }) => {
        get('#1').should(haveText('bar'))
        get('#2').should(haveText('qux'))
    },
)

test(
    '$mixin merges plain objects with data providers',
    html`
        <script>
            document.addEventListener("alpine:init", () => {
                Alpine.data("test", () => ({
                    foo: "bar",
                }));
            });
        </script>

        <div
            x-data="$mixin(
                test,
                {
                    baz: 'qux',
                }
            )"
        >
            <span id="1" x-text="foo"></span>
            <span id="2" x-text="baz"></span>
        </div>
    `,
    ({ get }) => {
        get('#1').should(haveText('bar'))
        get('#2').should(haveText('qux'))
    },
);

test(
    '$mixin merges init functions',
    html`
        <div
            x-data="$mixin(
                {
                    foo: '',
                    init() {
                        this.foo = 'bar'
                    }
                },
                {
                    baz: '',
                    init() {
                        this.baz = 'qux'
                    }
                }
            )"
        >
            <span id="1" x-text="foo"></span>
            <span id="2" x-text="baz"></span>
        </div>
    `,
    ({ get }) => {
        get('#1').should(haveText('bar'))
        get('#2').should(haveText('qux'))
    },
)

test(
    "$mixin merges destroy functions",
    html`
        <div
            x-data="$mixin(
                {
                    destroy() {
                        document.getElementById('1').textContent = 'foo';
                    },
                },
                {
                    destroy() {
                        document.getElementById('2').textContent = 'bar';
                    },
                }
            )"
        >
            <button x-on:click="$root.remove()"></button>
        </div>

        <span id="1"></span>
        <span id="2"></span>
    `,
    ({ get }) => {
        get("button").click();
        get("#1").should(haveText("foo"));
        get("#2").should(haveText("bar"));
    }
);

test(
    '$mixin maintains getters and setters',
    html`
        <div x-data="$mixin(
            {
                _foo: 'bar',
                get foo() {
                    return this._foo + '!'
                },
                set foo(value) {
                    this._foo = value
                }
            },
            {
                _baz: 'qux',
                get baz() {
                    return this._baz + '!'
                },
                set baz(value) {
                    this._baz = value
                }
            }
        )">
            <button id="1" x-on:click="foo = 'BAR'"></button>
            <span id="2" x-text="foo"></span>
            <button id="3" x-on:click="baz = 'QUX'"></button>
            <span id="4" x-text="baz"></span>
        </div>
    `,
    ({ get }) => {
        get('#1').click()
        get('#2').should(haveText('BAR!'))
        get('#3').click()
        get('#4').should(haveText('QUX!'))
    },
)
