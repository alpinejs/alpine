let { morph } = require('@alpinejs/morph')
let createElement = require('./createElement.js')

test('changed element is the same element', () => {
    let dom = createElement('<div><span>foo</span></div>')

    dom.querySelector('span').is_me = true

    morph(dom, '<div><span>bar</span></div>')

    expect(dom.querySelector('span').is_me).toBeTruthy()
})

test('non-keyed elements are replaced instead of moved', () => {
    let dom = createElement('<ul><li>bar</li></ul>')

    dom.querySelector('li').is_me = true

    morph(dom, '<ul><li>foo</li><li>bar</li></ul>')

    expect(dom.querySelector('li:nth-of-type(1)').is_me).toBeTruthy()
})

test('keyed elements are moved instead of replaced', () => {
    let dom = createElement('<ul><li key="2">bar</li></ul>')

    dom.querySelector('li').is_me = true

    morph(dom, '<ul><li key="1">foo</li><li key="2">bar</li></ul>')

    expect(dom.querySelector('li:nth-of-type(2)').is_me).toBeTruthy()
})

test('elements inserted into a list are properly tracked using lookahead inside updating hook instead of keys', () => {
    let dom = createElement('<ul><li>bar</li></ul>')

    dom.querySelector('li').is_me = true

    morph(dom, '<ul><li>foo</li><li>bar</li></ul>', {
        lookahead: true,
    })

    expect(dom.outerHTML).toEqual('<ul><li>foo</li><li>bar</li></ul>')
    expect(dom.querySelector('li:nth-of-type(2)').is_me).toBeTruthy()
})

test('lookahead still works if comparison elements have keys', () => {
    let dom = createElement(`<ul>
<li key="bar">bar</li>
<li>hey</li>
</ul>`)

    dom.querySelector('li:nth-of-type(1)').is_me = true
    dom.querySelector('li:nth-of-type(2)').is_me = true

    morph(dom, `<ul>
<li key="foo">foo</li>
<li key="bar">bar</li>
<li>hey</li>
</ul>`, {
        lookahead: true,
    })

    expect(dom.querySelector('li:nth-of-type(1)').is_me).toBeFalsy()
    expect(dom.querySelector('li:nth-of-type(2)').is_me).toBeTruthy()
    expect(dom.querySelector('li:nth-of-type(3)').is_me).toBeTruthy()
    expect(dom.querySelectorAll('li').length).toEqual(3)
})

test('baz', () => {
    let dom = createElement(`<ul>
<li key="bar">bar</li>

<li>hey</li>
</ul>`)

    dom.querySelector('li:nth-of-type(1)').is_me = true
    dom.querySelector('li:nth-of-type(2)').is_me = true

    morph(dom, `<ul>
<li>foo</li>

<li key="bar">bar</li>

<li>hey</li>
</ul>`, {
        lookahead: true,
    })

    expect(dom.querySelector('li:nth-of-type(1)').is_me).toBeFalsy()
    expect(dom.querySelector('li:nth-of-type(2)').is_me).toBeTruthy()
    expect(dom.querySelector('li:nth-of-type(3)').is_me).toBeTruthy()
    expect(dom.querySelectorAll('li').length).toEqual(3)
})

test('blah blah blah no lookahead', () => {
    let dom = createElement(`<ul>
<li key="bar">bar</li>
<li>hey</li>
</ul>`)

    dom.querySelector('li:nth-of-type(1)').is_me = true

    morph(dom, `<ul>
<li key="foo">foo</li>
<li key="bar">bar</li>
<li>hey</li>
</ul>`)

    expect(dom.querySelector('li:nth-of-type(1)').is_me).toBeFalsy()
    expect(dom.querySelector('li:nth-of-type(2)').is_me).toBeTruthy()
    expect(dom.querySelector('li:nth-of-type(3)').is_me).toBeFalsy()
    expect(dom.querySelectorAll('li').length).toEqual(3)
})

//


// @todo: add test to make sure added nodes are cloned from the "to" tree
