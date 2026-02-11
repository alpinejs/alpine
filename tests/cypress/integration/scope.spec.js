import { haveText, html, test } from "../utils";

test(
    "properly merges the datastack",
    [
        html`
            <div x-data="{ foo: 'fizz' }">
                <div x-data="{ bar: 'buzz' }">
                    <span x-text="foo + bar"></span>
                </div>
            </div>
        `,
    ],
    ({ get }) => {
        get("span").should(haveText("fizzbuzz"));
    }
);

test(
    "merges stack from bottom up",
    [
        html`
            <div x-data="{ foo: 'fizz' }">
                <div x-data="{ foo: 'buzz', get bar() { return this.foo } }">
                    <span id="one" x-text="bar + foo"></span>
                </div>
                <span id="two" x-text="foo"></span>
            </div>
        `,
    ],
    ({ get }) => {
        get("span#one").should(haveText("buzzbuzz"));
        get("span#two").should(haveText("fizz"));
    }
);

test(
    "handles getter setter pairs",
    [
        html`
            <div x-data="{ foo: 'fizzbuzz' }">
                <div
                    x-data="{ get bar() { return this.foo }, set bar(value) { this.foo = value } }"
                >
                    <span id="one" x-text="bar" @click="bar = 'foobar'"></span>
                </div>
                <span id="two" x-text="foo"></span>
            </div>
        `,
    ],
    ({ get }) => {
        get("span#one").should(haveText("fizzbuzz"));
        get("span#two").should(haveText("fizzbuzz"));
        get("span#one").click();
        get("span#one").should(haveText("foobar"));
        get("span#two").should(haveText("foobar"));
    }
);

test(
    "allows accessing class methods",
    [
        html`
            <script>
                class Counter {
                    value = 0;
                    constructor() {}
                    increment() {
                        this.value++;
                    }
                }
                document.addEventListener("alpine:init", () =>
                    Alpine.data("counter", () => new Counter())
                );
            </script>
            <div x-data="counter">
                <button
                    type="button"
                    @click="increment"
                    x-text="value"
                ></button>
            </div>
        `,
    ],
    ({ get }) => {
        get("button").should(haveText("0"));
        get("button").click();
        get("button").should(haveText("1"));
    }
);

test(
    "setting value doesn't register a dependency",
    [
        html`
            <div x-data="{ message: 'original' }">
                <button
                    x-effect="message = 'effected'"
                    @click="message = 'clicked'"
                    x-text="message"
                ></button>
            </div>
            ;
        `,
    ],
    ({ get }) => {
        get("button").should(haveText("effected"));
        get("button").click();
        get("button").should(haveText("clicked"));
    }
);

test(
    "properly merges the datastack with nested data",
    [
        html`
            <div x-data="{ foo: { bar: 'fizz' } }">
                <div x-data="{ bar: 'buzz' }">
                    <span
                        id="1"
                        x-text="foo.bar + bar"
                        @click="foo.bar = foo.bar + bar"
                    ></span>
                </div>
                <span id="2" x-text="foo.bar"></span>
            </div>
        `,
    ],
    ({ get }) => {
        get("span#1").should(haveText("fizzbuzz"));
        get("span#2").should(haveText("fizz"));
        get("span#1").click();
        get("span#1").should(haveText("fizzbuzzbuzz"));
        get("span#2").should(haveText("fizzbuzz"));
    }
);

test(
    "handles getter setter pairs of object",
    [
        html`
            <div x-data="{ foo:  { bar: 'fizzbuzz' } }">
                <div
                    x-data="{ get bar() { return this.foo.bar }, set bar(value) { this.foo.bar = value } }"
                >
                    <span id="one" x-text="bar" @click="bar = 'foobar'"></span>
                </div>
                <span id="two" x-text="foo.bar"></span>
            </div>
        `,
    ],
    ({ get }) => {
        get("span#one").should(haveText("fizzbuzz"));
        get("span#two").should(haveText("fizzbuzz"));
        get("span#one").click();
        get("span#one").should(haveText("foobar"));
        get("span#two").should(haveText("foobar"));
    }
);

test(
    "allows class setters invocation on nested data",
    [
        html`
            <script>
                class BaseHandler {
                    _propValue = "bar";
                    
                    get value() {
                        return this._propValue;
                    }

                    set value(v) {
                        this._propValue = v;
                    }
                }
                document.addEventListener("alpine:init", () =>
                    Alpine.data("handler", () => new BaseHandler())
                );
            </script>
            <div x-data>
                <div x-data="handler">
                    <button
                        type="button"
                        @click="value = 'foo'"
                        x-text="value"
                    ></button>
                </div>
            </div>
        `,
    ],
    ({ get }) => {
        get("button").should(haveText("bar"));
        get("button").click();
        get("button").should(haveText("foo"));
    }
);

test(
    "allows class setters to reference other objects from the data stack",
    [
        html`
            <script>
                class BaseHandler {
                    get value() {
                        return this.foo.bar;
                    }

                    set value(v) {
                        this.foo.bar = v;
                    }
                }
                document.addEventListener("alpine:init", () =>
                    Alpine.data("handler", () => new BaseHandler())
                );
            </script>
            <div x-data="{ foo:  { bar: 'fizzbuzz' } }">
                <div x-data="handler">
                    <button
                        type="button"
                        @click="value = 'foo'"
                        x-text="value"
                    ></button>
                </div>
            </div>
        `,
    ],
    ({ get }) => {
        get("button").should(haveText("fizzbuzz"));
        get("button").click();
        get("button").should(haveText("foo"));
    }
);
