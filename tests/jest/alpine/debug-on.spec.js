describe( 'Debug tests for Syntax Errors ( Cypress cannot cover )', () => {
    let Alpine = require('alpinejs').default
    let createElement = require('../morph/createElement.js')

    beforeEach( () => {
        console.error = jest.fn()
        jest.spyOn( window, 'addEventListener').mockImplementation((event, handler) => {
            handler()
        })
        window.Alpine = Alpine
    });

    afterEach( () => {
        jest.clearAllMocks()
        document.body.innerHTML = ""
        window.Alpine = undefined
    })

    test('When not in debug mode, ensure error is not logged to console with element', () => {
        let template = `
            <div x-data="{ foo: 'bar' }aa">
                <span x-text="foo"></span>
            </div>`

        let dom = createElement(template)
        document.body.appendChild(dom)

        try {
            window.Alpine.start()
        } catch ( _error ) {
            expect( _error.name ).toContain( "SyntaxError" )
        }

        expect(window.addEventListener).toBeCalledTimes( 0 )

        // console.error was not called
        expect( console.error.mock.calls ).toEqual( [] )
    })

    test('When in debug mode, ensure error is logged to console with element', () => {
        let template = `
            <div x-data="{ foo: 'bar' }aa">
                <span id="span" x-text="foo"></span>
            </div>`

        let dom = createElement(template)
        document.body.appendChild(dom)

        window.Alpine.enableDebugMode()

        try {
            window.Alpine.start()
        } catch ( _error ) {
            expect( _error.name ).toContain( "SyntaxError" )
        }

        expect( window.addEventListener ).toBeCalledWith("error", expect.any(Function) )

        // console.error was called with second parameter as our element, so we can click into it in dev tools
        expect( console.error.mock.calls.some( ( item ) => item[1] === dom ) ).toBe( true )
    })

    test('When in debug mode, multiple evaluations at their own element', () => {
        let template = `
            <div x-data="{value: ''}">
                <div id="errors">false</div>

                <template id="xif" x-if="value ==== ''">
                    <span>Words</span>
                </template>
            </div>`

        let dom = createElement(template)
        document.body.appendChild(dom)

        window.Alpine.enableDebugMode()

        try {
            window.Alpine.start()
        } catch ( _error ) {
            expect( _error.name ).toContain( "SyntaxError" )
        }

        expect( window.addEventListener ).toBeCalledTimes(2 )
        expect( window.addEventListener ).toBeCalledWith("error", expect.any(Function) )

        // console.error was called with second parameter as our element, so we can click into it in dev tools
        expect( console.error.mock.calls[0][1]).toBe( dom )
        expect( console.error.mock.calls[1][1]).toBe( dom.querySelector( 'template' ) )
    })
})

