---
order: 10
title: Turnout
description: A lightweight, persistent tab-style switch for Alpine.js
graph_image: https://alpine-turnout.netlify.app/alpine-turnout.png
---

# Alpine Turnout Plugin

## A lightweight, persistent tab-style switch for Alpine.js

Unlike traditional routers that destroy and recreate DOM elements, **Alpine Turnout** treats your routes like railroad tracks.

Every section stays in the DOM, preserving its internal state, while the "Turnout" guides the view and URL to the correct destination.

## Why Turnout?

-   **Zero-Config:** just setup your `html` layout like normally and use the `x-route` attribute to declare the routes.

-   **Persistence:** Forms, scroll positions, and component data are preserved when navigating away and back.
    
-   **Instant Switching:** No re-mounting or re-fetching logic on every click.
    
-   **Alpine-Native:** Uses a global store and works with a single directive.
    
-   **Transitions:** Works seamlessly with Alpine's `x-transition`.

-   **Super Small** The alpine-turnout code is only 2.00 kB (gzip: 0.94 kB)

-   **SEO Proof:** All your content gets indexed by the popular search engines like `Google`, `DuckDuckGo` etc.
    
----------

## Installation

### Via CDN

Include the script before Alpine.js:

```html
<script src="https://unpkg.com/alpine-turnout" defer></script>
<script src="https://unpkg.com/alpinejs" defer></script>

```

### Via NPM

Install Alpine Turnout:

```shell
npm install alpine-turnout

```

[Initialize](https://alpinejs.dev/essentials/installation#as-a-module) AlpineJS and Alpine Turnout as a module within your code:

```js
import Alpine from 'alpinejs';
import 'alpine-turnout'; // This auto-registers the $store.turnout

window.Alpine = Alpine;
Alpine.start();
```

Then launch your dev environment with `vite`:

```bash
npx vite
```


Or if you prefer UMD, put this in the head of your index.html:

```html
<script src="./node_modules/alpine-turnout/dist/alpine-turnout.umd.js" defer></script>
<script src="./node_modules/alpinejs/dist/cdn.min.js" defer></script>
```
----------

## Usage

### 1. Define your Routes

Create a `nice` layout in `html`. Then use the `x-route` and `x-title` directives:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Alpine Turnout</title>
    <script src="//unpkg.com/alpine-turnout" defer></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    <link rel="stylesheet" href="//unpkg.com/@picocss/pico">
</head>
<body class="container" x-data="{}">

    <h1 x-data x-text="$store.turnout.title"></h1>

    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/user/john">Profile</a></li>
            <li><a href="/search">Search</a></li>
        </ul>
    </nav>

    <article>
        <div x-route="/" x-title="Welcome Home" x-transition>
            <p>This is the homepage.</p>
        </div>

        <div x-route="/user/:name" x-title="User Profile" x-transition>
            <p>Hello, <strong x-text="name"></strong>!</p>
        </div>

        <div x-route="/search" x-title="Search" x-transition>
            <div x-data="{ query: '' }">
                <input type="text" x-model="query" placeholder="Type here...">
                <p>Your input is preserved even if you switch tabs!</p>
            </div>
        </div>
    </article>

</body>
</html>
```

[Go Here](https://alpine-turnout.netlify.app) for a more extensive live example!

[Go Here](https://github.com/rodezee/alpine-turnout/tree/main/examples) and check out our `/examples/*` directory for more. 

### 2. Navigation

Turnout automatically intercepts any internal `<a href="/user/john">Visit John</a>` links. You can also navigate programmatically:

```html
<button @click="$store.turnout.go('/user/john')">Visit John</button>

```

----------

## How it Works

When you define an `x-route`, Alpine Turnout does three things:

1.  **Registers the path:** Adds the pattern to a global registry.
    
2.  **Injects Scope:** Makes route parameters (like `:name`) available directly to the HTML inside that div.
    
3.  **Manages Visibility:** Uses `x-show` logic under the hood. When the URL matches, the track becomes visible; otherwise, it is hidden with `display: none`.
    
----------

## API Reference

### Global Store: `$store.turnout`

Property | Type | Description
 --- | --- | ---
`path` | `String` | The current URL pathname.
`title` | `String` | The value of `x-title` for the active route.
`notFound` | `Boolean` | True if the current path matches no registered routes.
`go(path)` | `Function` | Programmatically navigate to a new track.

### Directive: `x-route`

Used on a `div` or `section` to define a track.

-   **Static Routes:** `x-route="/about"`
    
-   **Dynamic Routes:** `x-route="/post/:id"` (makes `id` available in local scope).
    
-   **Wildcard (Custom 404):** `x-route="*"`
    
----------

## Default 404 Behavior

If no `x-route="*"` is found and the user hits an unregistered path, Turnout automatically injects a "Dead End" 404 section into your `main` element to prevent a blank screen.

----------

## Transitions

Because Turnout uses Alpine's visibility toggling, you can use standard transitions. Note that we recommend setting a `leave.duration.0ms` if you want the "old" page to disappear instantly while the new one fades in.

```html
<div x-route="/fast" 
     x-transition.duration.500ms 
     x-transition:leave.duration.0ms>
    ...
</div>

```

----------

## Comparison with alpine-router(s)

Subject | alpine-router(s) | **alpine-turnout**
 --- | --- | ---
**DOM Logic** | Destroys/Creates | Hides/Shows (**Persistent**)
**State** | Reset on nav | Preserved (Forms/Input)
**Performance** | Lower Memory | Faster Switching
**Best For** | Massive apps | One-pagers & Dashboards

----------

## SEO Proof

Most modern routers (React Router, Vue Router) are "empty" until JavaScript runs. Bots often see a blank page on the first pass.  

Alpine Turnout’s Edge: Since all your "tracks" (the divs with x-route) are physically present in your HTML file, a crawler like Googlebot sees all your content immediately when it reads the source code.  

The Result: Your internal pages are indexed much more easily than with a standard SPA.  

----------

## 🚀 Deployment

Since this is a Single Page Application (SPA) using the `History API`, your web server should be configured to serve `index.html` for all requests that don't match a static file.

### Example for Nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

```

### Example for Netlify:

Simply include a file named `netlify.toml` in the publish directory of your repository:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

```

----------

## ⚖️ License

MIT © [github.com/rodezee/alpine-switch](github.com/rodezee/alpine-switch)

