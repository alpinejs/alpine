import helpers from './helpers';

import dialog from './dialog'
import disclosure from './disclosure'
import listbox from './listbox'
import popover from './popover'
import notSwitch from './switch'
import tabs from './tabs'

export default function (Alpine) {
    helpers(Alpine)
    dialog(Alpine)
    disclosure(Alpine)
    listbox(Alpine)
    popover(Alpine)
    notSwitch(Alpine)
    tabs(Alpine)
}
