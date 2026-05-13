/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E5E7EB",
        secondary: "#9CA3AF",
        muted: "#6B7280",
        bg: "#000000",
      },
      fontFamily: {
        heading: ["Bungee", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
