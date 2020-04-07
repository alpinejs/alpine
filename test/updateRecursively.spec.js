import Alpine from 'alpinejs'

global.MutationObserver = class {
    observe() {}
}

test('$updateRecursively', async () => {
    document.body.innerHTML = `
        <div x-data="{state: 'old', update() { this.$updateRecursively(this.$refs.div) }}">
            <div x-ref="div">
                <span x-text="state"></span>
            </div>
            <button @click="$wr(() => state = 'new' )"></button>
            <button @click="update"></button>
        </div>
    `

    Alpine.start()

    document.querySelectorAll('button')[0].click()
    expect(document.querySelector('span').innerText).toEqual('old')
    document.querySelectorAll('button')[1].click()
    expect(document.querySelector('span').innerText).toEqual('new')
})

test('$ur', async () => {
    document.body.innerHTML = `
       <div x-data="{state: 'old'}">
            <div x-ref="div">
                <span x-text="state"></span>
            </div>
            <button @click="$wr(() => state = 'new' )"></button>
            <button @click="$ur($refs.div, {})"></button>
        </div>
    `

    Alpine.start()

    document.querySelectorAll('button')[0].click()
    expect(document.querySelector('span').innerText).toEqual('old')
    document.querySelectorAll('button')[1].click()
    expect(document.querySelector('span').innerText).toEqual('new')
})
