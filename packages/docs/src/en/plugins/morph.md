---
order: 6
title: Morph
description: Morph an element into the provided HTML
graph_image: https://alpinejs.dev/social_morph.jpg
---

# Morph Plugin

Alpine's Morph plugin allows you to "morph" an element on the page into the provided HTML template, all while preserving any browser or Alpine state within the "morphed" element.

This is useful for updating HTML from a server request without losing Alpine's on-page state. A utility like this is at the core of full-stack frameworks like [Laravel Livewire](https://laravel-livewire.com/) and [Phoenix LiveView](https://dockyard.com/blog/2018/12/12/phoenix-liveview-interactive-real-time-apps-no-need-to-write-javascript).

The best way to understand its purpose is with the following interactive visualization. Give it a try!

<!-- START_VERBATIM -->
<div x-data="{ slide: 1 }" class="border rounded">
    <div>
        <img :src="'/img/morphs/morph'+slide+'.png'">
    </div>

    <div class="flex w-full justify-between" style="padding-bottom: 1rem">
        <div class="w-1/2 px-4">
            <button @click="slide = (slide === 1) ? 13 : slide - 1" class="w-full bg-cyan-400 rounded-full text-center py-3 font-bold text-white">Previous</button>
        </div>
        <div class="w-1/2 px-4">
            <button @click="slide = (slide % 13) + 1" class="w-full bg-cyan-400 rounded-full text-center py-3 font-bold text-white">Next</button>
        </div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="installation"></a>
## Installation

You can use this plugin by either including it from a `<script>` tag or installing it via NPM:

### Via CDN

You can include the CDN build of this plugin as a `<script>` tag, just make sure to include it BEFORE Alpine's core JS file.

```alpine
<!-- Alpine Plugins -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/morph@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

You can install Morph from NPM for use inside your bundle like so:

```shell
npm install @alpinejs/morph
```

Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'

window.Alpine = Alpine
Alpine.plugin(morph)

...
```

<a name="alpine-morph"></a>
## Alpine.morph()

The `Alpine.morph(el, newHtml)` allows you to imperatively morph a dom node based on passed in HTML. It accepts the following parameters:

