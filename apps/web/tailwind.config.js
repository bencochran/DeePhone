/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'phone-ping': {
          '75%, 100%': {
            transform: 'scale(1.6) translate(7%, -7%)',
            opacity: 0,
          },
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'phone-ping': 'phone-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
