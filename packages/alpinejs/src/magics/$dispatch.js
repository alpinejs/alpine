import { dispatch } from '../utils/dispatch'
import { magic } from '../magics'

magic('dispatch', el => dispatch.bind(dispatch, el))
