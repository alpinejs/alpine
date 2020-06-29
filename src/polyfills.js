// For the IE11 build.
import "shim-selected-options"
import "proxy-polyfill/proxy.min.js"
import "element-closest/browser.js"
import "element-remove"
import "classlist-polyfill"
import "@webcomponents/template"
import "events-polyfill/src/constructors/CustomEvent"
import "events-polyfill/src/ListenerOptions"

SVGElement.prototype.contains = SVGElement.prototype.contains || HTMLElement.prototype.contains
