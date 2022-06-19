---
order: 1
title: Dialog
description: ...
graph_image: https://alpinejs.dev/social_modal.jpg
---

# Dialog (Modal)

Building a modal with Alpine might appear as simple as putting `x-show` on an element styled as a modal. Unfortunately, much more goes into building a robust, accessible modal such as:

* Close on escape
* Close when you click outside the modal onto the overlay
* Trap focus within the modal when it's open
* Disable scrolling the background when modal is active
* Proper accessibility attributes

...

## A Basic Example

```alpine
<div x-data="{ open: false }">
    <button @click="open = true">Open Modal</button>

    <div x-dialog x-model="open">
        <div x-dialog:overlay></div>

        <div x-dialog:panel>
            Some modal

            <button @click="$dialog.close()">Close</button>
        </div>
    </div>
</div>
```

<!-- START_VERBATIM -->
<div class="demo">
<div x-data="{ open: false }">
    <button @click="open = true">Open Modal</button>

    <div x-dialog x-model="open" class="relative z-50">
        <div x-dialog:overlay x-transition.opacity class="fixed inset-0 bg-black bg-opacity-25"></div>

        <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
                <div x-dialog:panel x-transition class="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <h2 x-dialog:title class="text-lg">Your Title</h2>

                    <p x-dialog:description class="pt-2">Your description.</p>

                    <button @click="$dialog.close()">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
<!-- END_VERBATIM -->

## Directives

* x-dialog
* x-dialog:overlay
* x-dialog:panel
* x-dialog:title
* x-dialog:description

## Magics

* $dialog

## Props

* open
* @close
* static
* initial-focus

## Adding an overlay

## Specifying initial focus

## Controlling state without x-model

## Statically controlling

## Adding a title and description

## Accessibility Notes

## Keyboard Shortcuts

