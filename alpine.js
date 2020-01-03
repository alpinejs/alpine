(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Alpine = factory());
}(this, (function () { 'use strict';

    // Thanks @stimulus:
    // https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
    function domReady() {
        return new Promise(resolve => {
            if (document.readyState == "loading") {
                document.addEventListener("DOMContentLoaded", resolve);
            } else {
                resolve();
            }
        })
    }

    function isTesting() {
        return navigator.userAgent.includes("Node.js")
            || navigator.userAgent.includes("jsdom")
    }

    function kebabCase(subject) {
        return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase()
    }

    function walkSkippingNestedComponents(el, callback, isRoot = true) {
        if (el.hasAttribute('x-data') && ! isRoot) return

        callback(el);

        let node = el.firstElementChild;

        while (node) {
            walkSkippingNestedComponents(node, callback, false);

            node = node.nextElementSibling;
        }
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    function saferEval(expression, dataContext, additionalHelperVariables = {}) {
        return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `var result; with($data) { result = ${expression} }; return result`))(
            dataContext, ...Object.values(additionalHelperVariables)
        )
    }

    function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
        return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `with($data) { ${expression} }`))(
            dataContext, ...Object.values(additionalHelperVariables)
        )
    }

    function isXAttr(attr) {
        const xAttrRE = /x-(on|bind|data|text|model|if|show|cloak|ref)/;

        return xAttrRE.test(attr.name)
    }

    function getXAttrs(el, type) {
        return Array.from(el.attributes)
            .filter(isXAttr)
            .map(attr => {
                const typeMatch = attr.name.match(/x-(on|bind|data|text|model|if|show|cloak|ref)/);
                const valueMatch = attr.name.match(/:([a-zA-Z\-]+)/);
                const modifiers = attr.name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];

                return {
                    type: typeMatch ? typeMatch[1] : null,
                    value: valueMatch ? valueMatch[1] : null,
                    modifiers: modifiers.map(i => i.replace('.', '')),
                    expression: attr.value,
                }
            })
            .filter(i => {
                // If no type is passed in for filtering, bypassfilter
                if (! type) return true

                return i.type === name
            })
    }

    class Component {
        constructor(el) {
            this.el = el;

            const rawData = saferEval(this.el.getAttribute('x-data'), {});

            rawData.$refs =  this.getRefsProxy();

            this.data = this.wrapDataInObservable(rawData);

            this.initialize();

            this.listenForNewElementsToInitialize();
        }

        wrapDataInObservable(data) {
            this.concernedData = [];

            var self = this;

            const proxyHandler = keyPrefix => ({
                set(obj, property, value) {
                    const propertyName = keyPrefix ? `${keyPrefix}.${property}` : property;

                    const setWasSuccessful = Reflect.set(obj, property, value);

                    if (self.concernedData.indexOf(propertyName) === -1) {
                        self.concernedData.push(propertyName);
                    }

                    self.refresh();

                    return setWasSuccessful
                },
                get(target, key) {
                    if (typeof target[key] === 'object' && target[key] !== null) {
                        const propertyName = keyPrefix ? `${keyPrefix}.${key}` : key;

                        return new Proxy(target[key], proxyHandler(propertyName))
                    }

                    return target[key]
                }
            });

            return new Proxy(data, proxyHandler())
        }

        initialize() {
            walkSkippingNestedComponents(this.el, el => {
                this.initializeElement(el);
            });
        }

        initializeElement(el) {
            getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
                switch (type) {
                    case 'on':
                        var event = value;
                        this.registerListener(el, event, modifiers, expression);
                        break;

                    case 'model':
                        // If the element we are binding to is a select, a radio, or checkbox
                        // we'll listen for the change event instead of the "input" event.
                        var event = (el.tagName.toLowerCase() === 'select')
                            || ['checkbox', 'radio'].includes(el.type)
                            || modifiers.includes('lazy')
                            ? 'change' : 'input';

                        const listenerExpression = this.generateExpressionForXModelListener(el, modifiers, expression);

                        this.registerListener(el, event, modifiers, listenerExpression);

                        var attrName = 'value';
                        var { output } = this.evaluateReturnExpression(expression);
                        this.updateAttributeValue(el, attrName, output);
                        break;

                    case 'bind':
                        var attrName = value;
                        var { output } = this.evaluateReturnExpression(expression);
                        this.updateAttributeValue(el, attrName, output);
                        break;

                    case 'text':
                        var { output } = this.evaluateReturnExpression(expression);
                        this.updateTextValue(el, output);
                        break;

                    case 'show':
                        var { output } = this.evaluateReturnExpression(expression);
                        this.updateVisibility(el, output);
                        break;

                    case 'if':
                        var { output } = this.evaluateReturnExpression(expression);
                        this.updatePresence(el, output);
                        break;

                    case 'cloak':
                        el.removeAttribute('x-cloak');
                        break;
                }
            });
        }

        listenForNewElementsToInitialize() {
            const targetNode = this.el;

            const observerOptions = {
                childList: true,
                attributes: true,
                subtree: true,
            };

            const observer = new MutationObserver((mutations) => {
                for (let i=0; i < mutations.length; i++){
                    // Filter out mutations triggered from child components.
                    if (! mutations[i].target.closest('[x-data]').isSameNode(this.el)) return

                    if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
                        const rawData = saferEval(mutations[i].target.getAttribute('x-data'), {});

                        Object.keys(rawData).forEach(key => {
                            if (this.data[key] !== rawData[key]) {
                                this.data[key] = rawData[key];
                            }
                        });
                    }

                    if (mutations[i].addedNodes.length > 0) {
                        mutations[i].addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return

                            if (node.matches('[x-data]')) return

                            if (getXAttrs(node).length > 0) {
                                this.initializeElement(node);
                            }
                        });
                    }
                  }
            });

            observer.observe(targetNode, observerOptions);
        }

        refresh() {
            var self = this;

            const actionByDirectiveType = {
                'model': ({el, output}) => { self.updateAttributeValue(el, 'value', output); },
                'bind': ({el, attrName, output}) => { self.updateAttributeValue(el, attrName, output); },
                'text': ({el, output}) => { self.updateTextValue(el, output); },
                'show': ({el, output}) => { self.updateVisibility(el, output); },
                'if': ({el, output}) => { self.updatePresence(el, output); },
            };

            const walkThenClearDependancyTracker = (rootEl, callback) => {
                walkSkippingNestedComponents(rootEl, callback);

                self.concernedData = [];
            };

            debounce(walkThenClearDependancyTracker, 5)(this.el, function (el) {
                getXAttrs(el).forEach(({ type, value, expression }) => {
                    if (! actionByDirectiveType[type]) return

                    var { output, deps } = self.evaluateReturnExpression(expression);

                    if (self.concernedData.filter(i => deps.includes(i)).length > 0) {
                        (actionByDirectiveType[type])({ el, attrName: value, output });
                    }
                });
            });
        }

        generateExpressionForXModelListener(el, modifiers, dataKey) {
            var rightSideOfExpression = '';
            if (el.type === 'checkbox') {
                // If the data we are binding to is an array, toggle it's value inside the array.
                if (Array.isArray(this.data[dataKey])) {
                    rightSideOfExpression = `$event.target.checked ? ${dataKey}.concat([$event.target.value]) : ${dataKey}.filter(i => i !== $event.target.value)`;
                } else {
                    rightSideOfExpression = `$event.target.checked`;
                }
            } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
                rightSideOfExpression = modifiers.includes('number')
                    ? 'Array.from($event.target.selectedOptions).map(option => { return parseFloat(option.value || option.text) })'
                    : 'Array.from($event.target.selectedOptions).map(option => { return option.value || option.text })';
            } else {
                rightSideOfExpression = modifiers.includes('number')
                    ? 'parseFloat($event.target.value)'
                    : (modifiers.includes('trim') ? '$event.target.value.trim()' : '$event.target.value');
            }

            if (el.type === 'radio') {
                // Radio buttons only work properly when they share a name attribute.
                // People might assume we take care of that for them, because
                // they already set a shared "x-model" attribute.
                if (! el.hasAttribute('name')) el.setAttribute('name', dataKey);
            }

            return `${dataKey} = ${rightSideOfExpression}`
        }

        registerListener(el, event, modifiers, expression) {
            if (modifiers.includes('away')) {
                const handler = e => {
                    // Don't do anything if the click came form the element or within it.
                    if (el.contains(e.target)) return

                    // Don't do anything if this element isn't currently visible.
                    if (el.offsetWidth < 1 && el.offsetHeight < 1) return

                    // Now that we are sure the element is visible, AND the click
                    // is from outside it, let's run the expression.
                    this.runListenerHandler(expression, e);

                    if (modifiers.includes('once')) {
                        document.removeEventListener(event, handler);
                    }
                };

                // Listen for this event at the root level.
                document.addEventListener(event, handler);
            } else {
                const listenerTarget = modifiers.includes('window')
                    ? window : (modifiers.includes('document') ? document : el);

                const handler = e => {
                    const modifiersWithoutWindowOrDocument = modifiers
                        .filter(i => i !== 'window').filter(i => i !== 'document');

                    if (event === 'keydown' && modifiersWithoutWindow.length > 0 && ! modifiersWithoutWindow.includes(kebabCase(e.key))) return

                    if (modifiers.includes('prevent')) e.preventDefault();
                    if (modifiers.includes('stop')) e.stopPropagation();

                    this.runListenerHandler(expression, e);

                    if (modifiers.includes('once')) {
                        listenerTarget.removeEventListener(event, handler);
                    }
                };

                listenerTarget.addEventListener(event, handler);
            }
        }

        runListenerHandler(expression, e) {
            this.evaluateCommandExpression(expression, {
                '$event': e,
            });
        }

        evaluateReturnExpression(expression) {
            var affectedDataKeys = [];

            const proxyHandler = prefix => ({
                get(object, prop) {
                    // Sometimes non-proxyable values are accessed. These are of type "symbol".
                    // We can ignore them.
                    if (typeof prop === 'symbol') return

                    const propertyName = prefix ? `${prefix}.${prop}` : prop;

                    // If we are accessing an object prop, we'll make this proxy recursive to build
                    // a nested dependancy key.
                    if (typeof object[prop] === 'object' && object[prop] !== null && ! Array.isArray(object[prop])) {
                        return new Proxy(object[prop], proxyHandler(propertyName))
                    }

                    affectedDataKeys.push(propertyName);

                    return object[prop]
                }
            });

            const proxiedData = new Proxy(this.data, proxyHandler());

            const result = saferEval(expression, proxiedData);

            return {
                output: result,
                deps: affectedDataKeys
            }
        }

        evaluateCommandExpression(expression, extraData) {
            saferEvalNoReturn(expression, this.data, extraData);
        }

        updateTextValue(el, value) {
            el.innerText = value;
        }

        updateVisibility(el, value) {
            if (! value) {
                el.style.display = 'none';
            } else {
                if (el.style.length === 1 && el.style.display !== '') {
                    el.removeAttribute('style');
                } else {
                    el.style.removeProperty('display');
                }
            }
        }

        updatePresence(el, expressionResult) {
            if (el.nodeName.toLowerCase() !== 'template') console.warn(`Alpine: [x-if] directive should only be added to <template> tags.`);

            const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true;

            if (expressionResult && ! elementHasAlreadyBeenAdded) {
                const clone = document.importNode(el.content, true);

                el.parentElement.insertBefore(clone, el.nextElementSibling);

                el.nextElementSibling.__x_inserted_me = true;
            } else if (! expressionResult && elementHasAlreadyBeenAdded) {
                el.nextElementSibling.remove();
            }
        }

        updateAttributeValue(el, attrName, value) {
            if (attrName === 'value') {
                if (el.type === 'radio') {
                    el.checked = el.value == value;
                } else if (el.type === 'checkbox') {
                    if (Array.isArray(value)) {
                        // I'm purposely not using Array.includes here because it's
                        // strict, and because of Numeric/String mis-casting, I
                        // want the "includes" to be "fuzzy".
                        let valueFound = false;
                        value.forEach(val => {
                            if (val == el.value) {
                                valueFound = true;
                            }
                        });

                        el.checked = valueFound;
                    } else {
                        el.checked = !! value;
                    }
                } else if (el.tagName === 'SELECT') {
                    this.updateSelect(el, value);
                } else {
                    el.value = value;
                }
            } else if (attrName === 'class') {
                if (Array.isArray(value)) {
                    el.setAttribute('class', value.join(' '));
                } else {
                    // Use the class object syntax that vue uses to toggle them.
                    Object.keys(value).forEach(classNames => {
                        if (value[classNames]) {
                            classNames.split(' ').forEach(className => el.classList.add(className));
                        } else {
                            classNames.split(' ').forEach(className => el.classList.remove(className));
                        }
                    });
                }
            } else if (['disabled', 'readonly', 'required', 'checked', 'hidden'].includes(attrName)) {
                // Boolean attributes have to be explicitly added and removed, not just set.
                if (!! value) {
                    el.setAttribute(attrName, '');
                } else {
                    el.removeAttribute(attrName);
                }
            } else {
                el.setAttribute(attrName, value);
            }
        }

        updateSelect(el, value) {
            const arrayWrappedValue = [].concat(value).map(value => { return value + '' });

            Array.from(el.options).forEach(option => {
                option.selected = arrayWrappedValue.includes(option.value || option.text);
            });
        }

        getRefsProxy() {
            var self = this;

            // One of the goals of this is to not hold elements in memory, but rather re-evaluate
            // the DOM when the system needs something from it. This way, the framework is flexible and
            // friendly to outside DOM changes from libraries like Vue/Livewire.
            // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.
            return new Proxy({}, {
                get(object, property) {
                    var ref;

                    // We can't just query the DOM because it's hard to filter out refs in
                    // nested components.
                    walkSkippingNestedComponents(self.el, el => {
                        if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
                            ref = el;
                        }
                    });

                    return ref
                }
            })
        }
    }

    const Alpine = {
        start: async function () {
            if (! isTesting()) {
                await domReady();
            }

            this.discoverComponents(el => {
                this.initializeComponent(el);
            });

            // It's easier and more performant to just support Turbolinks than listen
            // to MutationOberserver mutations at the document level.
            document.addEventListener("turbolinks:load", () => {
                this.discoverUninitializedComponents(el => {
                    this.initializeComponent(el);
                });
            });

            this.listenForNewUninitializedComponentsAtRunTime(el => {
                this.initializeComponent(el);
            });
        },

        discoverComponents: function (callback) {
            const rootEls = document.querySelectorAll('[x-data]');

            rootEls.forEach(rootEl => {
                callback(rootEl);
            });
        },

        discoverUninitializedComponents: function (callback) {
            const rootEls = document.querySelectorAll('[x-data]');

            Array.from(rootEls)
                .filter(el => el.__x === undefined)
                .forEach(rootEl => {
                    callback(rootEl);
                });
        },

        listenForNewUninitializedComponentsAtRunTime: function (callback) {
            const targetNode = document.querySelector('body');

            const observerOptions = {
                childList: true,
                attributes: true,
                subtree: true,
            };

            const observer = new MutationObserver((mutations) => {
                for (let i=0; i < mutations.length; i++){
                    if (mutations[i].addedNodes.length > 0) {
                        mutations[i].addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return

                            if (node.matches('[x-data]')) callback(node);
                        });
                    }
                  }
            });

            observer.observe(targetNode, observerOptions);
        },

        initializeComponent: function (el) {
            el.__x = new Component(el);
        }
    };

    if (! isTesting()) {
        window.Alpine = Alpine;
        window.Alpine.start();
    }

    return Alpine;

})));
