import { dispatch } from '../utils/dispatch.js'
import { magic } from '../magics.js'

magic('dispatch', el => dispatch.bind(dispatch, el))
