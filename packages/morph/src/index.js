import { morph } from './morph'

export default function (Alpine) {
    Alpine.directive('morph', (el, { expression }, { effect, evaluateLater }) => {
        let evaluate = evaluateLater(expression)

        effect(() => {
            evaluate(value => {
                let child = el.firstElementChild || el.firstChild || el.appendChild(document.createTextNode(''))

                morph(child, value)
            })
        })
    })
}

export { morph }
