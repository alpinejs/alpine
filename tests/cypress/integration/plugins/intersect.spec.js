import { haveText, test, html } from '../../utils'

test('can intersect',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div x-intersect="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
    },
)

test('It should evaluate with ":enter" only when the component is intersected',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div x-intersect:enter="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
    },
)

test('It should evaluate with ":leave" only when the component is not intersected',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div x-intersect:leave="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('3'))
    },
)

test('.half',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div id="container" style="height: 400px; overflow-y: scroll;">
            <div style="height: 410px;">spacer</div>

            <div style="height: 400px" x-intersect.half="count++">
                <div style="text-align: center;">content</div>
            </div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 100, {duration: 100})
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 210, {duration: 100})
        get('span').should(haveText('1'))
    },
)

test('.full',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div id="container" style="height: 400px; overflow-y: scroll;">
            <div style="height: 401px;">spacer</div>

            <div style="height: 400px" x-intersect.full="count++">
                <div style="text-align: center;">content</div>
            </div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 200, {duration: 100})
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 400, {duration: 100})
        get('span').should(haveText('1'))
    },
)

test('.once',
    [html`
    <div x-data="{ count: 0 }" x-init="setTimeout(() => count++, 300)">
        <span x-text="count"></span>

        <div x-intersect.once="count++" style="margin-top: 100vh;" id="1">hi</div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('span').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
    },
)

test.only('.margin',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>
        <div style="height: 200vh;"></div>
        <div x-intersect.margin.100px="count++" id="1" style="height: 20px;">hi</div>
    </div>
    `, `
        // Cypress 15's AUT iframe clips native positive root margins, so keep
        // this margin-specific test focused on Alpine's observer options.
        let px = value => Number((value || '0px').replace('px', ''))

        let margins = (value = '0px') => {
            let values = value.trim().split(/\\s+/)

            return {
                top: px(values[0]),
                bottom: px(values[2] || values[0]),
            }
        }

        window.IntersectionObserver = class {
            constructor(callback, options = {}) {
                this.callback = callback
                this.options = options
                this.targets = new Set()
                this.states = new Map()
                this.check = this.check.bind(this)

                window.addEventListener('scroll', this.check)
            }

            observe(target) {
                this.targets.add(target)
                this.check()
            }

            disconnect() {
                window.removeEventListener('scroll', this.check)
                this.targets.clear()
            }

            check() {
                let margin = margins(this.options.rootMargin)
                let entries = []

                this.targets.forEach(target => {
                    let rect = target.getBoundingClientRect()
                    let isIntersecting = rect.bottom > -margin.top && rect.top < window.innerHeight + margin.bottom

                    if (this.states.get(target) === isIntersecting) return

                    this.states.set(target, isIntersecting)
                    entries.push({ target, isIntersecting })
                })

                entries.length && this.callback(entries, this)
            }
        }
    `],
    ({ get, window, scrollTo }) => {
        let placeTargetBelowViewport = distance => {
            window().then(win => {
                let target = win.document.getElementById('1')
                let targetTop = target.getBoundingClientRect().top + win.scrollY

                scrollTo(0, targetTop - win.innerHeight - distance, { duration: 100 })
            })
        }

        let waitForObserver = () => {
            window().then(win => new Promise(resolve => {
                win.requestAnimationFrame(() => win.requestAnimationFrame(resolve))
            }))
        }

        get('span').should(haveText('0'))
        placeTargetBelowViewport(150)
        waitForObserver()
        get('span').should(haveText('0'))

        placeTargetBelowViewport(50)
        waitForObserver()
        get('span').should(haveText('1'))
        window().then(win => {
            let targetTop = win.document.getElementById('1').getBoundingClientRect().top

            expect(targetTop).to.be.greaterThan(win.innerHeight)
            expect(targetTop).to.be.lessThan(win.innerHeight + 100)
        })

        placeTargetBelowViewport(-10)
        waitForObserver()
        get('span').should(haveText('1'))

        placeTargetBelowViewport(150)
        waitForObserver()
        get('span').should(haveText('1'))

        placeTargetBelowViewport(50)
        get('span').should(haveText('2'))
    },
)

test('.threshold',
    [html`
    <div x-data="{ count: 0 }">
        <div x-ref="foo" style="width: 250px; overflow: scroll; display: flex; justify-content: start">
            <div style="min-width: 250px;">first</div>
            <div style="min-width: 250px" x-intersect.threshold.50="count++;">second</div>
        </div>
        <button @click="$refs.foo.scrollTo({ left: 15 })" id="1">first</button>
        <button @click="$refs.foo.scrollTo({ left: 250 })" id="2">second</button>
        <span x-text="count"></span>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#1').click()
        get('span').should(haveText('0'))
        get('#2').click()
        get('span').should(haveText('1'))
    },
)
