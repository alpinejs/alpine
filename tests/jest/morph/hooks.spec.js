let { morph } = require('@alpinejs/morph')
let createElement = require('./createElement.js')

test('can use custom key name', async () => {
    let dom = createElement('<ul><li wire:key="2">bar</li></ul>')

    dom.querySelector('li').is_me = true

    await morph(dom, '<ul><li wire:key="1">foo</li><li wire:key="2">bar</li></ul>', {
        key(el) { return el.getAttribute('wire:key') }
    })

    expect(dom.querySelector('li:nth-of-type(2)').is_me).toBeTruthy()
})

test('can prevent update', async () => {
    let dom = createElement('<div><span>foo</span></div>')

    await morph(dom, '<div><span>bar</span></div>', {
        updating(from, to, childrenOnly, prevent) {
            if (from.textContent === 'foo') {
                prevent()
            }
        }
    })

    expect(dom.querySelector('span').textContent).toEqual('foo')
})

test('can prevent update, but still update children', async () => {
    let dom = createElement('<div><span foo="bar">foo</span></div>')

    await morph(dom, '<div><span foo="baz">bar</span></div>', {
        updating(from, to, childrenOnly, prevent) {
            if (from.textContent === 'foo') {
                childrenOnly()
            }
        }
    })

    expect(dom.querySelector('span').textContent).toEqual('bar')
    expect(dom.querySelector('span').getAttribute('foo')).toEqual('bar')
})

test('changing tag doesnt trigger an update (add and remove instead)', async () => {
    let dom = createElement('<div><span>foo</span></div>')

    let updateHookCalledTimes = 0

    await morph(dom, '<div><h1>foo</h1></div>', {
        updating(from, to, prevent) {
            updateHookCalledTimes++
        }
    })

    expect(updateHookCalledTimes).toEqual(1)
})

test('can impact update', async () => {
    let dom = createElement('<div><span>foo</span></div>')

    await morph(dom, '<div><span>bar</span></div>', {
        updated(from, to) {
            if (from.textContent === 'bar') {
                from.textContent = 'baz'
            }
        }
    })

    expect(dom.querySelector('span').textContent).toEqual('baz')
})

test('updating and updated are sequential when element has child updates ', async () => {
    let dom = createElement('<div><span>foo</span></div>')

    let updatings = []
    let updateds = []

    await morph(dom, '<div><span>bar</span></div>', {
        updating(from, to) {
            updatings.push(from.nodeName.toLowerCase())
        },

        updated(from, to) {
            updateds.push(from.nodeName.toLowerCase())
        }
    })

    expect(updatings).toEqual(['div', 'span', '#text'])
    expect(updateds).toEqual(['div', 'span', '#text'])
})

test('can prevent removal', async () => {
    let dom = createElement('<div><span>foo</span></div>')

    await morph(dom, '<div></div>', {
        removing(from, prevent) {
            prevent()
        }
    })

    expect(dom.querySelector('span')).toBeTruthy()
})

test('can impact removal', async () => {
    let dom = createElement('<div><span>foo</span></div>')

    let textContent

    await morph(dom, '<div></div>', {
        removed(from) {
            textContent = from.textContent
        }
    })

    expect(textContent).toEqual('foo')
})

test('can prevent removal for tag replacement', async () => {
    let dom = createElement('<div><span>foo</span></div>')

    await morph(dom, '<div><h1>foo</h1></div>', {
        removing(from, prevent) {
            prevent()
        }
    })

    expect(dom.querySelector('span')).toBeTruthy()
})

test('can impact removal for tag replacement', async () => {
    let dom = createElement('<div><span>foo</span></div>')

    let textContent

    await morph(dom, '<div><h1>foo</h1></div>', {
        removed(from) {
            textContent = from.textContent
        }
    })

    expect(textContent).toEqual('foo')
})

test('can prevent addition', async () => {
    let dom = createElement('<div></div>')

    await morph(dom, '<div><span>foo</span></div>', {
        adding(to, prevent) {
            prevent()
        }
    })

    expect(dom.querySelector('span')).toBeFalsy()
})

test('can impact addition', async () => {
    let dom = createElement('<div></div>')

    await morph(dom, '<div><span>foo</span></div>', {
        added(to) {
            to.textContent = 'bar'
        }
    })

    expect(dom.querySelector('span').textContent).toEqual('bar')
})

test('can prevent addition for tag replacement', async () => {
    let dom = createElement('<div><h1>foo</h1></div>')

    await morph(dom, '<div><span>foo</span></div>', {
        adding(to, prevent) {
            prevent()
        }
    })

    expect(dom.querySelector('span')).toBeFalsy()
})

test('can impact addition for tag replacement', async () => {
    let dom = createElement('<div><h1>foo</h1></div>')

    await morph(dom, '<div><span>foo</span></div>', {
        added(to) {
            to.textContent = 'bar'
        }
    })

    expect(dom.querySelector('span').textContent).toEqual('bar')
})
