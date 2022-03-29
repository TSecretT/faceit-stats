module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
        "primary": "#141616",
        "secondary": "#323838",
        "accent": "#FF5500",
        "neutral": "#1B1D1D",
        "info": "#2463EB",
        "base-100": "#212121",
        "success": "#16A249",
        "warning": "#DB7706",
        "error": "#DC2828",
        },
      },
    ],
  },
}
