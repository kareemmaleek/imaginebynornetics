

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './_components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    
  ],
  theme: {
    extend: {

      colors: {
        'mainColor' : '#172a32',
        'secondaryColor' : '#1a313b',
        'acsentColor' : '#89beac',
        'thirdColor': '#BAC7CE'
      }
    },
  },
  plugins: [],
}
