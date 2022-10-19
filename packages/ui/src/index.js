import dialog from './dialog'
import disclosure from './disclosure'
import menu from './menu'
import notSwitch from './switch'
import popover from './popover'
import radio from './radio'
import tabs from './tabs'

export default function (Alpine) {
    dialog(Alpine)
    disclosure(Alpine)
    menu(Alpine)
    notSwitch(Alpine)
    popover(Alpine)
    radio(Alpine)
    tabs(Alpine)
}
