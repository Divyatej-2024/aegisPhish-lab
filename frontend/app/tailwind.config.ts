import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#111827',
        primary: '#3b82f6',
        secondary: '#22c55e',
        muted: '#94a3b8',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(56, 189, 248, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
