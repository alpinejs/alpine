import { directive } from '../directives.js'
import { warn } from '../utils/warn.js'

import './x-transition.js'
import './x-modelable.js'
import './x-teleport.js'
import './x-ignore.js'
import './x-effect.js'
import './x-model.js'
import './x-cloak.js'
import './x-init.js'
import './x-text.js'
import './x-html.js'
import './x-bind.js'
import './x-data.js'
import './x-show.js'
import './x-for.js'
import './x-ref.js'
import './x-if.js'
import './x-id.js'
import './x-on.js'

// Register warnings for people using plugin syntaxes and not loading the plugin itself:
warnMissingPluginDirective('Collapse', 'collapse', 'collapse')
warnMissingPluginDirective('Intersect', 'intersect', 'intersect')
warnMissingPluginDirective('Focus', 'trap', 'focus')
warnMissingPluginDirective('Mask', 'mask', 'mask')

function warnMissingPluginDirective(name, directiveName, slug) {
    directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el))
}
