(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/component.js":
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Component; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Component =
/*#__PURE__*/
function () {
  function Component(el) {
    _classCallCheck(this, Component);

    this.el = el;
    this.data = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["saferEval"])(this.el.getAttribute('x-data'), {});
    this.concernedData = [];
    this.registerListeners();
    this.updateAllBoundAttributes();
  }

  _createClass(Component, [{
    key: "registerListeners",
    value: function registerListeners() {
      var _this = this;

      Object(_utils__WEBPACK_IMPORTED_MODULE_0__["walk"])(this.el, function (el) {
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getXAttrs"])(el, 'on').forEach(function (_ref) {
          var type = _ref.type,
              value = _ref.value,
              modifiers = _ref.modifiers,
              expression = _ref.expression;

          if (modifiers.includes('away')) {
            // Listen for this event at the root level.
            document.addEventListener(value, function (e) {
              var _this$concernedData;

              // Don't do anything if the click came form the element or within it.
              if (el.contains(e.target)) return; // Don't do anything if this element isn't currently visible.

              if (el.offsetWidth < 1 && el.offsetHeight < 1) return; // Now that we are sure the element is visible, AND the click
              // is from outside it, let's run the expression.

              (_this$concernedData = _this.concernedData).push.apply(_this$concernedData, _toConsumableArray(_this.evaluateExpressionWithEvent(expression, e)));

              _this.concernedData = _this.concernedData.filter(_utils__WEBPACK_IMPORTED_MODULE_0__["onlyUnique"]);

              _this.updateBoundAttributes();
            });
          } else {
            el.addEventListener(value, function (e) {
              var _this$concernedData2;

              (_this$concernedData2 = _this.concernedData).push.apply(_this$concernedData2, _toConsumableArray(_this.evaluateExpressionWithEvent(expression, e)));

              _this.concernedData = _this.concernedData.filter(_utils__WEBPACK_IMPORTED_MODULE_0__["onlyUnique"]);

              _this.updateBoundAttributes();
            });
          }
        });
      });
    }
  }, {
    key: "evaluateExpressionWithEvent",
    value: function evaluateExpressionWithEvent(expression, event) {
      var mutatedDataItems = []; // Detect if the listener action mutated some data,
      // this way we can selectively update bindings.

      var proxiedData = new Proxy(this.data, {
        set: function set(obj, property, value) {
          var setWasSuccessful = Reflect.set(obj, property, value);
          mutatedDataItems.push(property);
          return setWasSuccessful;
        }
      });
      Object(_utils__WEBPACK_IMPORTED_MODULE_0__["saferEvalNoReturn"])(expression, proxiedData, {
        '$event': event
      });
      return mutatedDataItems;
    }
  }, {
    key: "eventsThisComponentIsListeningFor",
    value: function eventsThisComponentIsListeningFor() {
      var eventsToListenFor = [];
      Object(_utils__WEBPACK_IMPORTED_MODULE_0__["walk"])(this.el, function (el) {
        eventsToListenFor = eventsToListenFor.concat(Array.from(el.attributes).map(function (i) {
          return i.name;
        }).filter(function (i) {
          return i.search('x-on') > -1;
        }).map(function (i) {
          return i.replace(/x-on:/, '');
        }));
      });
      return eventsToListenFor.filter(_utils__WEBPACK_IMPORTED_MODULE_0__["onlyUnique"]);
    }
  }, {
    key: "updateBoundAttributes",
    value: function updateBoundAttributes() {
      var self = this;
      Object(_utils__WEBPACK_IMPORTED_MODULE_0__["debounce"])(_utils__WEBPACK_IMPORTED_MODULE_0__["walk"], 5)(this.el, function (el) {
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getXAttrs"])(el, 'bind').concat(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getXAttrs"])(el, 'text')).forEach(function (_ref2) {
          var type = _ref2.type,
              value = _ref2.value,
              modifiers = _ref2.modifiers,
              expression = _ref2.expression;
          var isConscernedWith = [];
          var proxiedData = new Proxy(self.data, {
            get: function get(object, prop) {
              isConscernedWith.push(prop);
              return object[prop];
            }
          });
          var result = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["saferEval"])(expression, proxiedData);

          if (self.concernedData.filter(function (i) {
            return isConscernedWith.includes(i);
          }).length > 0) {
            self.updateBoundAttributeValue(el, type, value, result);
          }
        });
      });
    }
  }, {
    key: "updateAllBoundAttributes",
    value: function updateAllBoundAttributes() {
      var _this2 = this;

      Object(_utils__WEBPACK_IMPORTED_MODULE_0__["walk"])(this.el, function (el) {
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getXAttrs"])(el, 'bind').concat(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getXAttrs"])(el, 'text')).forEach(function (_ref3) {
          var type = _ref3.type,
              value = _ref3.value,
              modifiers = _ref3.modifiers,
              expression = _ref3.expression;
          var isConscernedWith = [];
          var proxiedData = new Proxy(_this2.data, {
            get: function get(object, prop) {
              isConscernedWith.push(prop);
              return object[prop];
            }
          });
          var result = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["saferEval"])(expression, proxiedData);

          _this2.updateBoundAttributeValue(el, type, value, result);
        });
      });
    }
  }, {
    key: "updateBoundAttributeValue",
    value: function updateBoundAttributeValue(el, type, attrName, value) {
      if (type === 'text') {
        el.innerText = value;
      } else if (attrName === 'class') {
        // Use the class object syntax that vue uses to toggle them.
        Object.keys(value).forEach(function (className) {
          if (value[className]) {
            el.classList.add(className);
          } else {
            el.classList.remove(className);
          }
        });
      } else if (['disabled', 'readonly', 'required', 'checked'].includes(attrName)) {
        // Boolean attributes have to be explicitly added and removed, not just set.
        if (!!value) {
          el.setAttribute(attrName, '');
        } else {
          el.removeAttribute(attrName);
        }
      } else {
        el.setAttribute(attrName, value);
      }
    }
  }]);

  return Component;
}();



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./src/component.js");
/* @flow */

