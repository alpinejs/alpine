<html>
      <head>
        <meta charset="UTF-8">
        <title>README.md</title>
      </head>
      <body>
        <h1 id="alpine-js">Alpine.js</h1>
<p><img src="https://img.shields.io/bundlephobia/minzip/alpinejs" alt="npm bundle size"></p>
<p>Alpine.js offers you the reactive and declarative nature of big frameworks like Vue or React at a much lower cost.</p>
<p>You get to keep your DOM, and sprinkle in behavior as you see fit.</p>
<p>Think of it like <a href="https://tailwindcss.com/">Tailwind</a> for JavaScript.</p>
<blockquote>
<p>Note: This tool&#39;s syntax is almost entirely borrowed from <a href="https://vuejs.org/">Vue</a> (and by extension <a href="https://angularjs.org/">Angular</a>). I am forever grateful for the gift they are to the web.</p>
</blockquote>
<h2 id="install">Install</h2>
<p><strong>From CDN:</strong> Add the following script to the end of your <code>&lt;head&gt;</code> section.</p>
<pre><code class="lang-html">&lt;script src=&quot;https://cdn.jsdelivr.net/gh/alpinejs/alpine@v1.9.1/dist/alpine.js&quot; defer&gt;&lt;/script&gt;
</code></pre>
<p>That&#39;s it. It will initialize itself.</p>
<p><strong>From NPM:</strong> Install the package from NPM.</p>
<pre><code class="lang-js">npm i alpinejs
</code></pre>
<p>Include it in your script.</p>
<pre><code class="lang-js">import &#39;alpinejs&#39;
</code></pre>
<p>For IE11, polyfills will need to be provided. Please load the following scripts before the Alpine script above.</p>
<pre><code class="lang-html">&lt;script src=&quot;https://polyfill.io/v3/polyfill.min.js?features=MutationObserver%2CArray.from%2CArray.prototype.forEach%2CMap%2CSet%2CArray.prototype.includes%2CString.prototype.includes%2CPromise%2CNodeList.prototype.forEach%2CObject.values%2CReflect%2CReflect.set&quot;&gt;&lt;/script&gt;

&lt;script src=&quot;https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js&quot;&gt;&lt;/script&gt;
</code></pre>
<h2 id="use">Use</h2>
<p><em>Dropdown/Modal</em></p>
<pre><code class="lang-html">&lt;div x-data=&quot;{ open: false }&quot;&gt;
    &lt;button @click=&quot;open = true&quot;&gt;Open Dropdown&lt;/button&gt;

    &lt;ul
        x-show=&quot;open&quot;
        @click.away=&quot;open = false&quot;
    &gt;
        Dropdown Body
    &lt;/ul&gt;
