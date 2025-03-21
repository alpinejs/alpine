import { warn } from '../utils/warn.js'
import { magic } from '../magics.js'

import './$nextTick.js'
import './$dispatch.js'
import './$watch.js'
import './$store.js'
import './$data.js'
import './$root.js'
import './$refs.js'
import './$id.js'
import './$el.js'

// Register warnings for people using plugin syntaxes and not loading the plugin itself:
warnMissingPluginMagic('Focus', 'focus', 'focus')
warnMissingPluginMagic('Persist', 'persist', 'persist')

function warnMissingPluginMagic(name, magicName, slug) {
    magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el))
}
