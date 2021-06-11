import { closestRoot } from '../lifecycle'
import { magic } from '../magics'

magic('refs', el => closestRoot(el)._x_refs || {})
