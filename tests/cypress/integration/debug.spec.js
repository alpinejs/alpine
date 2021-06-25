import { haveText, html, test } from '../utils'

function setupConsoleInterceptor( targetId ) {
    return `
        console.errlog = console.error.bind( console )
        console.error = function() {
            document.getElementById( 'errors' ).innerHTML = arguments[1] === document.getElementById( '${targetId}' )
            console.errlog.apply( console, arguments )
        }
    `
}

test('x-for identifier issue',
    [html`
        <div x-data="{ items: ['foo'] }">
            <div id="errors">false</div>

            <template id="xfor" x-for="item in itemzzzz">
                <span x-text="item"></span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xfor" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-text identifier issue',
    [html`
        <div x-data="{ items: ['foo'] }">
            <div id="errors">false</div>

            <template x-for="item in items">
                <span id="xtext" x-text="itemzzz"></span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xtext" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-init identifier issue',
    [html`
        <div id="xinit" x-data x-init="doesNotExist()">
            <div id="errors">false</div>
        </div>
    `,
        setupConsoleInterceptor( "xinit" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-show identifier issue',
    [html`
        <div id="xshow" x-data="{isOpen: true}" x-show="isVisible">
            <div id="errors">false</div>
        </div>
    `,
        setupConsoleInterceptor( "xshow" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-bind class object syntax identifier issue',
    [html`
        <div x-data="{isOpen: true}">
            <div id="errors">false</div>

            <div id="xbind" :class="{ 'block' : isVisible, 'hidden' : !isVisible }"></div>
        </div>
    `,
        setupConsoleInterceptor( "xbind" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-model identifier issue',
    [html`
        <div x-data="{value: ''}">
            <div id="errors">false</div>

            <input id="xmodel" x-model="data"/>
        </div>
    `,
        setupConsoleInterceptor( "xmodel" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-if identifier issue',
    [html`
        <div x-data="{value: ''}">
            <div id="errors">false</div>

            <template id="xif" x-if="valuez === ''">
                <span>Words</span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xif" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-if identifier issue ( function )',
    [html`
        <div x-data="{shouldOpen: function(){}}">
            <div id="errors">false</div>

            <template id="xif" x-if="isOpen()">
                <span>Words</span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xif" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-effect identifier issue',
    [html`
        <div id="xeffect" x-data="{ label: 'Hello' }" x-effect="System.out.println(label)">
            <div id="errors">false</div>
        </div>
    `,
        setupConsoleInterceptor( "xeffect" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-on identifier issue',
    [html`
        <div x-data="{ label: 'Hello' }">
            <div id="errors">false</div>
            <div x-text="label"></div>
            <button id="xon" x-on:click="labelz += ' World!'">Change Message</button>
        </div>
    `,
        setupConsoleInterceptor( "xon" )
    ],
    ({ get }) => {
        get( "#xon" ).click()
        get( "#errors" ).should(haveText('true'))
    }
)

test('x-data syntax error',
    [html`
        <div id="xdata" x-data="{ label: 'Hello' }aaa">
            <div id="errors">false</div>
        </div>
    `,
        setupConsoleInterceptor( "xdata" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)

test('if statement syntax error',
    [html`
        <div x-data="{ label: 'Hello' }">
            <div id="errors">false</div>
            <div id="xtext" x-text="if( false { label } else { 'bye' }"></div>
        </div>
    `,
        setupConsoleInterceptor( "xtext" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)


test('if statement syntax error',
    [html`
        <div id="xtext" x-data="{ items : [ {v:'one'},{v:'two'}], replaceItems }">
            <template x-for="item in items">
                <span x-text="item.v"></span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xtext" )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('true'))
    }
)
