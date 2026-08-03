/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF6F3',
          100: '#D7EBE4',
          200: '#B2D8CB',
          300: '#87BEAF',
          400: '#5CA493',
          500: '#3A8A79',
          600: '#237061',
          700: '#0D4A42',
          800: '#0B3E38',
          900: '#0B3B36',
          950: '#05221F',
        },
        surface: '#FFFFFF',
        canvas: '#FAFAF8',
        ink: '#0F1A18',
        muted: '#475569',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(11, 59, 54, 0.05), 0 4px 6px -2px rgba(11, 59, 54, 0.02)',
        'card': '0 1px 3px 0 rgba(15, 26, 24, 0.06), 0 1px 2px 0 rgba(15, 26, 24, 0.04)',
        'float': '0 10px 25px -5px rgba(11, 59, 54, 0.1), 0 8px 10px -6px rgba(11, 59, 54, 0.05)',
      },
      borderRadius: {
        'card': '1rem',
        'input': '0.625rem',
      }
    },
  },
  plugins: [],
};
