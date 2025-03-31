/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    colors: {
      color_hover: '#3D3D3D',
      color_button: '#212121',
      Nav_bar: '#2d2d2d',
      Bg_color: '#191919',
    },
    },
  },
  plugins: [],
}