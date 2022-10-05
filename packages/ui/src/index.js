import dialog from './dialog'
import popover from './popover'
import radioGroup from './radio-group'
import tabs from './tabs'

export default function (Alpine) {
    dialog(Alpine)
    popover(Alpine)
    radioGroup(Alpine)
    tabs(Alpine)
}
