// For the IE11 build.
import "shim-selected-options"
import "proxy-polyfill/proxy.min.js"
import "element-closest/browser.js"
import "element-remove"
import "classlist-polyfill"
import "@webcomponents/template"
import "custom-event-polyfill"

/**
 * Object.entries() polyfill
 */
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}
