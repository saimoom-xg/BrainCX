import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#ffffff',
        'surface-raised': '#ffffff',
        ink: '#1e293b',
        muted: '#64748b',
        subtle: '#94a3b8',
        accent: '#7c3aed',
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