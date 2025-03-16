/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        dark: "#081823",
        chestnut: "#786776",
        darkblue: "#0e2a3f",
        darkdarkblue: "#0d2639",
        brightpale: "#f6d6be",
        pale: "rgb(195, 163, 138)",
        darkpale: "#ad9192",
      },
      fontFamily: {
        philosopher: "Philosopher",
      },
    },
  },
  plugins: [],
};
