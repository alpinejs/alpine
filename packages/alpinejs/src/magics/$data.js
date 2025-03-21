import { scope } from '../scope.js'
import { magic } from '../magics.js'

magic('data', el => scope(el))
