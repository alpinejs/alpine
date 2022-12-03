import { beEqualTo, beVisible, haveAttribute, haveFocus, haveText, html, notBeVisible, test } from '../../utils'

// Test persistant peice of layout
// Handle non-origin links and such
// Handle 404
// Middle/command click link in new tab works?
// Infinite scroll scenario, back button works
//

it.skip('navigates pages without reload',
    () => {
        cy.intercept('/first', {
            headers: { 'content-type': 'text/html' },
            body: html`
                <html>
                    <head>
                        <script src="/../../packages/navigate/dist/cdn.js" defer></script>
                        <script src="/../../packages/alpinejs/dist/cdn.js" defer></script>
                    </head>
                    <body>
                        <a href="/second">Navigate</a>

                        <h2>First Page</h2>

                        <script>
                            window.fromFirstPage = true
                        </script>
                    </body>
                </html>
        `})

        cy.intercept('/second', {
            headers: { 'content-type': 'text/html' },
            body: html`
                <html>
                    <head>
                        <script src="/../../packages/navigate/dist/cdn.js" defer></script>
                        <script src="/../../packages/alpinejs/dist/cdn.js" defer></script>
                    </head>
                    <body>
                        <h2>Second Page</h2>
                    </body>
                </html>
        `})

        cy.visit('/first')
        cy.window().its('fromFirstPage').should(beEqualTo(true))
        cy.get('h2').should(haveText('First Page'))

        cy.get('a').click()

        cy.url().should('include', '/second')
        cy.get('h2').should(haveText('Second Page'))
        cy.window().its('fromFirstPage').should(beEqualTo(true))
    },
)

it.skip('autofocuses autofocus elements',
    () => {
        cy.intercept('/first', {
            headers: { 'content-type': 'text/html' },
            body: html`
                <html>
                    <head>
                        <script src="/../../packages/navigate/dist/cdn.js" defer></script>
                        <script src="/../../packages/alpinejs/dist/cdn.js" defer></script>
                    </head>
                    <body>
                        <a href="/second">Navigate</a>
                    </body>
                </html>
        `})

        cy.intercept('/second', {
            headers: { 'content-type': 'text/html' },
            body: html`
                <html>
                    <head>
                        <script src="/../../packages/navigate/dist/cdn.js" defer></script>
                        <script src="/../../packages/alpinejs/dist/cdn.js" defer></script>
                    </head>
                    <body>
                        <input type="text" autofocus>
                    </body>
                </html>
        `})

        cy.visit('/first')

        cy.get('a').click()

        cy.url().should('include', '/second')
        cy.get('input').should(haveFocus())
    },
)

it.skip('scripts and styles are properly merged/run or skipped',
    () => {
        cy.intercept('/first', {
            headers: { 'content-type': 'text/html' },
            body: html`
                <html>
                    <head>
                        <title>First Page</title>
                        <meta name="description" content="first description">
                        <script src="/../../packages/navigate/dist/cdn.js" defer></script>
                        <script src="/../../packages/alpinejs/dist/cdn.js" defer></script>
                    </head>
                    <body>
                        <a href="/second">Navigate</a>
                    </body>
                </html>
        `})

        cy.intercept('/head-script.js', {
            headers: { 'content-type': 'text/js' },
            body: `window.fromHeadScript = true`
        })

        cy.intercept('/body-script.js', {
            headers: { 'content-type': 'text/js' },
            body: `window.fromBodyScript = true`
        })

        cy.intercept('/head-style.css', {
            headers: { 'content-type': 'text/css' },
            body: `body { background: black !important; }`
        })

        cy.intercept('/second', {
            headers: { 'content-type': 'text/html' },
            body: html`
                <html>
                    <head>
                        <title>Second Page</title>
                        <meta name="description" content="second description">
                        <script src="/../../packages/navigate/dist/cdn.js" defer></script>
                        <script src="/../../packages/alpinejs/dist/cdn.js" defer></script>
                        <script src="head-script.js" defer></script>
                        <script>window.fromHeadScriptInline = true</script>
                        <link rel="stylesheet" src="head-style.css"></script>
                    </head>
                    <body>
                        <script src="body-script.js" defer></script>
                        <script>window.fromBodyScriptInline = true</script>
                    </body>
                </html>
        `})

        cy.visit('/first')

        cy.get('a').click()

        cy.url().should('include', '/second')
        cy.title().should(beEqualTo('Second Page'))
        cy.get('meta').should(haveAttribute('name', 'description'))
        cy.get('meta').should(haveAttribute('content', 'second description'))
        cy.window().its('fromHeadScript').should(beEqualTo(true))
        cy.window().its('fromHeadScriptInline').should(beEqualTo(true))
        cy.window().its('fromBodyScript').should(beEqualTo(true))
        cy.window().its('fromBodyScriptInline').should(beEqualTo(true))
    },
)
