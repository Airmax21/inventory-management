import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import vueLayouts from 'vite-plugin-vue-layouts';
import vueRouter from 'unplugin-vue-router/vite';
import vueComponents from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import autoImport from 'unplugin-auto-import/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import IconsResolver from 'unplugin-icons/resolver';
import icons from 'unplugin-icons/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueLayouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default',
    }),
    vueRouter({
      routesFolder: resolve(__dirname, 'src/pages'),
      dts: resolve(__dirname, 'src/types/router.d.ts'),
    }),
    vueComponents({
      resolvers: [
        AntDesignVueResolver({ importStyle: false }),
        IconsResolver({
          prefix: 'icon',
          enabledCollections: ['mdi', 'ri', 'material-symbols'],
        }),
      ],
      directoryAsNamespace: true,
      dts: resolve(__dirname, 'src/types/components.d.ts'),
    }),
    icons(),
    autoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          '@vueuse/router': ['useRouteQuery'],
          '@tanstack/vue-query': [
            'useQuery',
            'useQueryClient',
            'useMutation',
            'useInfiniteQuery',
          ],
          'vue-logger-plugin': ['useLogger'],
        },
        VueRouterAutoImports,
      ],
      dts: resolve(__dirname, 'src/types/auto-imports.d.ts'),
      dirs: [
        resolve(__dirname, 'src/composables'),
        resolve(__dirname, 'src/stores'),
      ],
      eslintrc: {
        enabled: true,
        filepath: resolve(__dirname, '.eslintrc-auto-import.js'),
      },
      vueTemplate: true,
      viteOptimizeDeps: false,
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: '../../dist/web',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
