import Alpine from 'alpinejs'

global.MutationObserver = class {
    observe() {}
}

test('$update', async () => {
    document.body.innerHTML = `
       <div x-data="{state: 'old', update() { this.$update(this.$refs.span) }}">
            <span x-text="state" x-ref="span"></span>
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

test('$u', async () => {
    document.body.innerHTML = `
        <div x-data="{state: 'old'}">
            <span x-text="state" x-ref="span"></span>
            <button @click="$wr(() => state = 'new' )"></button>
            <button @click="$u([$refs.span])"></button>
        </div>
    `
    Alpine.start()

    document.querySelectorAll('button')[0].click()
    expect(document.querySelector('span').innerText).toEqual('old')
    document.querySelectorAll('button')[1].click()
    expect(document.querySelector('span').innerText).toEqual('new')
})
