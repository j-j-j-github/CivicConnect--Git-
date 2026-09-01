import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Trustworthy civic blue
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#F59E0B', // Energetic accent
          light: '#FBBF24',
          dark: '#D97706',
        },
        status: {
          success: '#10B981', // Green
          warning: '#F59E0B', // Yellow
          danger: '#EF4444',  // Red
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
