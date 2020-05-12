import Alpine from "alpinejs";
import { wait } from "@testing-library/dom";

global.MutationObserver = class {
    observe() {}
};

test("x-for x-target", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = ['foo', 'bar']"></button>

            <ul></ul>

            <template x-target="'ul'" x-for="item in items">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(1);
    expect(document.querySelectorAll("ul li")[0].innerText).toEqual("foo");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(2);
    });

    expect(document.querySelector("ul").innerHTML.replace(/\s+/g, ' ')).toEqual('<!--items--> <li x-text=\"item\"></li> <li x-text=\"item\"></li> ');
});


test("x-for x-target not empty: linebreak", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = ['foo', 'bar']"></button>

            <ul>
            </ul>

            <template x-target="'ul'" x-for="item in items">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(1);
    expect(document.querySelectorAll("ul li")[0].innerText).toEqual("foo");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(2);
    });

    expect(document.querySelector("ul").innerHTML.replace(/\s+/g, ' ')).toEqual(' <li x-text=\"item\"></li> <li x-text=\"item\"></li> ');
});


test("x-for x-target not empty: first child same line", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = ['foo', 'bar']"></button>

            <ul><li>already here</li>
             <li>already here2</li>
            </ul>

            <template x-target="'ul'" x-for="item in items">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(3);
    expect(document.querySelectorAll("ul li")[1].innerText).toEqual("foo");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(4);
    });

    expect(document.querySelector("ul").innerHTML.replace(/\s+/g, ' ')).toEqual('<li>already here</li> <li x-text=\"item\"></li> <li x-text=\"item\"></li> <li>already here2</li> ');
});


test("x-for x-target not empty: first child next line", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = ['foo', 'bar']"></button>

            <ul>
             <li>already here</li>
             <li>already here2</li>
            </ul>

            <template x-target="'ul'" x-for="item in items">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(3);
    expect(document.querySelectorAll("ul li")[0].innerText).toEqual("foo");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(4);
    });

    expect(document.querySelector("ul").innerHTML.replace(/\s+/g, ' ')).toEqual(' <li x-text=\"item\"></li> <li x-text=\"item\"></li> <li>already here</li> <li>already here2</li> ');
});

test("x-for x-target removes all elements when array is empty and previously had one item", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = []"></button>

            <ul></ul>

            <template x-target="'ul'" x-for="item in items">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(1);

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(0);
    });
});

test("x-for x-target removes all elements when array is empty and previously had multiple items", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar', 'world'] }">
            <button x-on:click="items = []"></button>

            <ul></ul>

            <template x-target="'ul'" x-for="item in items">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(3);

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(0);
    });
});

test("x-for x-target elements inside of loop are reactive", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'], foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>

            <ul></ul>

            <template x-target="'ul'" x-for="item in items">
                <li>
                    <h1 x-text="item"></h1>
                    <h2 x-text="foo"></h2>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(1);
    expect(document.querySelector("h1").innerText).toEqual("first");
    expect(document.querySelector("h2").innerText).toEqual("bar");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelector("h1").innerText).toEqual("first");
        expect(document.querySelector("h2").innerText).toEqual("baz");
    });
});

test("x-for x-target components inside of loop are reactive", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'] }">
            
            <ul></ul>

            <template x-target="'ul'" x-for="item in items">
                <li x-data="{foo: 'bar'}" class="child">
                    <span x-text="foo"></span>
                    <button x-on:click="foo = 'bob'"></button>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li.child").length).toEqual(1);
    expect(document.querySelector("ul li span").innerText).toEqual("bar");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelector("ul li span").innerText).toEqual("bob");
    });
});

test("x-for x-target components inside a plain element of loop are reactive", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'] }">
        
            <ul></ul>

            <template x-target="'ul'" x-for="item in items">
                <li>
                    <div x-data="{foo: 'bar'}" class="child">
                        <span x-text="foo"></span>
                        <button x-on:click="foo = 'bob'"></button>
                    </div>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(1);
    expect(document.querySelector("ul li div span").innerText).toEqual("bar");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelector("ul li div span").innerText).toEqual("bob");
    });
});

