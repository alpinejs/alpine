import { defineConfig } from 'vitest/config';
import { readFileSync } from 'fs';

// Read the version from alpinejs package.json
const alpinePackageJson = JSON.parse(
    readFileSync('./packages/alpinejs/package.json', 'utf-8')
);
const alpineVersion = alpinePackageJson.version;

export default defineConfig({
    test: {
        include: ['tests/vitest/**/*.spec.js'],
    },
    define: {
        'ALPINE_VERSION': `'${alpineVersion}'`,
    },
});
