import dialog from './dialog'
import popover from './popover'
import notSwitch from './switch'
import tabs from './tabs'

export default function (Alpine) {
    dialog(Alpine)
    popover(Alpine)
    notSwitch(Alpine)
    tabs(Alpine)
}
