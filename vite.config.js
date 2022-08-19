import { resolve } from 'path'
import { defineConfig } from 'vite'
import marko from '@marko/vite'

export default defineConfig({
    plugins: [
        marko()
    ],
    build: {
        target: 'modules',
        outDir: 'dist',
        emptyOutDir: false
    }
})
