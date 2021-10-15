---
order: 5
title: Cookie
description: Easily manage browser Cookies across page loads
---

# Cookies Plugin

Alpine's Cookies plugin allows you handling cookies.

This is useful for preventing showing banners based on the expiration time of your cookies.

This codebase was based from a well known JavaScript library for handling cookies, the (`js-cookie`)[https://github.com/js-cookie/js-cookie].

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://unpkg.com/@alpinejs/cookie@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Cookie from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/cookie
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import cookie from '@alpinejs/cookie'

Alpine.plugin(cookie)

...
```

<a name="magic-cookie"></a>
## $cookie

The primary API for using this plugin is the magic `$cookie` method.

You can wrap any value inside `x-data` with `$cookie` like below to persist its value across page loads:

```alpine
<div x-data="{ accepted: $cookie() }">
    <dialog x-bind:open="accepted!='yes'">
        <p>Please accept our Cookies!</p>
        <button x-on:click="accepted='yes'">I Accept</button>
    </dialog>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ accepted: $cookie() }">
        <dialog x-bind:open="accepted!='yes'">
            <p>Please accept our Cookies!</p>
            <button x-on:click="accepted='yes'">I Accept</button>
        </dialog>
    </div>
</div>
<!-- END_VERBATIM -->

In the above example Alpine will intercept any changes made to `accepted`, store them in your browser cookies, and persist them across page loads.

<a name="how-it-works"></a>
## How does it work?

If a value is wrapped in `$cookie`, on initialization Alpine will register its own watcher for that value. Now everytime that value changes for any reason, Alpine will store the new value in your browser [cookies](https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer).

Then when your page is reloaded, Alpine will check your browser Cookies (using the name of the property as the key) for a value. If it finds one, it will set the property value immediately.

You can observe this behavior by opening your browser devtool's Storage > Cookies viewer:

<a href="https://developer.chrome.com/docs/devtools/storage/cookies/"><img src="/img/cookie_devtools.png" alt="Chrome devtools showing the Cookies accepted property set as 'yes'"></a>

You'll observe that by simply visiting this page, Alpine already set the value of "accepted" in the Cookie list. You'll also notice it prefixes the property name "accepted" with "_x_" as a way of namespacing these values so Alpine doesn't conflict with other tools using the Cookies from your browser.

Now change the "accepted" in the following example and observe the changes made by Alpine to localStorage:

```alpine
<div x-data="{ accepted: $cookie() }">
    <button x-on:click="accepted='yes'">Accept Cookies</button>

    <span x-text="accepted"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ accepted: $cookie() }">
        <button x-on:click="accepted='yes'">Accept Cookies</button>
        <span x-text="accepted"></span>
    </div>
</div>
<!-- END_VERBATIM -->

> `$cookie` works with only plain string values.

<a name="custom-key"></a>
## Setting a custom key

By default, Alpine uses the property key that `$cookie(...)` is being assigned to ("accepted" in the above examples).

Consider the scenario where you have multiple Alpine components across pages or even on the same page that all use "accepted" as the property key.

Alpine will have no way of differentiating between these components.

In these cases, you can set your own custom key for any persisted value using the `.as` modifier like so:

```alpine
<div x-data="{ accepted: $cookie().as('accepted-terms') }">
    <button x-on:click="accepted='yes'">Accept Terms</button>

    <span x-text="accepted"></span>
</div>
```

Now Alpine will store and retrieve the above "accepted" value using the key "accepted-terms".

Here's a view of Chrome Devtools to see for yourself:

<img src="/img/cookie_custom_key_devtools.png" alt="Chrome devtools showing the accepted cookie set as 'yes'">

<a name="cookie-with-expiration"></a>
## Setting an expiration date

You can define that a cookie across the entire site, that will expire in 7 days, by using the `.using` modifier and pass an object with the `expires` key – like so:

```alpine
<div x-data="{ accepted: $cookie().using({ expires: 7 }) }">
    <button x-on:click="accepted='yes'">Accept for 7 days</button>

    <span x-text="accepted"></span>
</div>
```

If you want to define an expiring or not cookie, valid to the path of the current page, by passing an object with the `path` key – like so:

```alpine
<div x-data="{ accepted: $cookie().using({ expires: 7, path: '' }) }">
    <button x-on:click="accepted='yes'">Accept for 7 days</button>

    <span x-text="accepted"></span>
</div>
```

<a name="remove-a-cookie"></a>
## Removing a cookie

If you need to remove a cookie just defined it as `null` – like so:

```alpine
<div x-data="{ accepted: $cookie() }">
    <button x-on:click="accepted='yes'">Accept Cookies</button>

    <span x-text="accepted"></span>

    <button x-on:click="accepted=null">Refuse Cookies</button>
</div>
```

<a name="using-cookie-with-alpine-data"></a>
## Using $cookie with Alpine.data

If you want to use `$cookie` with `Alpine.data`, you need to use a standard function instead of an arrow function so Alpine can bind a custom `this` context when it initially evaluates the component scope.

```js
Alpine.data('dropdown', function () {
    return {
        open: this.$cookie(false)
    }
})
```