| Parameter | Description |
| ---       | --- |
| `el`      | A DOM element on the page. |
| `newHtml` | A string of HTML to use as the template to morph the dom element into. |
| `options` (optional) | An options object used mainly for [injecting lifecycle hooks](#lifecycle-hooks). |

Here's an example of using `Alpine.morph()` to update an Alpine component with new HTML: (In real apps, this new HTML would likely be coming from the server)

```alpine
<div x-data="{ message: 'Change me, then press the button!' }">
    <input type="text" x-model="message">
    <span x-text="message"></span>
</div>

<button>Run Morph</button>

<script>
    document.querySelector('button').addEventListener('click', () => {
        let el = document.querySelector('div')

        Alpine.morph(el, `
            <div x-data="{ message: 'Change me, then press the button!' }">
                <h2>See how new elements have been added</h2>

                <input type="text" x-model="message">
                <span x-text="message"></span>

                <h2>but the state of this component hasn't changed? Magical.</h2>
            </div>
        `)
    })
</script>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: 'Change me, then press the button!' }" id="morph-demo-1" class="space-y-2">
        <input type="text" x-model="message" class="w-full">
        <span x-text="message"></span>
    </div>

    <button id="morph-button-1" class="mt-4">Run Morph</button>
</div>

<script>
    document.querySelector('#morph-button-1').addEventListener('click', () => {
        let el = document.querySelector('#morph-demo-1')

        Alpine.morph(el, `
            <div x-data="{ message: 'Change me, then press the button!' }" id="morph-demo-1" class="space-y-2">
                <h4>See how new elements have been added</h4>
                <input type="text" x-model="message" class="w-full">
                <span x-text="message"></span>
                <h4>but the state of this component hasn't changed? Magical.</h4>
            </div>
        `)
    })
</script>
<!-- END_VERBATIM -->

<a name="lifecycle-hooks"></a>
### Lifecycle Hooks

The "Morph" plugin works by comparing two DOM trees, the live element, and the passed in HTML.

Morph walks both trees simultaneously and compares each node and its children. If it finds differences, it "patches" (changes) the current DOM tree to match the passed in HTML's tree.

While the default algorithm is very capable, there are cases where you may want to hook into its lifecycle and observe or change its behavior as it's happening.

Before we jump into the available Lifecycle hooks themselves, let's first list out all the potential parameters they receive and explain what each one is:

| Parameter | Description |
| ---       | --- |
| `el` | This is always the actual, current, DOM element on the page that will be "patched" (changed by Morph). |
| `toEl` | This is a "template element". It's a temporary element representing what the live `el` will be patched to. It will never actually live on the page and should only be used for reference purposes. |
| `childrenOnly()` | This is a function that can be called inside the hook to tell Morph to skip the current element and only "patch" its children. |
| `skip()` | A function that when called within the hook will "skip" comparing/patching itself and the children of the current element. |

Here are the available lifecycle hooks (passed in as the third parameter to `Alpine.morph(..., options)`):

| Option | Description |
| ---       | --- |
| `updating(el, toEl, childrenOnly, skip)` | Called before patching the `el` with the comparison `toEl`.  |
| `updated(el, toEl)` | Called after Morph has patched `el`. |
| `removing(el, skip)` | Called before Morph removes an element from the live DOM. |
| `removed(el)` | Called after Morph has removed an element from the live DOM. |
| `adding(el, skip)` | Called before adding a new element. |
| `added(el)` | Called after adding a new element to the live DOM tree. |
| `key(el)` | A re-usable function to determine how Morph "keys" elements in the tree before comparing/patching. [More on that here](#keys) |
| `lookahead` | A boolean value telling Morph to enable an extra feature in its algorithm that "looks ahead" to make sure a DOM element that's about to be removed should instead just be "moved" to a later sibling. |

Here is code of all these lifecycle hooks for a more concrete reference:

```js
Alpine.morph(el, newHtml, {
    updating(el, toEl, childrenOnly, skip) {
        //
    },

    updated(el, toEl) {
        //
    },

    removing(el, skip) {
        //
    },

    removed(el) {
        //
    },

    adding(el, skip) {
        //
    },

    added(el) {
        //
    },

    key(el) {
        // By default Alpine uses the `key=""` HTML attribute.
        return el.id
    },

    lookahead: true, // Default: false
})
```

<a name="keys"></a>
### Keys

Dom-diffing utilities like Morph try their best to accurately "morph" the original DOM into the new HTML. However, there are cases where it's impossible to determine if an element should be just changed, or replaced completely.

Because of this limitation, Morph has a "key" system that allows developers to "force" preserving certain elements rather than replacing them.

The most common use-case for them is a list of siblings within a loop. Below is an example of why keys are necessary sometimes:

```html
<!-- "Live" Dom on the page: -->
<ul>
    <li>Mark</li>
    <li>Tom</li>
    <li>Travis</li>
</ul>

<!-- New HTML to "morph to": -->
<ul>
    <li>Travis</li>
    <li>Mark</li>
    <li>Tom</li>
</ul>
```

Given the above situation, Morph has no way to know that the "Travis" node has been moved in the DOM tree. It just thinks that "Mark" has been changed to "Travis" and "Travis" changed to "Tom".

This is not what we actually want, we want Morph to preserve the original elements and instead of changing them, MOVE them within the `<ul>`.

By adding keys to each node, we can accomplish this like so:

```html
<!-- "Live" Dom on the page: -->
<ul>
    <li key="1">Mark</li>
    <li key="2">Tom</li>
    <li key="3">Travis</li>
</ul>

<!-- New HTML to "morph to": -->
<ul>
    <li key="3">Travis</li>
    <li key="1">Mark</li>
    <li key="2">Tom</li>
</ul>
```

Now that there are "keys" on the `<li>`s, Morph will match them in both trees and move them accordingly.

You can configure what Morph considers a "key" with the `key:` configuration option. [More on that here](#lifecycle-hooks)
