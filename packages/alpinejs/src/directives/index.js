import { directive } from '../directives'
import { warn } from '../utils/warn'

import './x-transition'
import './x-modelable'
import './x-teleport'
import './x-ignore'
import './x-effect'
import './x-model'
import './x-cloak'
import './x-init'
import './x-text'
import './x-html'
import './x-bind'
import './x-data'
import './x-show'
import './x-for'
import './x-ref'
import './x-if'
import './x-id'
import './x-on'

// Register warnings for people using plugin syntaxes and not loading the plugin itself:
warnMissingPluginDirective('Collapse', 'collapse', 'collapse')
warnMissingPluginDirective('Intersect', 'intersect', 'intersect')
warnMissingPluginDirective('Focus', 'trap', 'focus')
warnMissingPluginDirective('Mask', 'mask', 'mask')

function warnMissingPluginDirective(name, directiveName, slug) {
    directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el))
}
