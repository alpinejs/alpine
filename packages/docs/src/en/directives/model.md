---
order: 7
title: model
---

# x-model

`x-model` allows you to bind the value of an input element to Alpine data.

Here's a simple example of using `x-model` to bind the value of a text field to a piece of data in Alpine.

```alpine
<div x-data="{ message: '' }">
    <input type="text" x-model="message">

    <span x-text="message"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: '' }">
        <input type="text" x-model="message" placeholder="Type message...">

        <div class="pt-4" x-text="message"></div>
    </div>
</div>
<!-- END_VERBATIM -->


Now as the user types into the text field, the `message` will be reflected in the `<span>` tag.

`x-model` is two-way bound, meaning it both "sets" and "gets". In addition to changing data, if the data itself changes, the element will reflect the change.


We can use the same example as above but this time, we'll add a button to change the value of the `message` property.

```alpine
<div x-data="{ message: '' }">
    <input type="text" x-model="message">

    <button x-on:click="message = 'changed'">Change Message</button>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: '' }">
        <input type="text" x-model="message" placeholder="Type message...">

        <button x-on:click="message = 'changed'">Change Message</button>
    </div>
</div>
<!-- END_VERBATIM -->

Now when the `<button>` is clicked, the input element's value will instantly be updated to "changed".

`x-model` works with the following input elements:

* `<input type="text">`
* `<textarea>`
* `<input type="checkbox">`
* `<input type="radio">`
* `<select>`
* `<input type="range">`

<a name="text-inputs"></a>
## Text inputs

```alpine
<input type="text" x-model="message">

<span x-text="message"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: '' }">
        <input type="text" x-model="message" placeholder="Type message">

        <div class="pt-4" x-text="message"></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="textarea-inputs"></a>
## Textarea inputs

```alpine
<textarea x-model="message"></textarea>

<span x-text="message"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ message: '' }">
        <textarea x-model="message" placeholder="Type message"></textarea>

        <div class="pt-4" x-text="message"></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="checkbox-inputs"></a>
## Checkbox inputs

<a name="single-checkbox-with-boolean"></a>
### Single checkbox with boolean

```alpine
<input type="checkbox" id="checkbox" x-model="show">

<label for="checkbox" x-text="show"></label>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ open: '' }">
        <input type="checkbox" id="checkbox" x-model="open">

        <label for="checkbox" x-text="open"></label>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="multiple-checkboxes-bound-to-array"></a>
### Multiple checkboxes bound to array

```alpine
<input type="checkbox" value="red" x-model="colors">
<input type="checkbox" value="orange" x-model="colors">
<input type="checkbox" value="yellow" x-model="colors">

Colors: <span x-text="colors"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ colors: [] }">
        <input type="checkbox" value="red" x-model="colors">
        <input type="checkbox" value="orange" x-model="colors">
        <input type="checkbox" value="yellow" x-model="colors">

        <div class="pt-4">Colors: <span x-text="colors"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="radio-inputs"></a>
## Radio inputs

```alpine
<input type="radio" value="yes" x-model="answer">
<input type="radio" value="no" x-model="answer">

Answer: <span x-text="answer"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ answer: '' }">
        <input type="radio" value="yes" x-model="answer">
        <input type="radio" value="no" x-model="answer">

        <div class="pt-4">Answer: <span x-text="answer"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="select-inputs"></a>
## Select inputs


<a name="single-select"></a>
### Single select

```alpine
<select x-model="color">
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Color: <span x-text="color"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ color: '' }">
        <select x-model="color">
            <option>Red</option>
            <option>Orange</option>
            <option>Yellow</option>
        </select>

        <div class="pt-4">Color: <span x-text="color"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="single-select-with-placeholder"></a>
### Single select with placeholder

```alpine
<select x-model="color">
    <option value="" disabled>Select A Color</option>
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Color: <span x-text="color"></span>
```


<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ color: '' }">
        <select x-model="color">
            <option value="" disabled>Select A Color</option>
            <option>Red</option>
            <option>Orange</option>
            <option>Yellow</option>
        </select>

        <div class="pt-4">Color: <span x-text="color"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="multiple-select"></a>
### Multiple select

```alpine
<select x-model="color" multiple>
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Colors: <span x-text="color"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ color: '' }">
        <select x-model="color" multiple>
            <option>Red</option>
            <option>Orange</option>
            <option>Yellow</option>
        </select>

        <div class="pt-4">Color: <span x-text="color"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="dynamically-populated-select-options"></a>
### Dynamically populated Select Options

```alpine
<select x-model="color">
    <template x-for="color in ['Red', 'Orange', 'Yellow']">
        <option x-text="color"></option>
    </template>
