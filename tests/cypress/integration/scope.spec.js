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
