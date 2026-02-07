/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#ebf2fa',
        'baltic-blue': '#05668d',
        'steel-blue': '#427aa1',
        'sage-green': '#679436',
        'lime-moss': '#a5be00',
        'text-primary': '#0a0908',
      },
    },
  },
  plugins: [],
}
