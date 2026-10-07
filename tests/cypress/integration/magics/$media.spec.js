import { haveText, html, notExist, test } from '../../utils'

function matchMediaStub() {
    return `
        window.matchMediaCalls = []
        window.mediaQueries = new Map()

        window.matchMedia = query => {
            window.matchMediaCalls.push(query)

            let listeners = new Set()
            let mediaQuery = {
                matches: false,
                media: query,
                addEventListener(event, listener) {
                    if (event === 'change') listeners.add(listener)
                },
                removeEventListener(event, listener) {
                    if (event === 'change') listeners.delete(listener)
                },
                setMatches(matches) {
                    this.matches = matches
                    listeners.forEach(listener => listener({ matches, media: query }))
                },
                listenerCount() {
                    return listeners.size
                },
            }

            window.mediaQueries.set(query, mediaQuery)

            return mediaQuery
        }
    `
}

test('$media returns the current match and reacts to changes',
    [html`
        <div x-data>
            <span x-text="$media('(min-width: 800px)') ? 'wide' : 'narrow'"></span>
        </div>
    `, matchMediaStub()],
    ({ get }, reload, window) => {
        get('span').should(haveText('narrow'))

        get('span').then(() => {
            window.mediaQueries.get('(min-width: 800px)').setMatches(true)
        })

        get('span').should(haveText('wide'))
    }
)

test('$media shares media query listeners and cleans them up',
    [html`
        <div x-data="{ first: true, second: true }">
            <template x-if="first">
                <span id="first" x-text="$media('(prefers-reduced-motion: reduce)')"></span>
            </template>
            <template x-if="second">
                <span id="second" x-text="$media('(prefers-reduced-motion: reduce)')"></span>
            </template>

            <button id="remove-first" @click="first = false">Remove first</button>
            <button id="remove-second" @click="second = false">Remove second</button>
        </div>
    `, matchMediaStub()],
    ({ get }, reload, window) => {
        get('#first').should(haveText('false'))
        get('#second').should(haveText('false'))

        get('#second').then(() => {
            expect(window.matchMediaCalls).to.deep.equal(['(prefers-reduced-motion: reduce)'])
            expect(window.mediaQueries.get('(prefers-reduced-motion: reduce)').listenerCount()).to.equal(1)
        })

        get('#remove-first').click()
        get('#first').should(notExist())

        get('#second').then(() => {
            expect(window.mediaQueries.get('(prefers-reduced-motion: reduce)').listenerCount()).to.equal(1)
            window.mediaQueries.get('(prefers-reduced-motion: reduce)').setMatches(true)
        })

        get('#second').should(haveText('true'))
        get('#remove-second').click()
        get('#second').should(notExist())

        get('#remove-second').then(() => {
            expect(window.mediaQueries.get('(prefers-reduced-motion: reduce)').listenerCount()).to.equal(0)
        })
    }
)

test.csp('$media is available in the CSP build',
    html`
        <div x-data>
            <span x-text="$media('(min-width: 0px)')"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('true'))
    }
)

test('$media supports the legacy MediaQueryList listener API',
    [html`
        <div x-data="{ show: true }">
            <template x-if="show">
                <span x-text="$media('(hover: hover)')"></span>
            </template>
            <button @click="show = false">Remove</button>
        </div>
    `, `
        window.legacyMediaQueryListeners = new Set()
        window.legacyMediaQuery = {
            matches: false,
            addListener(listener) {
                window.legacyMediaQueryListeners.add(listener)
            },
            removeListener(listener) {
                window.legacyMediaQueryListeners.delete(listener)
            },
        }
        window.matchMedia = () => window.legacyMediaQuery
    `],
    ({ get }, reload, window) => {
        get('span').should(haveText('false'))

        get('span').then(() => {
            window.legacyMediaQuery.matches = true
            window.legacyMediaQueryListeners.forEach(listener => listener(window.legacyMediaQuery))
        })

        get('span').should(haveText('true'))
        get('button').click()
        get('span').should(notExist())

        get('button').then(() => {
            expect(window.legacyMediaQueryListeners.size).to.equal(0)
        })
    }
)
