import dialog from './dialog'
import disclosure from './disclosure'
import popover from './popover'
import tabs from './tabs'

export default function (Alpine) {
    dialog(Alpine)
    disclosure(Alpine)
    popover(Alpine)
    tabs(Alpine)
}
