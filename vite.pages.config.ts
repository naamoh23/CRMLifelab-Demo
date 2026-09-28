import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath,URL} from 'node:url';
export default defineConfig({
 base:'./',plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},
 define:{'process.env.NEXT_PUBLIC_STATIC_DEMO':JSON.stringify('true')},
 build:{outDir:'dist-pages',emptyOutDir:true},
});
