import { directive } from "../directives"
import { setIdRoot } from '../ids'

directive('id', (el, { expression }, { evaluate }) => {
    let names = evaluate(expression)
    
    names.forEach(name => setIdRoot(el, name))
})