var minimal = {
  start: function start() {
    var rootEls = document.querySelectorAll('[x-data]');
    rootEls.forEach(function (rootEl) {
      window.component = new _component__WEBPACK_IMPORTED_MODULE_0__["default"](rootEl);
    });
  }
};

if (!window.minimal) {
  window.minimal = minimal;
}

/* harmony default export */ __webpack_exports__["default"] = (minimal);

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: walk, debounce, onlyUnique, saferEval, saferEvalNoReturn, isXAttr, getXAttrs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "walk", function() { return walk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onlyUnique", function() { return onlyUnique; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saferEval", function() { return saferEval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saferEvalNoReturn", function() { return saferEvalNoReturn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isXAttr", function() { return isXAttr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getXAttrs", function() { return getXAttrs; });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function walk(el, callback) {
  callback(el);
  var node = el.firstElementChild;

  while (node) {
    walk(node, callback);
    node = node.nextElementSibling;
  }
}
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
;
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function saferEval(expression, dataContext) {
  var additionalHelperVariables = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Function(['$data'].concat(_toConsumableArray(Object.keys(additionalHelperVariables))), "var result; with($data) { result = ".concat(expression, " }; return result")).apply(void 0, [dataContext].concat(_toConsumableArray(Object.values(additionalHelperVariables))));
}
function saferEvalNoReturn(expression, dataContext) {
  var additionalHelperVariables = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Function(['$data'].concat(_toConsumableArray(Object.keys(additionalHelperVariables))), "with($data) { ".concat(expression, " }")).apply(void 0, [dataContext].concat(_toConsumableArray(Object.values(additionalHelperVariables))));
}
function isXAttr(attr) {
  var xAttrRE = /x-(on|bind|data|text)/;
  return xAttrRE.test(attr.name);
}
function getXAttrs(el, name) {
  return Array.from(el.attributes).filter(isXAttr).map(function (attr) {
    var typeMatch = attr.name.match(/x-(on|bind|data|text)/);
    var valueMatch = attr.name.match(/:([a-zA-Z\-]+)/);
    var modifiers = attr.name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map(function (i) {
        return i.replace('.', '');
      }),
      expression: attr.value
    };
  }).filter(function (i) {
    return i.type === name;
  });
}

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/calebporzio/Documents/Code/sites/minimal/src/index.js */"./src/index.js");


/***/ })

/******/ });
});