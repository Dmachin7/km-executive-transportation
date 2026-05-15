/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'km-black':    '#0A0A0A',
        'km-dark':     '#111111',
        'km-darker':   '#0D0D0D',
        'km-gold':     '#C9A84C',
        'km-gold-lt':  '#D4AF37',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        inter:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'luxury':  '0.3em',
        'widest2': '0.4em',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #D4AF37 50%, #C9A84C 100%)',
      },
    },
  },
  plugins: [],
}
