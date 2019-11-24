## Minimal JS

### Install
`<script src="https://cdn.jsdelivr.net/gh/minimaljs/minimal/dist/minimal.min.js"></script>`

### Use
```
<div x-data="{ show: true }">
    <button x-on:click="$data.show = ! $data.show">toggle</button>

    <div x-bind:class="{ 'hidden': ! $data.show }">...</div>
</div>
```

You can bind expressions to any attribute using `x-bind`, and you can run expressions on any event using `x-on`.

The data is "reactive", when some data updates, only the expressions conscerned with it will.

### Goals
* Get rid of `$data.show` and just use `show`
