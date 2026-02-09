import { directive } from 'alpinejs/src/directives'
import { handleError } from 'alpinejs/src/utils/error'

directive('html', (el, { expression }) => {
    handleError(new Error('Using the x-html directive is prohibited in the CSP build'), el)
})