</select>

Color: <span x-text="color"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ color: '' }">
        <select x-model="color">
            <template x-for="color in ['Red', 'Orange', 'Yellow']">
                <option x-text="color"></option>
            </template>
        </select>

        <div class="pt-4">Color: <span x-text="color"></span></div>
    </div>
</div>
<!-- END_VERBATIM -->

<a name="range-inputs"></a>
## Range inputs

```alpine
<input type="range" x-model="range" min="0" max="1" step="0.1">

<span x-text="range"></span>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ range: 0.5 }">
        <input type="range" x-model="range" min="0" max="1" step="0.1">

        <div class="pt-4" x-text="range"></div>
    </div>
</div>
<!-- END_VERBATIM -->


<a name="modifiers"></a>
## Modifiers

<a name="lazy"></a>
### `.lazy`

On text inputs, by default, `x-model` updates the property on every keystroke. By adding the `.lazy` modifier, you can force an `x-model` input to only update the property when user focuses away from the input element.

This is handy for things like real-time form-validation where you might not want to show an input validation error until the user "tabs" away from a field.

```alpine
<input type="text" x-model.lazy="username">
<span x-show="username.length > 20">The username is too long.</span>
```

<a name="number"></a>
### `.number`

By default, any data stored in a property via `x-model` is stored as a string. To force Alpine to store the value as a JavaScript number, add the `.number` modifier.

```alpine
<input type="text" x-model.number="age">
<span x-text="typeof age"></span>
```

<a name="boolean"></a>
### `.boolean`

By default, any data stored in a property via `x-model` is stored as a string. To force Alpine to store the value as a JavaScript boolean, add the `.boolean` modifier. Both integers (1/0) and strings (true/false) are valid boolean values.

```alpine
<select x-model.boolean="isActive">
    <option value="true">Yes</option>
    <option value="false">No</option>
</select>
<span x-text="typeof isActive"></span>
```

<a name="debounce"></a>
### `.debounce`

By adding `.debounce` to `x-model`, you can easily debounce the updating of bound input.

This is useful for things like real-time search inputs that fetch new data from the server every time the search property changes.

```alpine
<input type="text" x-model.debounce="search">
```

The default debounce time is 250 milliseconds, you can easily customize this by adding a time modifier like so.

```alpine
<input type="text" x-model.debounce.500ms="search">
```

<a name="throttle"></a>
### `.throttle`

Similar to `.debounce` you can limit the property update triggered by `x-model` to only updating on a specified interval.

<input type="text" x-model.throttle="search">

The default throttle interval is 250 milliseconds, you can easily customize this by adding a time modifier like so.

```alpine
<input type="text" x-model.throttle.500ms="search">
```

<a name="fill"></a>
### `.fill`

By default, if an input has a value attribute, it is ignored by Alpine and instead, the value of the input is set to the value of the property bound using `x-model`.

But if a bound property is empty, then you can use an input's value attribute to populate the property by adding the `.fill` modifier.

<div x-data="{ message: null }">
  <input x-model.fill="message" value="This is the default message.">
</div>

<a name="programmatic access"></a>
## Programmatic access

Alpine exposes under-the-hood utilities for getting and setting properties bound with `x-model`. This is useful for complex Alpine utilities that may want to override the default x-model behavior, or instances where you want to allow `x-model` on a non-input element.

You can access these utilities through a property called `_x_model` on the `x-model`ed element. `_x_model` has two methods to get and set the bound property:

* `el._x_model.get()` (returns the value of the bound property)
* `el._x_model.set()` (sets the value of the bound property)

```alpine
<div x-data="{ username: 'calebporzio' }">
    <div x-ref="div" x-model="username"></div>

    <button @click="$refs.div._x_model.set('phantomatrix')">
        Change username to: 'phantomatrix'
    </button>

    <span x-text="$refs.div._x_model.get()"></span>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
    <div x-data="{ username: 'calebporzio' }">
        <div x-ref="div" x-model="username"></div>

        <button @click="$refs.div._x_model.set('phantomatrix')">
            Change username to: 'phantomatrix'
        </button>

        <span x-text="$refs.div._x_model.get()"></span>
    </div>
</div>
<!-- END_VERBATIM -->
