/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0a0a',
        surface: '#141414',
        card:    '#1c1c1c',
        border:  '#2a2a2a',
        muted:   '#666',
        accent:  '#f59e0b',
        wa:      '#25D366',
      },
    },
  },
  plugins: [],
}
