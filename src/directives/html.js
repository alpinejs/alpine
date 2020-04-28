export function handleHtmlDirective(component, el, modifiers, expression, extraVars, initialUpdate = false) {
    if (modifiers.includes('once') && !initialUpdate) {
        return;
    }

    el.innerHTML = component.evaluateReturnExpression(el, expression, extraVars)
}
