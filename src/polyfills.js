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

// .childElementCount polyfill
// from https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/childElementCount#Polyfill_for_IE8_IE9_Safari
;(function(constructor) {
    if (constructor &&
        constructor.prototype &&
        constructor.prototype.childElementCount == null) {
        Object.defineProperty(constructor.prototype, 'childElementCount', {
            get: function() {
                var i = 0, count = 0, node, nodes = this.childNodes;
                while (node = nodes[i++]) {
                    if (node.nodeType === 1) count++;
                }
                return count;
            }
        });
    }
})(window.Node || window.Element);
