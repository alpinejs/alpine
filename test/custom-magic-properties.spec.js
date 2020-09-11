import Alpine from 'alpinejs'

test('can register custom magic properties', async () => {
    document.body.innerHTML = `
        <div x-data>
            <span x-text="$foo.bar"></span>
        </div>
    `

    Alpine.addMagicProperty('foo', () => {
        return { bar: 'baz' }
    })

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('baz')
})
