import { findClosest } from '../lifecycle'
import { magic } from '../magics'

magic('model', el => {
    let root = findClosestModel(el)
    
    if (! root) return
    
    return root._x_model.get()
}, (value, el) => {
    let root = findClosestModel(el)
    
    if (!root) return
    
    return root._x_model.set(value)
})

function findClosestModel(el) {
    return findClosest(el, el => '_x_model' in el)
}
