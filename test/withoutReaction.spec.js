import Alpine from 'alpinejs'
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

global.MutationObserver = class {
    observe() {}
}

test('$withoutReaction', async () => {
    document.body.innerHTML = `
        <div x-data="{
                        items: [{id: 1, text: 'id1'}, {id: 2, text: 'id2'}],
                        update() { this.$withoutReaction(() => {
                            for (let i = 0; i < this.items.length; i++)
                                this.items[i].text = 'test'
                            })
                         }
                     }">
            <template x-for="item in items">
                <span x-text="item.text"></span>
            </template>

            <button @click="update()"></button>
        </div>
    `

    Alpine.start()

    document.querySelector('button').click()

    await timeout(1)

    expect(document.querySelectorAll('span')[0].innerText).toEqual('id1')
    expect(document.querySelectorAll('span')[1].innerText).toEqual('id2')
})


test('$wr', async () => {
    document.body.innerHTML = `
        <div x-data="{
                        items: [{id: 1, text: 'id1'}, {id: 2, text: 'id2'}]
                     }">
            <template x-for="item in items">
                <span x-text="item.text"></span>
            </template>

            <button @click="$wr(() => { items.forEach((i) => i.text = 'test') })"></button>
        </div>
    `

    Alpine.start()

    document.querySelector('button').click()

    await timeout(1)

    expect(document.querySelectorAll('span')[0].innerText).toEqual('id1')
    expect(document.querySelectorAll('span')[1].innerText).toEqual('id2')
})
