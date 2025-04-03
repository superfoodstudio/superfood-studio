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
        'cream': '#FDF6E3',
        'dark-purple': '#2E1A47',
        'light-purple': '#8B5CF6',
        'orange': '#F59E0B',
        'dark-gray': '#1F2937',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      maxWidth: {
        'content': '1200px',
      },
      spacing: {
        'nav': '80px',
      },
    },
  },
  plugins: [],
};

export default config; 