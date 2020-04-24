import { version } from 'alpinejs'
import pkg from '../package.json'

test('Alpine.version matches package.json version field', () => {
    expect(version).toEqual(String(pkg.version))
})
