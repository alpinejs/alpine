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

test('handle full HTML page', () => assertPatch(
    `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Page 1</title>
        </head>
        <body>
            <p>Page 1</p>
        </body>
        </html>
    `,
    `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Hello</title>
        </head>
        <body>
            <p>Page 2</p>
        </body>
        </html>
    `,
    document
))

async function assertPatch(before, after, beforeTargetHtml = null) {
    const morphed = await morph(createElement(before, beforeTargetHtml), after)

    expect(morphed.outerHTML.replace(/\s/g, '')).toEqual(after.replace(/\s/g, ''))
}
