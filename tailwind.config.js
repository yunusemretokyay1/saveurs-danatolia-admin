/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5542F6',
        'highlight': '#007bff',
        'bgGray': '#fbfafd',
        'custom-black': '#0f1111',
      },
    },
  },
  plugins: [],
}
