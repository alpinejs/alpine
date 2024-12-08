---
order: 10
prefix: $
title: useState
---

# $useState

`$useState` is a magic function that allows you to read and set data in variables.

```alpine
<div x-data="{ title: $useState('Hello') }">
    <button
        @click="title.setState('Hello World!')"
        x-text="title.state"
    ></button>
</div>
```

In the example above, the default value of `title` is set using `$useState('Hello')`. The variable is updated with `title.setState('Hello World!')`, and its value is accessed with `title.state`.

## Initial State

You can initialize the state with any value, including objects and arrays:

```alpine
<div x-data="{ user: $useState({ name: 'John', age: 30 }) }">
    <button
        @click="user.setState({ name: 'Jane', age: 25 })"
        x-text="user.state.name"
    ></button>
</div>
```

## Reactive Updates

The state is reactive, meaning any changes to the state will automatically update the DOM elements that depend on it. This reactivity extends deeply, so if you pass the state variable as a parameter and modify it within a function, the changes will propagate and update the DOM as if it were an input/output variable.

```alpine
<div x-data="{ count: $useState(0) }">
    <button
        @click="increment(count)"
        x-text="count.state"
    ></button>
</div>

<script>
    function increment(state) {
        state.setState(state.state + 1);
    }
</script>
```

In this example, the `increment` function takes the state variable `count` as a parameter and updates its value. The DOM automatically reflects the updated state.

## Accessing State

You can access the current state using the `.state` property and update it using the `.setState` method.

## Example with Array

```alpine
<div x-data="{ items: $useState(['Item 1', 'Item 2']) }">
    <button
        @click="items.setState([...items.state, 'Item 3'])"
        x-text="items.state.join(', ')"
    ></button>
</div>
```

In this example, a new item is added to the array, and the DOM updates to reflect the change.

## Benefits

### Input/Output Variables

One of the key benefits of using `$useState` is the ability to treat state variables as input/output variables. This means you can pass them around in functions and have their changes automatically propagate through the DOM, enhancing the reactivity of your application.

### Enhanced Security

Another significant advantage is that `$useState` helps in complying with Content Security Policy (CSP) guidelines. By avoiding inline scripts and using safer methods to manage state, your application becomes more secure and less vulnerable to certain types of attacks.

