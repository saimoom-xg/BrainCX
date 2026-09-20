import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0a0a0a',
        'surface-raised': '#111111',
        ink: '#fafafa',
        muted: 'rgba(255,255,255,0.5)',
        subtle: 'rgba(255,255,255,0.25)',
        accent: '#10b981',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
        display: [
          'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"',
          'Roboto', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;