import { closestDataStack, mergeProxies } from '../scope'
import { magic } from '../magics'

magic('data', el => {
    return mergeProxies(closestDataStack(el))
})