test("x-for x-target adding key attribute moves dom nodes properly", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'] }">
            <button x-on:click="items = ['bar', 'foo', 'baz']"></button>

            <ul></ul>

            <template x-target="'ul'" x-for="item in items" :key="item">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(2);
    const itemA = document.querySelectorAll("ul li")[0];
    itemA.setAttribute("order", "first");
    const itemB = document.querySelectorAll("ul li")[1];
    itemB.setAttribute("order", "second");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(3);
    });

    expect(document.querySelectorAll("ul li")[0].getAttribute("order")).toEqual(
        "second"
    );
    expect(document.querySelectorAll("ul li")[1].getAttribute("order")).toEqual(
        "first"
    );
    expect(document.querySelectorAll("ul li")[2].getAttribute("order")).toEqual(
        null
    );
});

test("x-for x-target can key by index", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'] }">
            <button x-on:click="items = ['bar', 'foo', 'baz']"></button>

            <ul></ul>

            <template x-target="'ul'" x-for="(item, index) in items" :key="index">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(2);

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(3);
    });
});

test("x-for x-target can use index inside of loop", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <ul></ul>

            <template x-target="'ul'" x-for="(item, index) in items">
                <li>
                    <h1 x-text="items.indexOf(item)"></h1>
                    <h2 x-text="index"></h2>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelector("ul li h1").innerText).toEqual(0);
    expect(document.querySelector("ul li h2").innerText).toEqual(0);
});

test("x-for x-target can use third iterator param (collection) inside of loop", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <ul></ul>

            <template x-target="'ul'" x-for="(item, index, things) in items">
                <li>
                    <h1 x-text="items"></h1>
                    <h2 x-text="things"></h2>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelector("ul li h1").innerText).toEqual(["foo"]);
    expect(document.querySelector("ul li h2").innerText).toEqual(["foo"]);
});

test("x-for x-target can use x-if in conjunction with x-for", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'], show: false }">
            <ul></ul>

            <button @click="show = ! show"></button>

            <template x-target="'ul'" x-if="show" x-for="item in items">
                <li x-text="item"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(0);

    document.querySelector("button").click();

    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(document.querySelectorAll("ul li").length).toEqual(2);

    document.querySelector("button").click();

    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(document.querySelectorAll("ul li").length).toEqual(0);
});

test("x-for x-target listeners in loop get fresh iteration data even though they are only registered initially", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'], output: '' }">
            <button x-on:click="items = ['bar']"></button>
            
            <ul></ul>

            <template x-target="'ul'" x-for="(item, index) in items">
                <li x-text="item" x-on:click="output = item"></li>
            </template>

            <h1 x-text="output"></h1>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(1);

    document.querySelector("ul li").click();

    await wait(() => {
        expect(document.querySelector("h1").innerText).toEqual("foo");
    });

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelector("ul li").innerText).toEqual("bar");
    });

    document.querySelector("ul li").click();

    await wait(() => {
        expect(document.querySelector("h1").innerText).toEqual("bar");
    });
});

