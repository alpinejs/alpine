---
order: 1
title: CSP
---

# CSP (Content-Security Policy) Build

In order for Alpine to execute JavaScript expressions from HTML attributes like `x-on:click="console.log()"`, it needs to use utilities that violate the "unsafe-eval" [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) that some applications enforce for security purposes.

> Under the hood, Alpine doesn't actually use eval() itself because it's slow and problematic. Instead it uses Function declarations, which are much better, but still violate "unsafe-eval".

Alpine offers an alternate build that doesn't violate "unsafe-eval" and supports most of Alpine's inline expression syntax.

<a name="installation"></a>
## Installation

You can use this build by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include this build's CDN as a `<script>` tag just like you would normally with standard Alpine build:

```alpine
<!-- Alpine's CSP-friendly Core -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can alternatively install this build from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/csp
```

Then initialize it from your bundle:

```js
import Alpine from '@alpinejs/csp'

window.Alpine = Alpine

Alpine.start()
```

<a name="basic-example"></a>
## Basic Example

Here's a working counter component using Alpine's CSP build. Notice how most expressions work exactly like regular Alpine:

```alpine
<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'nonce-a23gbfz9e'">
        <script defer nonce="a23gbfz9e" src="https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js"></script>
    </head>
    <body>
        <div x-data="{ count: 0, message: 'Hello' }">
            <button x-on:click="count++">Increment</button>
            <button x-on:click="count = 0">Reset</button>

            <span x-text="count"></span>
            <span x-text="message + ' World'"></span>
            <span x-show="count > 5">Count is greater than 5!</span>
        </div>
    </body>
</html>
```

<a name="whats-supported"></a>
## What's Supported

The CSP build supports most JavaScript expressions you'd want to use in Alpine:

### Object and Array Literals
```alpine
<!-- ✅ These work -->
<div x-data="{ user: { name: 'John', age: 30 }, items: [1, 2, 3] }">
    <span x-text="user.name"></span>
    <span x-text="items[0]"></span>
</div>
```

### Basic Operations
```alpine
<!-- ✅ These work -->
<div x-data="{ count: 5, name: 'Alpine' }">
    <span x-text="count + 10"></span>
    <span x-text="count > 3"></span>
    <span x-text="count === 5 ? 'Yes' : 'No'"></span>
    <span x-text="'Hello ' + name"></span>
    <div x-show="!loading && count > 0"></div>
</div>
```

### Assignments and Updates
```alpine
<!-- ✅ These work -->
<div x-data="{ count: 0, user: { name: '' } }">
    <button x-on:click="count++">Increment</button>
    <button x-on:click="count = 0">Reset</button>
    <input x-model="user.name">
</div>
```

### Method Calls
```alpine
<!-- ✅ These work -->
<div x-data="{ items: ['a', 'b'] }">
    <button x-on:click="items.push('c')">Add Item</button>
</div>
```

<a name="whats-not-supported"></a>
## What's Not Supported

Some advanced and potentially dangerous JavaScript features aren't supported:

### Complex Expressions
```alpine
<!-- ❌ These don't work -->
<div x-data="{ user: { name: '' } }">
    <!-- Property assignments -->
    <button x-on:click="user.name = 'John'">Bad</button>

    <!-- Arrow functions -->
    <button x-on:click="() => console.log('hi')">Bad</button>

    <!-- Destructuring -->
    <div x-text="{ name } = user">Bad</div>

    <!-- Template literals -->
    <div x-text="`Hello ${name}`">Bad</div>

    <!-- Spread operator -->
    <div x-data="{ ...defaults }">Bad</div>
</div>
```

### Global Variables and Functions
```alpine
<!-- ❌ These don't work -->
<div x-data>
    <button x-on:click="console.log('hi')"></button>
    <span x-text="document.title"></span>
    <span x-text="window.innerWidth"></span>
    <span x-text="Math.max(count, 100)"></span>
    <span x-text="parseInt('123') + count"></span>
    <span x-text="JSON.stringify({ value: count })"></span>
</div>
```

### HTML Injection
```alpine
<!-- ❌ These don't work -->
<div x-data="{ message: 'Hello <span>World</span>' }">
    <span x-html="message"></span>
    <span x-init="$el.insertAdjacentHTML('beforeend', message)"></span>
</div>
```

<a name="when-to-extract-logic"></a>
## When to Extract Logic

While the CSP build supports simple inline expressions, you'll want to extract complex logic into dedicated functions or Alpine.data() components for better organization:

```alpine
<!-- Instead of this -->
<div x-data="{ users: [] }" x-show="users.filter(u => u.active && u.role === 'admin').length > 0">
```

```alpine
<!-- Do this -->
<div x-data="userManager" x-show="hasActiveAdmins">

<script nonce="...">
    Alpine.data('userManager', () => ({
        users: [],

        get hasActiveAdmins() {
            return this.users.filter(u => u.active && u.role === 'admin').length > 0
        }
    }))
</script>
```

This approach makes your code more readable, testable, and maintainable, especially for complex applications.

<a name="csp-headers"></a>
## CSP Headers

Here's an example CSP header that works with Alpine's CSP build:

```
Content-Security-Policy: default-src 'self'; script-src 'nonce-[random]' 'strict-dynamic';
```

The key is removing `'unsafe-eval'` from your `script-src` directive while still allowing your nonce-based scripts to run.