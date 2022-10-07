import dialog from './dialog'
import popover from './popover'
import radio from './radio'
import tabs from './tabs'

export default function (Alpine) {
    dialog(Alpine)
    popover(Alpine)
    radio(Alpine)
    tabs(Alpine)
}
