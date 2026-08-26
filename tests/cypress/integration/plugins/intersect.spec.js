import { haveText, test, html } from '../../utils'

let controllableIntersectionObserver = `
    window.intersectionEntry = { isIntersecting: true, intersectionRatio: 0.5 }
    window.intersectionObservers = []

    window.IntersectionObserver = class {
        constructor(callback) {
            this.callback = callback
            this.connected = false
            this.records = []

            window.intersectionObservers.push(this)
        }

        observe() {
            this.connected = true

            queueMicrotask(() => {
                if (this.connected) this.callback([window.intersectionEntry])
            })
        }

        disconnect() {
            this.connected = false
        }

        takeRecords() {
            let records = this.records

            this.records = []

            return records
        }

        notify(entry) {
            window.intersectionEntry = entry
            this.callback([entry])
        }

        queue(entry) {
            window.intersectionEntry = entry
            this.records.push(entry)
        }
    }
`

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

test('.margin',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>
        <div id="container" style="height: 200px; overflow-y: scroll;">
            <div id="buffer-top" style="height: 150px; margin-top: 200px; background: pink"></div>
            <div id="buffer-bottom" style="height: 50px; background: green"></div>
            <div x-intersect.parent.margin.100px="count++;$nextTick(() => console.log(count))" id="1">hi</div>
            <div style="height: 300px;"></div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#buffer-top').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('#1').scrollIntoView({duration: 100})
        get('span').should(haveText('1'))
        get('#container').scrollTo(0, 0, {duration: 100})
        get('span').should(haveText('1'))
        get('#buffer-top').scrollIntoView({duration: 100})
        get('span').should(haveText('2'))
        get('#1').scrollIntoView({duration: 100})
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

test('.parent observes the element relative to its parent, not the viewport',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <!-- Push the scroll container far below the viewport so a window-rooted
             observer would never fire. Only a parent-rooted one should. -->
        <div style="height: 200vh;"></div>

        <div id="container" style="height: 200px; overflow-y: scroll;">
            <div style="height: 250px;">spacer</div>
            <div style="height: 200px" x-intersect.parent="count++">content</div>
        </div>
    </div>
    `],
    ({ get }) => {
        // The content starts below the container's scrolled viewport, so it
        // hasn't intersected yet.
        get('span').should(haveText('0'))

        // Scrolling *within the container* (the observer's root) brings the
        // content into view and triggers the intersection — even though the
        // container itself is well below the browser's viewport.
        get('#container').scrollTo(0, 250, {duration: 100})
        get('span').should(haveText('1'))
    },
)

test('.dwell evaluates after the threshold remains continuously satisfied',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div id="container" style="height: 200px; overflow-y: scroll;">
            <div style="height: 200px;">spacer</div>
            <div style="height: 200px" x-intersect.half.dwell.100ms="count++">content</div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('#container').scrollTo(0, 100, {duration: 0})
        get('#container').wait(50).scrollTo(0, 0, {duration: 0})
        get('span').wait(100).should(haveText('0'))
        get('#container').scrollTo(0, 100, {duration: 0})
        get('span').wait(150).should(haveText('1'))
    },
)

test('.dwell waits for 250 milliseconds by default',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>
        <div x-intersect.dwell="count++">content</div>
    </div>
    `, controllableIntersectionObserver],
    ({ get }) => {
        get('span').wait(200).should(haveText('0'))
        get('span').wait(100).should(haveText('1'))
    },
)

test('.dwell reconciles queued threshold changes before evaluating',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>
        <div x-intersect.half.dwell.200ms="count++">content</div>
    </div>
    `, controllableIntersectionObserver],
    ({ get }, reload, window) => {
        get('span').wait(100).then(() => {
            window.intersectionObservers[0].queue({ isIntersecting: true, intersectionRatio: 0.49 })
        })
        get('span').wait(150).should(haveText('0'))
    },
)

test('.dwell evaluates again after leaving and re-entering',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div id="container" style="height: 200px; overflow-y: scroll;">
            <div style="height: 200px;">spacer</div>
            <div style="height: 200px" x-intersect.half.dwell.100ms="count++">content</div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('#container').scrollTo(0, 100, {duration: 0})
        get('span').wait(150).should(haveText('1'))
        get('#container').scrollTo(0, 0, {duration: 0})
        get('#container').wait(50).scrollTo(0, 100, {duration: 0})
        get('span').wait(150).should(haveText('2'))
    },
)

test('.dwell and .once evaluate only once',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div id="container" style="height: 200px; overflow-y: scroll;">
            <div style="height: 200px;">spacer</div>
            <div style="height: 200px" x-intersect.half.dwell.100ms.once="count++">content</div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('#container').scrollTo(0, 100, {duration: 0})
        get('span').wait(150).should(haveText('1'))
        get('#container').scrollTo(0, 0, {duration: 0})
        get('#container').wait(50).scrollTo(0, 100, {duration: 0})
        get('span').wait(150).should(haveText('1'))
    },
)

test(':leave.dwell uses the configured threshold',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div id="container" style="height: 200px; overflow-y: scroll;">
            <div style="height: 200px" x-intersect:leave.half.dwell.100ms="count++">content</div>
            <div style="height: 200px;">spacer</div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('#container').scrollTo(0, 110, {duration: 0})
        get('span').wait(150).should(haveText('1'))
    },
)

test('.dwell restarts when the page becomes visible',
    [html`
    <div x-data="{ count: 0 }">
        <span x-text="count"></span>

        <div x-intersect.half.dwell.100ms="count++">content</div>
    </div>
    `, controllableIntersectionObserver],
    ({ get }, reload, window, document) => {
        get('span').wait(50).then(() => {
            Object.defineProperty(document, 'hidden', { configurable: true, value: true })
            document.dispatchEvent(new Event('visibilitychange'))

            window.intersectionEntry = { isIntersecting: true, intersectionRatio: 0.49 }

            Object.defineProperty(document, 'hidden', { configurable: true, value: false })
            document.dispatchEvent(new Event('visibilitychange'))
        })
        get('span').wait(150).should(haveText('0'))
        get('span').then(() => {
            window.intersectionObservers[window.intersectionObservers.length - 1]
                .notify({ isIntersecting: true, intersectionRatio: 0.5 })
        })
        get('span').wait(150).should(haveText('1'))
    },
)

test('.dwell cancels when the element is removed',
    [html`
    <div x-data="{ count: 0, show: true }">
        <span x-text="count"></span>
        <button id="remove" @click="show = false">remove</button>

        <div id="container" style="height: 200px; overflow-y: scroll;">
            <div style="height: 200px;">spacer</div>
            <template x-if="show">
                <div style="height: 200px" x-intersect.half.dwell.100ms="count++">content</div>
            </template>
        </div>
    </div>
    `],
    ({ get }) => {
        get('#container').scrollTo(0, 100, {duration: 0})
        get('#remove').wait(50).click()
        get('span').wait(100).should(haveText('0'))
    },
)
