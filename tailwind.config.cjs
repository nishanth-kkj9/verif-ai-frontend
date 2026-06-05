/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xl: '16px',
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.4s ease-out forwards',
        'softPulseRing': 'softPulseRing 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        softPulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(99,102,241,0)' },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
