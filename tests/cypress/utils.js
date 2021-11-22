
// This is an invisible template tag for enabling syntax highlighting
// of any string in most editors.
export function html(strings) {
    return strings.raw[0]
}

export let test = function (name, template, callback, handleExpectedErrors = false) {
    it(name, () => {
        injectHtmlAndBootAlpine(cy, template, callback, undefined, handleExpectedErrors)
    })
}

test.only = (name, template, callback, handleExpectedErrors = false) => {
    it.only(name, () => {
        injectHtmlAndBootAlpine(cy, template, callback, undefined, handleExpectedErrors)
    })
}

test.retry = (count) => (name, template, callback, handleExpectedErrors = false) => {
    it(name, {
        retries: {
            // During "cypress run"
            runMode: count - 1,
            // During "cypress open"
            openMode: count - 1,
        }
    }, () => {
        injectHtmlAndBootAlpine(cy, template, callback, undefined, handleExpectedErrors)
    })
}

test.csp = (name, template, callback, handleExpectedErrors = false) => {
    it(name, () => {
        injectHtmlAndBootAlpine(cy, template, callback, __dirname+'/spec-csp.html', handleExpectedErrors)
    })
}

function injectHtmlAndBootAlpine(cy, templateAndPotentiallyScripts, callback, page, handleExpectedErrors = false) {
    let [template, scripts] = Array.isArray(templateAndPotentiallyScripts)
        ? templateAndPotentiallyScripts
        : [templateAndPotentiallyScripts]

    cy.visit(page || __dirname+'/spec.html')

    if( handleExpectedErrors ) {
        cy.on( 'uncaught:exception', ( error ) => {
            if( error.el === undefined && error.expression === undefined ) {
                console.warn( 'Expected all errors originating from Alpine to have el and expression.  Letting cypress fail the test.', error )
                return true
            }
            return false
        } );
    }

    cy.get('#root').then(([el]) => {
        el.innerHTML = template

        el.evalScripts(scripts)

        cy.get('[alpine-is-ready]', { timeout: 5000 }).should('be.visible');

        // We can't just simply reload a page from a test, because we need to
        // re-inject all the templates and such. This is a helper to allow
        // a test-subject method to perform a redirect all on their own.
        let reload = () => {
            cy.reload()

            cy.get('#root').then(([el]) => {
                el.innerHTML = template

                el.evalScripts(scripts)

                cy.get('[alpine-is-ready]', { timeout: 5000 }).should('be.visible');
            })
        }

        cy.window().then(window => {
            callback(cy, reload, window, window.document)
        }) 
    })
}

export let haveData = (key, value) => ([ el ]) => expect(root(el)._x_dataStack[0][key]).to.equal(value)

export let haveFocus = () => el => expect(el).to.have.focus

export let notHaveFocus = () => el => expect(el).not.to.be.focused

export let haveAttribute = (name, value) => el => expect(el).to.have.attr(name, value)

export let notHaveAttribute = (name, value) => el => expect(el).not.to.have.attr(name, value)

export let haveText = text => el => expect(el).to.have.text(text)

export let notHaveText = text => el => expect(el).not.to.have.text(text)

export let beChecked = () => el => expect(el).to.be.checked

export let notBeChecked = () => el => expect(el).not.to.be.checked

export let beVisible = () => el => expect(el).to.be.visible

export let notBeVisible = () => el => expect(el).not.to.be.visible

export let beHidden = () => el => expect(el).to.be.hidden

export let haveClasses = classes => el => classes.forEach(aClass => expect(el).to.have.class(aClass))

export let notHaveClasses = classes => el => classes.forEach(aClass => expect(el).not.to.have.class(aClass))

export let haveValue = value => el => expect(el).to.have.value(value)

export let haveLength = length => el => expect(el).to.have.length(length)

export let beEqualTo = value => el => expect(el).to.eq(value)

export let notHaveComputedStyle = (name, value) => el => {
    const win = el[0].ownerDocument.defaultView
    expect(win.getComputedStyle(el[0]).getPropertyValue(name)).not.to.eq(value)
}

export let haveComputedStyle = (name, value) => el => {
    const win = el[0].ownerDocument.defaultView
    expect(win.getComputedStyle(el[0]).getPropertyValue(name)).to.eq(value)
}

export function root(el) {
    if (el._x_dataStack) return el

    if (! el.parentElement) return

    return closestRoot(el.parentElement)
}
