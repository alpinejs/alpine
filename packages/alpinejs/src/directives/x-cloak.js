import { directive, prefix } from '../directives'
import { mutateDom } from '../mutation'

directive('cloak', el => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix('cloak')))))