test("x-for x-target nested x-for", async () => {
    document.body.innerHTML = `
        <div x-data="{ foos: [ {bars: ['bob', 'lob']} ] }">
            <button x-on:click="foos = [ {bars: ['bob', 'lob']}, {bars: ['law']} ]"></button>
            
            <ul></ul>

            <template x-target="'ul'" x-for="foo in foos">
                <li>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="bar"></h2>
                    </template>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(1);
    });
    await wait(() => {
        expect(document.querySelectorAll("ul li h2").length).toEqual(2);
    });

    expect(document.querySelectorAll("ul li h2")[0].innerText).toEqual("bob");
    expect(document.querySelectorAll("ul li h2")[1].innerText).toEqual("lob");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li h2").length).toEqual(3);
    });

    expect(document.querySelectorAll("ul li h2")[0].innerText).toEqual("bob");
    expect(document.querySelectorAll("ul li h2")[1].innerText).toEqual("lob");
    expect(document.querySelectorAll("ul li h2")[2].innerText).toEqual("law");
});

// TODO this doesn't yet work
test("x-for x-target nested x-target", async () => {
    document.body.innerHTML = `
        <div id='huh' x-data="{ foos: [ {bars: ['bob', 'lob']} ] }">
            <button x-on:click="foos = [ {bars: ['bob', 'lob', 'lob2']}, {bars: ['law']} ]"></button>
            
            <ul></ul>

            <template x-target="'ul'" x-for="(foo, foo_index) in foos">
                <li x-bind:id="'li_'+foo_index">
                    <select x-bind:id="'sl_'+foo_index"></select>

                    <template x-target="'#sl_'+foo_index" x-for="bar in foo.bars">
                        <option x-text="bar"></option>
                    </template>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(1);
        expect(document.querySelectorAll("ul li select option").length).toEqual(2);
    });

    expect(document.querySelectorAll("ul li select option")[0].innerText).toEqual("bob");
    expect(document.querySelectorAll("ul li select option")[1].innerText).toEqual("lob");

    document.querySelector("button").click();


    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(2);
        expect(document.querySelectorAll("ul li select option").length).toEqual(4);
    });

    expect(document.querySelectorAll("ul li select option")[0].innerText).toEqual("bob");
    expect(document.querySelectorAll("ul li select option")[1].innerText).toEqual("lob");
    expect(document.querySelectorAll("ul li select option")[2].innerText).toEqual("lob2");
    expect(document.querySelectorAll("ul li select option")[3].innerText).toEqual("law");
});

test("x-for x-target updates the right elements when new item are inserted at the beginning of the list", async () => {
    document.body.innerHTML = `
        <div x-data="{ items: [{name: 'one', key: '1'}, {name: 'two', key: '2'}] }">

            <ul></ul>

            <button x-on:click="items = [{name: 'zero', key: '0'}, {name: 'one', key: '1'}, {name: 'two', key: '2'}]"></button>

            <template x-target="'ul'" x-for="item in items" :key="item.key">
                <li x-text="item.name"></li>
            </template>
        </div>
    `;

    Alpine.start();

    expect(document.querySelectorAll("ul li").length).toEqual(2);
    const itemA = document.querySelectorAll("ul li")[0];
    itemA.setAttribute("order", "first");
    const itemB = document.querySelectorAll("ul li")[1];
    itemB.setAttribute("order", "second");

    document.querySelector("button").click();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(3);
    });

    expect(document.querySelectorAll("ul li")[0].innerText).toEqual("zero");
    expect(document.querySelectorAll("ul li")[1].innerText).toEqual("one");
    expect(document.querySelectorAll("ul li")[2].innerText).toEqual("two");

    // Make sure states are preserved
    expect(document.querySelectorAll("ul li")[0].getAttribute("order")).toEqual(
        null
    );
    expect(document.querySelectorAll("ul li")[1].getAttribute("order")).toEqual(
        "first"
    );
    expect(document.querySelectorAll("ul li")[2].getAttribute("order")).toEqual(
        "second"
    );
});

