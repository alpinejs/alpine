import { evaluateLater } from '../evaluator'
import { directive } from '../directives'

directive('modelable', (el, { expression }, { effect, evaluate, evaluateLater }) => {
    let func = evaluateLater(expression)
    let innerGet = () => { let result; func(i => result = i); return result; }
    let evaluateInnerSet = evaluateLater(`${expression} = __placeholder`)
    let innerSet = val => evaluateInnerSet(() => {}, { scope: { '__placeholder': val }})

    let initialValue = innerGet()

    // Allow packages like Livewire to hook into $modelable. Ex: `wire:model.defer`
    if (el._x_modelable_hook) initialValue = el._x_modelable_hook(initialValue)

    innerSet(initialValue)

    queueMicrotask(() => {
        if (! el._x_model) return
    
        let outerGet = el._x_model.get
        let outerSet = el._x_model.set
    
        effect(() => innerSet(outerGet()))
        effect(() => outerSet(innerGet()))
    })
})
