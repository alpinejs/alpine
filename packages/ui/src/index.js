import combobox from './combobox.js'
import dialog from './dialog.js'
import disclosure from './disclosure.js'
import listbox from './listbox.js'
import popover from './popover.js'
import menu from './menu.js'
import notSwitch from './switch.js'
import radio from './radio.js'
import tabs from './tabs.js'

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