test("x-for x-target nested x-for access outer loop variable", async () => {
    document.body.innerHTML = `
        <div x-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
            
            <ul></ul>

            <template x-target="'ul'" x-for="foo in foos">
                <li>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="foo.name+': '+bar"></h2>
                    </template>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(2);
    });
    await wait(() => {
        expect(document.querySelectorAll("ul li h2").length).toEqual(4);
    });

    expect(document.querySelectorAll("ul li h2")[0].innerText).toEqual("foo: bob");
    expect(document.querySelectorAll("ul li h2")[1].innerText).toEqual("foo: lob");
    expect(document.querySelectorAll("ul li h2")[2].innerText).toEqual("baz: bab");
    expect(document.querySelectorAll("ul li h2  ")[3].innerText).toEqual("baz: lab");
});

test("x-for x-target nested x-for event listeners", async () => {
    document._alerts = [];

    document.body.innerHTML = `
        <div x-data="{ foos: [
            {name: 'foo', bars: [{name: 'bob', count: 0}, {name: 'lob', count: 0}]},
            {name: 'baz', bars: [{name: 'bab', count: 0}, {name: 'lab', count: 0}]}
        ], fnText: function(foo, bar) { return foo.name+': '+bar.name+' = '+bar.count; } }">
            <ul></ul>

            <template x-target="'ul'" x-for="foo in foos">
                <li>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="fnText(foo, bar)"
                            x-on:click="bar.count += 1; document._alerts.push(fnText(foo, bar))"
                        ></h2>
                    </template>
                </li>
            </template>
        </div>
    `;

    Alpine.start();

    await wait(() => {
        expect(document.querySelectorAll("ul li").length).toEqual(2);
    });
    await wait(() => {
        expect(document.querySelectorAll("ul li h2").length).toEqual(4);
    });

    expect(document.querySelectorAll("ul li h2")[0].innerText).toEqual(
        "foo: bob = 0"
    );
    expect(document.querySelectorAll("ul li h2")[1].innerText).toEqual(
        "foo: lob = 0"
    );
    expect(document.querySelectorAll("ul li h2")[2].innerText).toEqual(
        "baz: bab = 0"
    );
    expect(document.querySelectorAll("ul li h2")[3].innerText).toEqual(
        "baz: lab = 0"
    );

    expect(document._alerts.length).toEqual(0);

    document.querySelectorAll("ul li h2")[0].click();

    await wait(() => {
        expect(document.querySelectorAll("ul li h2")[0].innerText).toEqual(
            "foo: bob = 1"
        );
        expect(document.querySelectorAll("ul li h2")[1].innerText).toEqual(
            "foo: lob = 0"
        );
        expect(document.querySelectorAll("ul li h2")[2].innerText).toEqual(
            "baz: bab = 0"
        );
        expect(document.querySelectorAll("ul li h2")[3].innerText).toEqual(
            "baz: lab = 0"
        );

        expect(document._alerts.length).toEqual(1);
        expect(document._alerts[0]).toEqual("foo: bob = 1");
    });

    document.querySelectorAll("ul li h2")[2].click();

    await wait(() => {
        expect(document.querySelectorAll("ul li h2")[0].innerText).toEqual(
            "foo: bob = 1"
        );
        expect(document.querySelectorAll("ul li h2")[1].innerText).toEqual(
            "foo: lob = 0"
        );
        expect(document.querySelectorAll("ul li h2")[2].innerText).toEqual(
            "baz: bab = 1"
        );
        expect(document.querySelectorAll("ul li h2")[3].innerText).toEqual(
            "baz: lab = 0"
        );

        expect(document._alerts.length).toEqual(2);
        expect(document._alerts[0]).toEqual("foo: bob = 1");
        expect(document._alerts[1]).toEqual("baz: bab = 1");
    });

    document.querySelectorAll("ul li h2")[0].click();

    await wait(() => {
        expect(document.querySelectorAll("ul li h2")[0].innerText).toEqual(
            "foo: bob = 2"
        );
        expect(document.querySelectorAll("ul li h2")[1].innerText).toEqual(
            "foo: lob = 0"
        );
        expect(document.querySelectorAll("ul li h2")[2].innerText).toEqual(
            "baz: bab = 1"
        );
        expect(document.querySelectorAll("ul li h2")[3].innerText).toEqual(
            "baz: lab = 0"
        );

        expect(document._alerts.length).toEqual(3);
        expect(document._alerts[0]).toEqual("foo: bob = 1");
        expect(document._alerts[1]).toEqual("baz: bab = 1");
        expect(document._alerts[2]).toEqual("foo: bob = 2");
    });
});
