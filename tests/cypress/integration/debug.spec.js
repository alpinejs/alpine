import { haveText, html, test } from '../utils'

function setupConsoleInterceptor( targetId, enableDebugMode = true ) {
    return `
        console.errlog = console.error.bind( console )
        console.error = function() {
            document.getElementById( 'errors' ).innerHTML = arguments[1] === document.getElementById( '${targetId}' )
            console.errlog.apply( console, arguments )
        }
        ${ enableDebugMode && 'Alpine.enableDebugMode();' }
    `
}

test('debugging disabled does not log element',
    [html`
        <div x-data="{ items: ['foo'] }">
            <div id="errors">false</div>

            <template id="xfor" x-for="item in itemzzzz">
                <span x-text="item"></span>
            </template>
        </div>
    `,
        setupConsoleInterceptor( "xfor", false )
    ],
    ({ get }) => {
        get( "#errors" ).should(haveText('false'))
    }
)

test('debugging enabled logs element - x-for identifier issue',
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

test('debugging enabled logs element - x-text identifier issue',
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

test('debugging enabled logs element - x-init identifier issue',
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

test('debugging enabled logs element - x-show identifier issue',
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

test('debugging enabled logs element - x-bind class object syntax identifier issue',
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

test('debugging enabled logs element - x-model identifier issue',
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

test('debugging enabled logs element - x-if identifier issue',
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

test('debugging enabled logs element - x-if identifier issue ( function )',
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

test('debugging enabled logs element - x-effect identifier issue',
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

test('debugging enabled logs element - x-on identifier issue',
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
