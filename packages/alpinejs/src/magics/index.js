import { warn } from '../utils/warn'
import { magic } from '../magics'

import './$useState'
import './$nextTick'
import './$dispatch'
import './$watch'
import './$store'
import './$data'
import './$root'
import './$refs'
import './$id'
import './$el'

// Register warnings for people using plugin syntaxes and not loading the plugin itself:
warnMissingPluginMagic('Focus', 'focus', 'focus')
warnMissingPluginMagic('Persist', 'persist', 'persist')
warnMissingPluginMagic('useState()', 'useState', 'use-state')

function warnMissingPluginMagic(name, magicName, slug) {
    magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el))
}
