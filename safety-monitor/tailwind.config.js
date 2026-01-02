import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Enable manual dark mode toggling
  darkMode: ['class', '[data-theme="dark"]'], 
  theme: {
    extend: {},
  },
  plugins: [
    daisyui, // Use the imported variable here instead of require()
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
}