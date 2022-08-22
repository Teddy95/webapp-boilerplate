import { defineConfig } from 'vite'
import marko from '@marko/vite'
import nodePolyfills from 'rollup-plugin-polyfill-node'

export default defineConfig({
    plugins: [
        marko()
    ],
    build: {
        target: 'modules',
        outDir: 'dist',
        emptyOutDir: false,
        rollupOptions: {
            plugins: [nodePolyfills()]
        },
        commonjsOptions: {
            transformMixedEsModules: true
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            }
        }
    }
})