&lt;/div&gt;
</code></pre>
<p><em>Tabs</em></p>
<pre><code class="lang-html">&lt;div x-data=&quot;{ tab: &#39;foo&#39; }&quot;&gt;
    &lt;button :class=&quot;{ &#39;active&#39;: tab === &#39;foo&#39; }&quot; @click=&quot;tab = &#39;foo&#39;&quot;&gt;Foo&lt;/button&gt;
    &lt;button :class=&quot;{ &#39;active&#39;: tab === &#39;bar&#39; }&quot; @click=&quot;tab = &#39;bar&#39;&quot;&gt;Bar&lt;/button&gt;

    &lt;div x-show=&quot;tab === &#39;foo&#39;&quot;&gt;Tab Foo&lt;/div&gt;
    &lt;div x-show=&quot;tab === &#39;bar&#39;&quot;&gt;Tab Bar&lt;/div&gt;
&lt;/div&gt;
</code></pre>
<p>You can even use it for non-trivial things:
<em>Pre-fetching a dropdown&#39;s HTML content on hover</em></p>
<pre><code class="lang-html">&lt;div x-data=&quot;{ open: false }&quot;&gt;
    &lt;button
        @mouseenter.once=&quot;
            fetch(&#39;/dropdown-partial.html&#39;)
                .then(response =&gt; response.text())
                .then(html =&gt; { $refs.dropdown.innerHTML = html })
        &quot;
        @click=&quot;open = true&quot;
    &gt;Show Dropdown&lt;/button&gt;

    &lt;div x-ref=&quot;dropdown&quot; x-show=&quot;open&quot; @click.away=&quot;open = false&quot;&gt;
        Loading Spinner...
    &lt;/div&gt;
&lt;/div&gt;
</code></pre>
<h2 id="learn">Learn</h2>
<p>There are 13 directives available to you:</p>
<table>
<thead>
<tr>
<th>Directive</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="#x-data"><code>x-data</code></a></td>
</tr>
<tr>
<td><a href="#x-init"><code>x-init</code></a></td>
</tr>
<tr>
<td><a href="#x-show"><code>x-show</code></a></td>
</tr>
<tr>
<td><a href="#x-bind"><code>x-bind</code></a></td>
</tr>
<tr>
<td><a href="#x-on"><code>x-on</code></a></td>
</tr>
<tr>
<td><a href="#x-model"><code>x-model</code></a></td>
</tr>
<tr>
<td><a href="#x-text"><code>x-text</code></a></td>
</tr>
<tr>
<td><a href="#x-html"><code>x-html</code></a></td>
</tr>
<tr>
<td><a href="#x-ref"><code>x-ref</code></a></td>
</tr>
<tr>
<td><a href="#x-if"><code>x-if</code></a></td>
</tr>
<tr>
<td><a href="#x-for"><code>x-for</code></a></td>
</tr>
<tr>
<td><a href="#x-transition"><code>x-transition</code></a></td>
</tr>
<tr>
<td><a href="#x-cloak"><code>x-cloak</code></a></td>
</tr>
</tbody>
</table>
<p>And 3 magic properties:</p>
<table>
<thead>
<tr>
<th>Magic Properties</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="#el"><code>$el</code></a></td>
</tr>
<tr>
<td><a href="#refs"><code>$refs</code></a></td>
</tr>
<tr>
<td><a href="#nexttick"><code>$nextTick</code></a></td>
</tr>
</tbody>
</table>
<h3 id="directives">Directives</h3>
<hr>
<h3 id="x-data"><code>x-data</code></h3>
<p><strong>Example:</strong> <code>&lt;div x-data=&quot;{ foo: &#39;bar&#39; }&quot;&gt;...&lt;/div&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;div x-data=&quot;[JSON data object]&quot;&gt;...&lt;/div&gt;</code></p>
<p><code>x-data</code> declares a new component scope. It tells the framework to initialize a new component with the following data object.</p>
<p>Think of it like the <code>data</code> property of a Vue component.</p>
<p><strong>Extract Component Logic</strong></p>
<p>You can extract data (and behavior) into reusable functions:</p>
<pre><code class="lang-html">&lt;div x-data=&quot;dropdown()&quot;&gt;
    &lt;button x-on:click=&quot;open()&quot;&gt;Open&lt;/button&gt;

    &lt;div x-show=&quot;isOpen()&quot; x-on:click.away=&quot;close()&quot;&gt;
        // Dropdown
    &lt;/div&gt;
&lt;/div&gt;

&lt;script&gt;
    function dropdown() {
        return {
            show: false,
            open() { this.show = true },
            close() { this.show = false },
            isOpen() { return this.show === true },
        }
    }
&lt;/script&gt;
</code></pre>
<p>You can also mix-in multiple data objects using object destructuring:</p>
<pre><code class="lang-html">&lt;div x-data=&quot;{...dropdown(), ...tabs()}&quot;&gt;
</code></pre>
<hr>
<h3 id="x-init"><code>x-init</code></h3>
<p><strong>Example:</strong> <code>&lt;div x-data&quot;{ foo: &#39;bar&#39; }&quot; x-init=&quot;foo = &#39;baz&quot;&gt;&lt;/div&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;div x-data=&quot;...&quot; x-init=&quot;[expression]&quot;&gt;&lt;/div&gt;</code></p>
<p><code>x-init</code> runs an expression when a component is initialized.</p>
<p>If you wish to run code AFTER Alpine has made it&#39;s initial updates to the DOM (something like a <code>mounted()</code> hook in VueJS), you can return a callback from <code>x-init</code>, and it will be run after:</p>
<p><code>x-init=&quot;return () =&gt; { // we have access to the post-dom-initialization state here // }&quot;</code></p>
<hr>
<h3 id="x-show"><code>x-show</code></h3>
<p><strong>Example:</strong> <code>&lt;div x-show=&quot;open&quot;&gt;&lt;/div&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;div x-show=&quot;[expression]&quot;&gt;&lt;/div&gt;</code></p>
<p><code>x-show</code> toggles the <code>display: none;</code> style on the element depending if the expression resolves to <code>true</code> or <code>false</code>.</p>
<hr>
<h3 id="x-bind"><code>x-bind</code></h3>
<blockquote>
<p>Note: You are free to use the shorter &quot;:&quot; syntax: <code>:type=&quot;...&quot;</code></p>
</blockquote>
<p><strong>Example:</strong> <code>&lt;input x-bind:type=&quot;inputType&quot;&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;input x-bind:[attribute]=&quot;[expression]&quot;&gt;</code></p>
<p><code>x-bind</code> sets the value of an attribute to the result of a JavaScript expression. The expression has access to all the keys of the component&#39;s data object, and will update every-time it&#39;s data is updated.</p>
<blockquote>
<p>Note: attribute bindings ONLY update when their dependencies update. The framework is smart enough to observe data changes and detect which bindings care about them.</p>
</blockquote>
<p><strong><code>x-bind</code> for class attributes</strong></p>
<p><code>x-bind</code> behaves a little differently when binding to the <code>class</code> attribute.</p>
<p>For classes, you pass in an object who&#39;s keys are class names, and values are boolean expressions to determine if those class names are applied or not.</p>
<p>For example:
<code>&lt;div x-bind:class=&quot;{ &#39;hidden&#39;: foo }&quot;&gt;&lt;/div&gt;</code></p>
<p>In this example, the &quot;hidden&quot; class will only be applied when the value of the <code>foo</code> data attribute is <code>true</code>.</p>
<p><strong><code>x-bind</code> for boolean attributes</strong></p>
<p><code>x-bind</code> supports boolean attributes in the same way that value attributes, using a variable as the condition or any JavaScript expression that resolves to <code>true</code> or <code>false</code>.</p>
<p>For example:
<code>&lt;button x-bind:disabled=&quot;myVar&quot;&gt;Click me&lt;/button&gt;</code></p>
<p>This will add or remove the <code>disabled</code> attribute when <code>myVar</code> is true or false respectively.</p>
<p>Most common boolean attributes are supported, like <code>readonly</code>, <code>required</code>, etc.</p>
<hr>
<h3 id="x-on"><code>x-on</code></h3>
<blockquote>
<p>Note: You are free to use the shorter &quot;@&quot; syntax: <code>@click=&quot;...&quot;</code></p>
</blockquote>
<p><strong>Example:</strong> <code>&lt;button x-on:click=&quot;foo = &#39;bar&#39;&quot;&gt;&lt;/button&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;button x-on:[event]=&quot;[expression]&quot;&gt;&lt;/button&gt;</code></p>
<p><code>x-on</code> attaches an event listener to the element it&#39;s declared on. When that event is emitted, the JavaScript expression set as it&#39;s value is executed.</p>
<p>If any data is modified in the expression, other element attributes &quot;bound&quot; to this data, will be updated.</p>
<p><strong><code>keydown</code> modifiers</strong></p>
<p><strong>Example:</strong> <code>&lt;input type=&quot;text&quot; x-on:keydown.escape=&quot;open = false&quot;&gt;</code></p>
<p>You can specify specific keys to listen for using keydown modifiers appended to the <code>x-on:keydown</code> directive. Note that the modifiers are kebab-cased versions of <code>Event.key</code> values.</p>
<p>Examples: <code>enter</code>, <code>escape</code>, <code>arrow-up</code>, <code>arrow-down</code></p>
<blockquote>
<p>Note: You can also listen for system-modifier key combinations like: <code>x-on:keydown.cmd.enter=&quot;foo&quot;</code></p>
</blockquote>
<p><strong><code>.away</code> modifier</strong></p>
<p><strong>Example:</strong> <code>&lt;div x-on:click.away=&quot;showModal = false&quot;&gt;&lt;/div&gt;</code></p>
<p>When the <code>.away</code> modifier is present, the event handler will only be executed when the event originates from a source other than itself, or its children.</p>
<p>This is useful for hiding dropdowns and modals when a user clicks away from them.</p>
<p><strong><code>.prevent</code> modifier</strong>
<strong>Example:</strong> <code>&lt;input type=&quot;checkbox&quot; x-on:click.prevent&gt;</code></p>
<p>Adding <code>.prevent</code> to an event listener will call <code>preventDefault</code> on the triggered event. In the above example, this means the checkbox wouldn&#39;t actually get checked when a user clicks on it.</p>
<p><strong><code>.stop</code> modifier</strong>
<strong>Example:</strong> <code>&lt;div x-on:click=&quot;foo = &#39;bar&#39;&quot;&gt;&lt;button x-on:click.stop&gt;&lt;/button&gt;&lt;/div&gt;</code></p>
<p>Adding <code>.stop</code> to an event listener will call <code>stopPropagation</code> on the triggered event. In the above example, this means the &quot;click&quot; event won&#39;t bubble from the button to the outer <code>&lt;div&gt;</code>. Or in other words, when a user clicks the button, <code>foo</code> won&#39;t be set to <code>&#39;bar&#39;</code>.</p>
<p><strong><code>.window</code> modifier</strong>
<strong>Example:</strong> <code>&lt;div x-on:resize.window=&quot;isOpen = window.outerWidth &gt; 768 ? false : open&quot;&gt;&lt;/div&gt;</code></p>
<p>Adding <code>.window</code> to an event listener will install the listener on the global window object instead of the DOM node on which it is declared. This is useful for when you want to modify component state when something changes with the window, like the resize event. In this example, when the window grows larger than 768 pixels wide, we will close the modal/dropdown, otherwise maintain the same state.</p>
<blockquote>
<p>Note: You can also use the <code>.document</code> modifier to attach listeners to <code>document</code> instead of <code>window</code></p>
</blockquote>
<p><strong><code>.once</code> modifier</strong>
<strong>Example:</strong> <code>&lt;button x-on:mouseenter.once=&quot;fetchSomething()&quot;&gt;&lt;/button&gt;</code></p>
<p>Adding the <code>.once</code> modifier to an event listener will ensure that the listener will only be handled once. This is useful for things you only want to do once, like fetching HTML partials and such.</p>
<hr>
<h3 id="x-model"><code>x-model</code></h3>
<p><strong>Example:</strong> <code>&lt;input type=&quot;text&quot; x-model=&quot;foo&quot;&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;input type=&quot;text&quot; x-model=&quot;[data item]&quot;&gt;</code></p>
<p><code>x-model</code> adds &quot;two-way data binding&quot; to an element. In other words, the value of the input element will be kept in sync with the value of the data item of the component.</p>
<blockquote>
<p>Note: <code>x-model</code> is smart enough to detect changes on text inputs, checkboxes, radio buttons, textareas, selects, and multiple selects. It should behave <a href="https://vuejs.org/v2/guide/forms.html">how Vue would</a> in those scenarios.</p>
</blockquote>
<hr>
<h3 id="x-text"><code>x-text</code></h3>
<p><strong>Example:</strong> <code>&lt;span x-text=&quot;foo&quot;&gt;&lt;/span&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;span x-text=&quot;[expression]&quot;</code></p>
<p><code>x-text</code> works similarly to <code>x-bind</code>, except instead of updating the value of an attribute, it will update the <code>innerText</code> of an element.</p>
<hr>
<h3 id="x-html"><code>x-html</code></h3>
<p><strong>Example:</strong> <code>&lt;span x-html=&quot;foo&quot;&gt;&lt;/span&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;span x-html=&quot;[expression]&quot;</code></p>
<p><code>x-html</code> works similarly to <code>x-bind</code>, except instead of updating the value of an attribute, it will update the <code>innerHTML</code> of an element.</p>
<hr>
<h3 id="x-ref"><code>x-ref</code></h3>
<p><strong>Example:</strong> <code>&lt;div x-ref=&quot;foo&quot;&gt;&lt;/div&gt;&lt;button x-on:click=&quot;$refs.foo.innerText = &#39;bar&#39;&quot;&gt;&lt;/button&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;div x-ref=&quot;[ref name]&quot;&gt;&lt;/div&gt;&lt;button x-on:click=&quot;$refs.[ref name].innerText = &#39;bar&#39;&quot;&gt;&lt;/button&gt;</code></p>
<p><code>x-ref</code> provides a convenient way to retrieve raw DOM elements out of your component. By setting an <code>x-ref</code> attribute on an element, you are making it available to all event handlers inside an object called <code>$refs</code>.</p>
<p>This is a helpful alternative to setting ids and using <code>document.querySelector</code> all over the place.</p>
<hr>
<h3 id="x-if"><code>x-if</code></h3>
<p><strong>Example:</strong> <code>&lt;template x-if=&quot;true&quot;&gt;&lt;div&gt;Some Element&lt;/div&gt;&lt;/template&gt;</code></p>
<p><strong>Structure:</strong> <code>&lt;template x-if=&quot;[expression]&quot;&gt;&lt;div&gt;Some Element&lt;/div&gt;&lt;/template&gt;</code></p>
<p>For cases where <code>x-show</code> isn&#39;t sufficient (<code>x-show</code> sets an element to <code>display: none</code> if it&#39;s false), <code>x-if</code> can be used to  actually remove an element completely from the DOM.</p>
<p>It&#39;s important that <code>x-if</code> is used on a <code>&lt;template&gt;&lt;/template&gt;</code> tag because Alpine doesn&#39;t use a virtual DOM. This implementation allows Alpine to stay rugged and use the real DOM to work it&#39;s magic.</p>
<blockquote>
<p>Note: <code>x-if</code> must have a single element root inside the <code>&lt;template&gt;&lt;/template&gt;</code> tag.</p>
</blockquote>
<hr>
<h3 id="x-for"><code>x-for</code></h3>
<p><strong>Example:</strong></p>
<pre><code class="lang-html">&lt;template x-for=&quot;item in items&quot; :key=&quot;item&quot;&gt;
    &lt;div x-text=&quot;item&quot;&gt;&lt;/div&gt;
&lt;/template&gt;
</code></pre>
<p><code>x-for</code> is available for cases when you want to create new DOM nodes for each item in an array. This should appear similar to <code>v-for</code> in Vue, with one exception of needing to exist on a <code>template</code> tag, and not a regular DOM element.</p>
<blockquote>
<p>Note: the <code>:key</code> binding is optional, but HIGHLY recommended.</p>
</blockquote>
<hr>
<h3 id="x-transition"><code>x-transition</code></h3>
<p><strong>Example:</strong></p>
<pre><code class="lang-html">&lt;div
    x-show=&quot;open&quot;
    x-transition:enter=&quot;ease-out transition-slow&quot;
    x-transition:enter-start=&quot;opacity-0 scale-90&quot;
    x-transition:enter-end=&quot;opacity-100 scale-100&quot;
    x-transition:leave=&quot;ease-in transition-slow&quot;
    x-transition:leave-start=&quot;opacity-100 scale-100&quot;
    x-transition:leave-end=&quot;opacity-0 scale-90&quot;
&gt;...&lt;/div&gt;
</code></pre>
<pre><code class="lang-html">&lt;template x-if=&quot;open&quot;&gt;
    &lt;div
        x-transition:enter=&quot;ease-out transition-slow&quot;
        x-transition:enter-start=&quot;opacity-0 scale-90&quot;
        x-transition:enter-end=&quot;opacity-100 scale-100&quot;
        x-transition:leave=&quot;ease-in transition-slow&quot;
        x-transition:leave-start=&quot;opacity-100 scale-100&quot;
        x-transition:leave-end=&quot;opacity-0 scale-90&quot;
    &gt;...&lt;/div&gt;
&lt;/template&gt;
</code></pre>
<p>Alpine offers 6 different transition directives for applying classes to various stages of an element&#39;s transition between &quot;hidden&quot; and &quot;shown&quot; states. These directives work both with <code>x-show</code> AND <code>x-if</code>.</p>
<p>These behave exactly like VueJs&#39;s transition directives, except they have different, more sensible names:</p>
<table>
<thead>
<tr>
<th>Directive</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>:enter</code></td>
<td>Applied during the entire entering phase.</td>
</tr>
<tr>
<td><code>:enter-start</code></td>
<td>Added before element is inserted, removed one frame after element is inserted.</td>
</tr>
<tr>
<td><code>:enter-end</code></td>
<td>Added one frame after element is inserted (at the same time <code>enter-start</code> is removed), removed when transition/animation finishes.</td>
</tr>
<tr>
<td><code>:leave</code></td>
<td>Applied during the entire leaving phase.</td>
</tr>
<tr>
<td><code>:leave-start</code></td>
<td>Added immediately when a leaving transition is triggered, removed after one frame.</td>
</tr>
<tr>
<td><code>:leave-end</code></td>
<td>Added one frame after a leaving transition is triggered (at the same time <code>leave-start</code> is removed), removed when the transition/animation finishes.</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="x-cloak"><code>x-cloak</code></h3>
<p><strong>Example:</strong> <code>&lt;div x-data=&quot;{}&quot; x-cloak&gt;&lt;/div&gt;</code></p>
<p><code>x-cloak</code> attributes are removed from elements when Alpine initializes. This is useful for hiding pre-initialized DOM. It&#39;s typical to add the following global style for this to work:</p>
<pre><code class="lang-html">&lt;style&gt;
    [x-cloak] { display: none; }
&lt;/style&gt;
</code></pre>
<h3 id="magic-properties">Magic Properties</h3>
<hr>
<h3 id="-el"><code>$el</code></h3>
<p><strong>Example:</strong></p>
<pre><code class="lang-html">&lt;div x-data&gt;
    &lt;button @click=&quot;$el.innerHTML = &#39;foo&#39;&quot;&gt;Replace me with &quot;foo&quot;&lt;/button&gt;
&lt;/div&gt;
</code></pre>
<p><code>$el</code> is a magic property that can be used to retrieve the root component DOM node.</p>
<h3 id="-refs"><code>$refs</code></h3>
<p><strong>Example:</strong></p>
<pre><code class="lang-html">&lt;span x-ref=&quot;foo&quot;&gt;

&lt;button x-on:click=&quot;$refs.foo.innerText = &#39;bar&#39;&quot;&gt;
</code></pre>
<p><code>$refs</code> is a magic property that can be used to retrieve DOM elements marked with <code>x-ref</code> inside the component. This is useful when you need to manually manipulate DOM elements.</p>
<hr>
<h3 id="-nexttick"><code>$nextTick</code></h3>
<p><strong>Example:</strong></p>
<pre><code class="lang-html">&lt;div x-data=&quot;{ fruit: &#39;apple&#39; }&quot;&gt;
    &lt;button
        x-on:click=&quot;
            fruit = &#39;pear&#39;;
            $nextTick(() =&gt; { console.log($event.target.innerText) });
        &quot;
        x-text=&quot;fruit&quot;
    &gt;
&lt;/div&gt;
</code></pre>
<p><code>$nextTick</code> is a magic property that allows you to only execute a given expression AFTER Alpine has made it&#39;s reactive DOM updates. This is useful for times you want to interact with the DOM state AFTER it&#39;s reflected any data updates you&#39;ve made.</p>
<h2 id="license">License</h2>
<p>Copyright © 2019-2020 Caleb Porzio and contributors</p>
<p>Licensed under the MIT license, see <a href="LICENSE.md">LICENSE.md</a> for details.</p>

      </body>
    </html>