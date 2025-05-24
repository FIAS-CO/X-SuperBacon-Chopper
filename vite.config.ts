import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const shouldObfuscate = mode === 'production' || mode === 'staging'

  return {
    plugins: [
      react(),
      // 本番環境でのみ難読化を適用
      shouldObfuscate && obfuscatorPlugin({
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        exclude: [/node_modules/],
        apply: 'build',
        debugger: true,
        options: {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: false,
          debugProtection: false,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          renameGlobals: false,
          selfDefending: false,
          stringArray: true,
          rotateStringArray: true,
          shuffleStringArray: true,
          splitStrings: false,
          stringArrayThreshold: 0.75,
          transformObjectKeys: false,
          unicodeEscapeSequence: false
        }
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      sourcemap: !shouldObfuscate,
      minify: shouldObfuscate ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: shouldObfuscate,
          drop_debugger: shouldObfuscate
        }
      }
    }
  }
})