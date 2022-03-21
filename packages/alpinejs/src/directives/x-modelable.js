import { directive } from '../directives'

directive('modelable', (el, { expression }, { effect, evaluateLater }) => {
    let func = evaluateLater(expression)
    let innerGet = () => { let result; func(i => result = i); return result; }
    let evaluateInnerSet = evaluateLater(`${expression} = __placeholder`)
    let innerSet = val => evaluateInnerSet(() => {}, { scope: { '__placeholder': val }})

    let initialValue = innerGet()

    innerSet(initialValue)

    queueMicrotask(() => {
        if (! el._x_model) return

        // Remove native event listeners as these are now bound with x-modelable.
        // The reason for this is that it's often useful to wrap <input> elements
        // in x-modelable/model, but the input events from the native input
        // override any functionality added by x-modelable causing confusion.
        el._x_removeModelListeners['default']()
    
        let outerGet = el._x_model.get
        let outerSet = el._x_model.set
    
        effect(() => innerSet(outerGet()))
        effect(() => outerSet(innerGet()))
    })
})
