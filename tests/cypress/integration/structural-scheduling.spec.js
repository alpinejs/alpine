import { test } from '../utils'

let mulberry32 = seed => () => {
    seed |= 0
    seed = seed + 0x6D2B79F5 | 0
    let value = Math.imul(seed ^ seed >>> 15, 1 | seed)
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value

    return ((value ^ value >>> 14) >>> 0) / 4294967296
}

let shuffle = (values, random) => {
    for (let i = values.length - 1; i > 0; i--) {
        let swap = Math.floor(random() * (i + 1))
        let cached = values[i]
        values[i] = values[swap]
        values[swap] = cached
    }

    return values
}

let texts = (root, selector) => Array.from(root.querySelectorAll(selector), el => el.textContent)

test('random structural mutations always settle on the final scopes',
    [
        `
            <div id="subject" x-data="structuralStress">
                <div id="nested-ranges">
                    <template x-for="outer in outerEnd - outerStart" :key="outerStart + outer">
                        <article :data-outer="outerStart + outer">
                            <template x-for="inner in innerEnd - innerStart" :key="innerStart + inner">
                                <span class="range-item" x-text="revision + ':' + (outerStart + outer) + ':' + (innerStart + inner)"></span>
                            </template>
                        </article>
                    </template>
                </div>

                <template x-if="user">
                    <div id="conditional">
                        <template x-for="item in user.items" :key="item">
                            <span class="conditional-item" x-text="revision + ':' + item"></span>
                        </template>

                        <template x-teleport="#teleport-target">
                            <div id="teleported">
                                <template x-for="item in user.items" :key="item">
                                    <span class="teleported-item" x-text="revision + ':' + item"></span>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>

                <div id="html-host" x-html="user ? html : ''"></div>
            </div>

            <div id="teleport-target"></div>
        `,
        `
            Alpine.data('structuralStress', () => ({
                revision: 0,
                outerStart: 0,
                outerEnd: 3,
                innerStart: 0,
                innerEnd: 3,
                user: { items: ['initial-1', 'initial-2'] },
                html: '<template x-for="item in user.items" :key="item"><span class="html-item" x-text="revision + &quot;:&quot; + item"></span></template>',
            }))
        `,
    ],
    ({ then }, reload, window, document) => {
        then(async () => {
            let subject = document.querySelector('#subject')
            let data = subject._x_dataStack[0]
            let seeds = [0x4851, 0xC0FFEE, 0x5EED1234, 0xDEADBEEF, 0xA11CE, 0xBADC0DE, 0xFEEDFACE, 0x12345678]

            for (let seed of seeds) {
                let random = mulberry32(seed)

                for (let step = 0; step < 100; step++) {
                    let revision = data.revision + 1
                    let outerStart = Math.floor(random() * 8)
                    let outerCount = Math.floor(random() * 7)
                    let innerStart = Math.floor(random() * 6)
                    let innerCount = Math.floor(random() * 6)
                    let user = random() < .28
                        ? null
                        : {
                            items: shuffle(
                                Array.from({ length: 10 }, (_, index) => `item-${index}`),
                                random,
                            ).slice(0, Math.floor(random() * 7)),
                        }

                    let updates = shuffle([
                        () => data.revision = revision,
                        () => data.outerStart = outerStart,
                        () => data.outerEnd = outerStart + outerCount,
                        () => data.innerStart = innerStart,
                        () => data.innerEnd = innerStart + innerCount,
                        () => data.user = user,
                    ], random)

                    if (random() < .5) {
                        await window.Alpine.transaction(async () => updates.forEach(update => update()))
                    } else {
                        updates.forEach(update => update())
                    }

                    await new Promise(window.queueMicrotask)

                    let context = `seed ${seed.toString(16)}, step ${step}`
                    let expectedRanges = []

                    for (let outer = 1; outer <= outerCount; outer++) {
                        for (let inner = 1; inner <= innerCount; inner++) {
                            expectedRanges.push(`${revision}:${outerStart + outer}:${innerStart + inner}`)
                        }
                    }

                    expect(texts(subject, '.range-item'), `nested ranges at ${context}`)
                        .to.deep.equal(expectedRanges)

                    let expectedItems = user === null
                        ? []
                        : user.items.map(item => `${revision}:${item}`)

                    expect(texts(subject, '.conditional-item'), `x-if descendants at ${context}`)
                        .to.deep.equal(expectedItems)
                    expect(texts(document, '.teleported-item'), `teleported descendants at ${context}`)
                        .to.deep.equal(expectedItems)
                    expect(texts(subject, '.html-item'), `x-html descendants at ${context}`)
                        .to.deep.equal(expectedItems)

                    expect(document.querySelector('#conditional') !== null, `x-if presence at ${context}`)
                        .to.equal(user !== null)
                    expect(document.querySelector('#teleported') !== null, `teleport presence at ${context}`)
                        .to.equal(user !== null)
                }
            }
        })
    },
)
