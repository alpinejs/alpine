import { haveHtml, haveAttribute, notHaveAttribute, contain, notContain, notExist, html, test } from '../../utils'

test('plain text passes through unchanged',
    [html`
        <div x-data="{ text: 'Hello world' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(haveHtml('Hello world'))
    },
)

test('allowed inline tags pass through',
    [html`
        <div x-data="{ text: '<strong>Bold</strong> and <em>italic</em>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(contain('Bold'))
        get('span > strong').should(haveHtml('Bold'))
        get('span > em').should(haveHtml('italic'))
    },
)

test('nested safe tags are preserved',
    [html`
        <div x-data="{ text: '<strong><em>Bold and italic</em></strong>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(haveHtml('<strong><em>Bold and italic</em></strong>'))
    },
)

test('unclosed tag is closed by the parser, text survives',
    [html`
        <div x-data="{ text: '<strong>Unclosed' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(contain('Unclosed'))
    },
)

test('unknown tag is dropped along with its text content',
    [html`
        <div x-data="{ text: '<foo>Some text</foo>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(haveHtml(''))
    },
)

test('block and structural tags are allowed',
    [html`
        <div x-data="{ text: '<h1>Title</h1><p>Paragraph</p><ul><li>One</li></ul><blockquote><p>Quote</p></blockquote><hr>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span h1').should(haveHtml('Title'))
        get('span p').should(contain('Paragraph'))
        get('span li').should(haveHtml('One'))
        get('span blockquote').should(contain('Quote'))
        get('span hr').should(haveHtml(''))
    },
)

test('table tags are allowed',
    [html`
        <div x-data="{ text: '<table><caption>Cap</caption><thead><tr><th>H</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span table caption').should(haveHtml('Cap'))
        get('span table thead th').should(haveHtml('H'))
        get('span table tbody td').should(haveHtml('Cell'))
    },
)

test('disallowed tags are stripped, safe content inside is kept',
    [html`
        <div x-data="{ text: '<div><strong>Bold inside div</strong></div><img src=&quot;x&quot; onerror=&quot;alert(1)&quot;><script>alert(1)</script>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span div strong').should(haveHtml('Bold inside div'))
        get('span').should(notContain('script'))
        get('span img').should(notExist())
    },
)

test('script tags are fully stripped including their text content',
    [html`
        <div x-data="{ text: '<script>alert(1)</script>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(haveHtml(''))
    },
)

test('img and iframe are fully stripped',
    [html`
        <div x-data="{ text: '<img src=&quot;https://example.com/x.jpg&quot; alt=&quot;x&quot;><iframe src=&quot;https://example.com&quot;></iframe>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(haveHtml(''))
    },
)

test('disallowed attributes are stripped, element is kept',
    [html`
        <div x-data="{ text: '<span style=&quot;color:red&quot; onclick=&quot;alert(1)&quot; id=&quot;x&quot; aria-hidden=&quot;true&quot;>Styled</span>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span > span').should(notHaveAttribute('style'))
        get('span > span').should(notHaveAttribute('onclick'))
        get('span > span').should(notHaveAttribute('id'))
        get('span > span').should(notHaveAttribute('aria-hidden'))
        get('span > span').should(contain('Styled'))
    },
)

test('allowed generic attributes pass through',
    [html`
        <div x-data="{ text: '<span class=&quot;price&quot; aria-label=&quot;Close&quot; hidden role=&quot;alert&quot; data-product-id=&quot;42&quot; lang=&quot;en&quot; dir=&quot;ltr&quot;>x</span>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span > span').should(haveAttribute('class', 'price'))
        get('span > span').should(haveAttribute('aria-label', 'Close'))
        get('span > span').should(haveAttribute('hidden', 'hidden'))
        get('span > span').should(haveAttribute('role', 'alert'))
        get('span > span').should(haveAttribute('data-product-id', '42'))
        get('span > span').should(haveAttribute('lang', 'en'))
        get('span > span').should(haveAttribute('dir', 'ltr'))
    },
)

test('title attribute passes through on abbr',
    [html`
        <div x-data="{ text: '<abbr title=&quot;HyperText Markup Language&quot;>HTML</abbr>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span abbr').should(haveAttribute('title', 'HyperText Markup Language'))
    },
)

test('href allows https, http, relative, fragment, mailto, tel',
    [html`
        <div x-data="{ text: '<a href=&quot;https://example.com&quot;>a</a><a href=&quot;http://example.com&quot;>b</a><a href=&quot;/products/shirt&quot;>c</a><a href=&quot;#section&quot;>d</a><a href=&quot;mailto:info@example.com&quot;>e</a><a href=&quot;tel:+31201234567&quot;>f</a>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span a').should(($links) => {
            expect($links.eq(0)).to.have.attr('href', 'https://example.com')
            expect($links.eq(1)).to.have.attr('href', 'http://example.com')
            expect($links.eq(2)).to.have.attr('href', '/products/shirt')
            expect($links.eq(3)).to.have.attr('href', '#section')
            expect($links.eq(4)).to.have.attr('href', 'mailto:info@example.com')
            expect($links.eq(5)).to.have.attr('href', 'tel:+31201234567')
        })
    },
)

