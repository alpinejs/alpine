import combobox from './combobox'
import dialog from './dialog'
import disclosure from './disclosure'
import listbox from './listbox'
import popover from './popover'
import menu from './menu'
import notSwitch from './switch'
import radio from './radio'
import tabs from './tabs'

export default function (Alpine) {
    combobox(Alpine)
    dialog(Alpine)
    disclosure(Alpine)
    listbox(Alpine)
    menu(Alpine)
    notSwitch(Alpine)
    popover(Alpine)
    radio(Alpine)
    tabs(Alpine)
}
