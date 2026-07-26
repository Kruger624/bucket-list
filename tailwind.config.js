/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#FBF6EE',
        card: '#FFFCF5',
        borderSoft: '#E8DCC8',
        ink: '#2C2A26',
        inkMuted: '#83786A',
        tan: '#F3ECDD'
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'ui-serif', 'serif']
      },
      borderRadius: {
        card: '16px'
      }
    }
  },
  plugins: []
}
