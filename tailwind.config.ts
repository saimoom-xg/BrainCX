import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#101714', mint: '#b9f6d2', paper: '#f3f0e8' },
      fontFamily: { sans: ['var(--font-dm-sans)'], display: ['var(--font-space-grotesk)'] },
    },
  },
  plugins: [],
};

export default config;