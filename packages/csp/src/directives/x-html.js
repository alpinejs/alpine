import { directive } from 'alpinejs/src/directives'

directive('html', () => {
    throw new Error('Using the x-html directive is prohibited')
})
