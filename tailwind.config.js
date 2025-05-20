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
        primary: '#FFFFFF',
        secondary: '#F8F9FB',
        accent1: '#32C8CD',
        accent2: '#2A3FFB',
        accent3: '#9747FF',
        text: '#1A1A2E',
        shadow: 'rgba(0,0,0,0.05)',
      },
      fontFamily: {
        sans: ['var(--font-satoshi)', 'var(--font-general-sans)', 'sans-serif'],
        display: ['var(--font-clash-display)', 'var(--font-satoshi)', 'sans-serif'],
        mono: ['var(--font-neue-montreal)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 