/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: "#172a32",
        secondaryColor: "#1a313b",
        acsentColor: "#89beac",
        thirdColor: "#BAC7CE",
        acsentBtn: "#2e3e49",
      },
      backgroundImage: {
        ibnerror:
          "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
      },
    },
  },
  plugins: [],
};
