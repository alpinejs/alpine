import dialog from './dialog'
import disclosure from './disclosure'
import popover from './popover'
import notSwitch from './switch'
import tabs from './tabs'

export default function (Alpine) {
    dialog(Alpine)
    disclosure(Alpine)
    popover(Alpine)
    notSwitch(Alpine)
    tabs(Alpine)
}
