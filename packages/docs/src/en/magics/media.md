---
order: 10
prefix: $
title: media
---

# $media

`$media` is a magic function that returns whether a media query currently matches. Its value is reactive, so Alpine expressions that use it update when the result changes.

```alpine
<div x-show="$media('(min-width: 768px)')">
    This content is visible on wider screens.
</div>
```

`$media` accepts any query supported by [`window.matchMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia).

<a name="user-preferences"></a>
## Responding to user preferences

Media queries can also respond to operating system and browser preferences:

```alpine
<div x-data>
    <p x-show="$media('(prefers-reduced-motion: reduce)')">
        Animations are reduced.
    </p>

    <p x-show="$media('(prefers-color-scheme: dark)')">
        Dark color scheme is active.
    </p>
</div>
```

Alpine shares the underlying media query listener when the same query is used by multiple elements and removes the listener when it is no longer needed.
