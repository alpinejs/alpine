## Project X

### Install
`<script src="https://cdn.jsdelivr.net/gh/calebporzio/project-x/dist/project-x.min.js"></script>`

### Use
*Dropdown/Modal*
```
<div x-data="{ hide: true }">
    <button x-on:click="$data.hide = false">...</button>

    <ul class="hidden" x-bind:class="{ 'hidden': $data.hide }" :click.away="$data.hide = true">
        ...
    </ul>
</div>
```

*Tabs*
```
<div x-data="{ currentTab: 'foo' }">
    <button x-bind:class="{ 'active': currentTab === 'foo' }" x-on:click="currentTab = 'foo'">Foo</button>
    <button x-bind:class="{ 'active': currentTab === 'bar' }" x-on:click="currentTab = 'bar'">Bar</button>

    <div class="hidden" x-bind:class="{ 'hidden': currentTab !== 'foo' }">Tab Foo</div>
    <div class="hidden" x-bind:class="{ 'hidden': currentTab !== 'bar' }">Tab Bar</div>
</div>
```

### Directives

--- | ---
`x-data="[object]"` | This is what denotes a new component, the data declared inside this object is read, manipulated, and reacted to by other directives in the component.
`x-bind:[attrbute]="[expression]"` | The attribute referenced by `x-bind` will be set the result of the JS expression passed in. It will automatically refresh if data it depends on changes.
`x-on:[event]="[expression]"` | The element will be listening for the specified event, and fire the expression when it happens
