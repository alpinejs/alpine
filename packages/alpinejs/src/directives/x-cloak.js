import { directive, prefix } from '../directives.js'
import { mutateDom } from '../mutation.js'

directive('cloak', el => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix('cloak')))))