test('javascript: and data: hrefs are blocked',
    [html`
        <div x-data="{ text: '<a href=&quot;javascript:alert(1)&quot;>a</a><a href=&quot;JAVASCRIPT:alert(1)&quot;>b</a><a href=&quot;data:text/html,x&quot;>c</a>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span a').each($a => {
            expect($a.attr('href')).to.be.undefined
        })
    },
)

test('cite attribute on blockquote and q is validated as a URL',
    [html`
        <div x-data="{ text: '<blockquote cite=&quot;https://example.com&quot;>Q</blockquote><q cite=&quot;javascript:alert(1)&quot;>Q2</q>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span blockquote').should(haveAttribute('cite', 'https://example.com'))
        get('span q').should(notHaveAttribute('cite'))
    },
)

test('cross-origin links get noopener/noreferrer regardless of target',
    [html`
        <div x-data="{ text: '<a href=&quot;https://evil.example.com&quot;>a</a>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span a').should(notHaveAttribute('target'))
        get('span a').should(haveAttribute('rel', 'noopener noreferrer'))
    },
)

test('same-origin links do not get rel injected',
    [html`
        <div x-data="{ text: '<a href=&quot;/internal-page&quot;>a</a>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span a').should(notHaveAttribute('rel'))
    },
)

test('target is restricted to the four spec keywords',
    [html`
        <div x-data="{ text: '<a href=&quot;/page&quot; target=&quot;_blank&quot;>a</a><a href=&quot;/page&quot; target=&quot;_evil&quot;>b</a>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span a').should(($links) => {
            expect($links.eq(0)).to.have.attr('target', '_blank')
            expect($links.eq(1)).not.to.have.attr('target')
        })
    },
)

test('ol/li numeric and boolean attributes are validated against real spec bounds',
    [html`
        <div x-data="{ text: '<ol start=&quot;-3&quot; reversed><li value=&quot;-2&quot;>a</li></ol>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span ol').should(haveAttribute('start', '-3'))
        get('span ol').should(($ol) => {
            expect($ol.attr('reversed')).not.to.be.undefined
        })
        get('span ol li').should(haveAttribute('value', '-2'))
    },
)

test('colspan and rowspan enforce their own distinct WHATWG caps',
    [html`
        <div x-data="{ text: '<table><tr><td colspan=&quot;1000&quot; rowspan=&quot;65534&quot;>a</td></tr><tr><td colspan=&quot;1001&quot; rowspan=&quot;65535&quot;>b</td></tr></table>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span table td').should(($cells) => {
            expect($cells.eq(0)).to.have.attr('colspan', '1000')
            expect($cells.eq(0)).to.have.attr('rowspan', '65534')
            expect($cells.eq(1)).not.to.have.attr('colspan')
            expect($cells.eq(1)).not.to.have.attr('rowspan')
        })
    },
)

test('reversed is dropped on a tag it is not valid for',
    [html`
        <div x-data="{ text: '<table reversed><tr><td>a</td></tr></table>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span table').should(notHaveAttribute('reversed'))
    },
)

test('Alpine directives on injected content are stripped and never execute',
    [html`
        <div x-data="{ text: '<span x-html-safe=&quot;userContent&quot; x-data=&quot;{}&quot; x-init=&quot;window.__pwned = true&quot; x-on:click=&quot;window.__pwned = true&quot; @click=&quot;window.__pwned = true&quot; :class=&quot;window.__pwned = true&quot;>Injected</span>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span > span').should(notHaveAttribute('x-html-safe'))
        get('span > span').should(notHaveAttribute('x-data'))
        get('span > span').should(notHaveAttribute('x-init'))
        get('span > span').should(notHaveAttribute('x-on:click'))
        get('span > span').should(notHaveAttribute('@click'))
        get('span > span').should(notHaveAttribute(':class'))
        get('span > span').click()
        cy.window().its('__pwned').should('be.undefined')
    },
)

test('class passes through untouched, including tailwind arbitrary-value syntax',
    [html`
        <div x-data="{ text: '<span class=&quot;bg-[url(https://evil.com/track)]&quot;>Text</span>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span > span').should(haveAttribute('class', 'bg-[url(https://evil.com/track)]'))
    },
)

test('input is not in the allowlist and is dropped even with x-model',
    [html`
        <div x-data="{ text: '<input x-model=&quot;password&quot; type=&quot;hidden&quot;>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(haveHtml(''))
    },
)

test('reactive updates re-sanitize when the bound expression changes',
    [html`
        <div x-data="{ text: 'one' }">
            <button @click="text = '<strong>two</strong>'">Change</button>
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span').should(haveHtml('one'))
        get('button').click()
        get('span strong').should(haveHtml('two'))
    },
)

test('sanitized output is cached for identical input strings',
    [html`
        <div x-data="{ n: 0, text: '<strong>Cached</strong>' }">
            <button @click="n++">Toggle</button>
            <span x-html-safe="n % 2 === 0 ? text : text"></span>
        </div>
    `],
    ({ get }) => {
        get('span strong').should(haveHtml('Cached'))
        get('button').click()
        get('span strong').should(haveHtml('Cached'))
    },
)

test.csp('x-html-safe works under the CSP build',
    [html`
        <div x-data="{ text: '<strong>Bold</strong><img src=&quot;x&quot; onerror=&quot;alert(1)&quot;>' }">
            <span x-html-safe="text"></span>
        </div>
    `],
    ({ get }) => {
        get('span strong').should(haveHtml('Bold'))
        get('span').should(notContain('onerror'))
    },
)

test.csp('plain x-html still throws under the CSP build (unaffected by this plugin)',
    [html`
        <div x-data="{ show: false }">
            <button x-on:click="show = true"></button>
            <template x-if="show">
                <div x-html="'evil'"></div>
            </template>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({ message }) => message.includes('Using the x-html directive is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('body').should(notContain('evil'))
    },
)
