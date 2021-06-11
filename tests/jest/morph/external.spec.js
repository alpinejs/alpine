let { morph } = require('@alpinejs/morph')
let createElement = require('./createElement.js')

test('text content', () => assertPatch(
    `<div>foo</div>`,
    `<div>bar</div>`
))

test('change tag', () => assertPatch(
    `<div><div>foo</div></div>`,
    `<div><span>foo</span></div>`
))

test('add child', () => assertPatch(
    `<div>foo</div>`,
    `<div>foo <h1>baz</h1></div>`
))

test('remove child', () => assertPatch(
    `<div>foo <h1>baz</h1></div>`,
    `<div>foo</div>`
))

test('add attribute', () => assertPatch(
    `<div>foo</div>`,
    `<div foo="bar">foo</div>`
))

test('remove attribute', () => assertPatch(
    `<div foo="bar">foo</div>`,
    `<div>foo</div>`
))

test('change attribute', () => assertPatch(
    `<div foo="bar">foo</div>`,
    `<div foo="baz">foo</div>`
))

function assertPatch(before, after) {
    expect(morph(createElement(before), after).outerHTML).toEqual(after)
}
