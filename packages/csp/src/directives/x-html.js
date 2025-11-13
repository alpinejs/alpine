import { directive } from 'alpinejs/src/directives'
import { warn } from 'alpinejs/src/utils/warn'

directive('html', () => {
    warn('x-html directive is not supported in the CSP build')
})
