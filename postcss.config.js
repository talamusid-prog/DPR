// PostCSS configuration untuk optimasi CSS
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // PurgeCSS untuk menghapus CSS yang tidak digunakan
    ...(process.env.NODE_ENV === 'production' && {
      '@fullhuman/postcss-purgecss': {
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './src/**/*.html',
          './public/**/*.html'
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: [
          // Keep critical classes
          'html',
          'body',
          'div',
          'span',
          'p',
          'a',
          'img',
          'button',
          'input',
          'form',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          // Keep dynamic classes
          /^bg-/,
          /^text-/,
          /^border-/,
          /^rounded-/,
          /^p-/,
          /^m-/,
          /^w-/,
          /^h-/,
          /^flex/,
          /^grid/,
          /^hidden/,
          /^block/,
          /^inline/,
          /^absolute/,
          /^relative/,
          /^fixed/,
          /^sticky/,
          /^top-/,
          /^left-/,
          /^right-/,
          /^bottom-/,
          /^z-/,
          /^opacity-/,
          /^transform/,
          /^transition/,
          /^duration-/,
          /^ease-/,
          /^hover:/,
          /^focus:/,
          /^active:/,
          /^group/,
          /^animate-/,
          /^lazy/,
          /^loading/,
          /^spinner/
        ],
        // Keep CSS variables
        variables: true,
        // Keep keyframes
        keyframes: true,
        // Keep font-face
        fontFace: true
      }
    })
  }
};