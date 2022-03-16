import { evaluateLater } from '../evaluator'
import { directive } from '../directives'

directive('modelable', (el, { value, expression }, { effect, evaluate, evaluateLater }) => {
    let func = evaluateLater(expression)
    let innerGet = () => { let result; func(i => result = i); return result; }
    let evaluateInnerSet = evaluateLater(`${expression} = __placeholder`)
    let innerSet = val => evaluateInnerSet(() => {}, { scope: { '__placeholder': val }})

    let initialValue = innerGet()

    // Allow packages like Livewire to hook into $modelable. Ex: `wire:model.defer`
    if (el._x_modelable_hook) initialValue = el._x_modelable_hook(initialValue)

    innerSet(initialValue)

    queueMicrotask(() => {
        if (! el._x_model && ! el._x_models) return

        // Remove native event listeners as these are now bound with x-modelable.
        // The reason for this is that it's often useful to wrap <input> elements
        // in x-modelable/model, but the input events from the native input
        // override any functionality added by x-modelable causing confusion.
        el._x_removeModelListeners[value || 'default']()
    
        let outerGet = value ? el._x_models[value].get : el._x_model.get
        let outerSet = value ? el._x_models[value].set : el._x_model.set
    
        effect(() => innerSet(outerGet()))
        effect(() => outerSet(innerGet()))
    })
})
