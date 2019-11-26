## Minimal JS

### Install
`<script src="https://cdn.jsdelivr.net/gh/minimaljs/minimal/dist/minimal.min.js"></script>`

### Use
*Dropdown*
```
<div x-data="{ hide: true }">
    <button x-on:click="$data.hide = false">...</button>

    <ul class="hidden" x-bind:class="{ 'hidden': $data.hide }" :click="$data.hide = true">
        ...
    </ul>
</div>
```

*Modal*
```
<div x-data="{ show: true }">
    <button x-on:click="$data.show = ! $data.show">toggle</button>

    <div x-bind:class="{ 'hidden': ! $data.show }">...</div>
</div>
```

*Tabs*

You can bind expressions to any attribute using `x-bind`, and you can run expressions on any event using `x-on`.

The data is "reactive", when some data updates, only the expressions conscerned with it will.

### Goals
* Get rid of `$data.show` and just use `show`
