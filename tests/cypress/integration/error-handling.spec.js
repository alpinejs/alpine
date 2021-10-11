import { haveText, html, test } from '../utils'

export function setupConsoleInterceptor( ...targetIds ) {
    const mappedTargetIds = targetIds.map( tid => `'${tid}'` ).join( ',' )
    return `
        let errorContainer = document.createElement('div');
        errorContainer.id = 'errors'
        errorContainer.textContent = 'false'
        document.querySelector('#root').after(errorContainer)
        console.warnlog = console.warn.bind(console)
        console.warn = function () {
            document.getElementById( 'errors' ).textContent = [${mappedTargetIds}].some( target => arguments[1] === document.getElementById( target ) )
            console.warnlog.apply(console, arguments)
        }
    `
}

export function assertConsoleInterceptorHadErrorWithCorrectElement() {
    return ({get}) => {
        get('#errors').should(haveText('true'))
    };
}

test('x-for identifier issue',
    [html`
        <div x-data="{ items: ['foo'] }">
            <template id="xfor" x-for="item in itemzzzz">
                <span x-text="item"></span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xfor" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-text identifier issue',
    [html`
        <div x-data="{ items: ['foo'] }">
            <template x-for="item in items">
                <span id="xtext" x-text="itemzzz"></span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xtext" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-init identifier issue',
    [html`
        <div id="xinit" x-data x-init="doesNotExist()">
        </div>
    `,
        setupConsoleInterceptor( "xinit" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-show identifier issue',
    [html`
        <div id="xshow" x-data="{isOpen: true}" x-show="isVisible">
        </div>
    `,
        setupConsoleInterceptor( "xshow" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-bind class object syntax identifier issue',
    [html`
        <div x-data="{isOpen: true}">
            <div id="xbind" :class="{ 'block' : isVisible, 'hidden' : !isVisible }"></div>
        </div>
    `,
        setupConsoleInterceptor( "xbind" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-model identifier issue',
    [html`
        <div x-data="{value: ''}">
            <input id="xmodel" x-model="thething"/>
        </div>
    `,
        setupConsoleInterceptor( "xmodel" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-if identifier issue',
    [html`
        <div x-data="{value: ''}">
            <template id="xif" x-if="valuez === ''">
                <span>Words</span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xif" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-if identifier issue ( function )',
    [html`
        <div x-data="{shouldOpen: function(){}}">
            <template id="xif" x-if="isOpen()">
                <span>Words</span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xif" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-effect identifier issue',
    [html`
        <div id="xeffect" x-data="{ label: 'Hello' }" x-effect="System.out.println(label)">
        </div>
    `,
        setupConsoleInterceptor( "xeffect" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-on identifier issue',
    [html`
        <div x-data="{ label: 'Hello' }">
            <div x-text="label"></div>
            <button id="xon" x-on:click="labelz += ' World!'">Change Message</button>
        </div>
    `,
        setupConsoleInterceptor( "xon" )
    ],
    ({ get }) => {
        get( "#xon" ).click()
        get( "#errors" ).should(haveText('true'))
    },
    true
)

test('x-data syntax error',
    [html`
        <div id="xdata" x-data="{ label: 'Hello' }aaa">
        </div>
    `,
        setupConsoleInterceptor( "xdata" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('if statement syntax error',
    [html`
        <div x-data="{ label: 'Hello' }">
            <div id="xtext" x-text="if( false { label } else { 'bye' }"></div>
        </div>
    `,
        setupConsoleInterceptor( "xtext" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('x-data with reference error and multiple errors',
    [html`
        <div id="xdata" x-data="{ items : [ {v:'one'},{v:'two'}], replaceItems }">
            <template id="xtext" x-for="item in items">
                <span x-text="item.v"></span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xdata", "xtext" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)

test('evaluation with syntax error',
    [html`
        <div x-data="{value: ''}">
            <template id="xif" x-if="value ==== ''">
                <span>Words</span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xif" )
    ],
    assertConsoleInterceptorHadErrorWithCorrectElement(),
    true
)
