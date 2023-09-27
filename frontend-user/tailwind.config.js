/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xxxs: "290px",
      xxs: "319px",
      xms: "375px",
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1270px",
      "2xl": "1536px",
    },
    extend: {
      // screens: {
      //   // xxxs: { min: "290px", max: "318px" },
      //   // xxs: { min: "319px", max: "479px" },
      //   // xxs: { min: "480px", max: "639px" },

      //   xxxs: "290px",
      //   xxs: "319px",
      //   xs: "480px",
      //   sm: "640px",
      //   md: "768px",
      //   lg: "1024px",
      //   xl: "1270px",
      //   "2xl": "1536px",
      // },
      fontFamily: {
        primary: ["Inter", ...fontFamily.sans],
      },
      colors: {
        primary: {
          // Customize it on globals.css :root
          50: "rgb(var(--tw-color-primary-50) / <alpha-value>)",
          100: "rgb(var(--tw-color-primary-100) / <alpha-value>)",
          200: "rgb(var(--tw-color-primary-200) / <alpha-value>)",
          300: "rgb(var(--tw-color-primary-300) / <alpha-value>)",
          400: "rgb(var(--tw-color-primary-400) / <alpha-value>)",
          500: "rgb(var(--tw-color-primary-500) / <alpha-value>)",
          600: "rgb(var(--tw-color-primary-600) / <alpha-value>)",
          700: "rgb(var(--tw-color-primary-700) / <alpha-value>)",
          800: "rgb(var(--tw-color-primary-800) / <alpha-value>)",
          900: "rgb(var(--tw-color-primary-900) / <alpha-value>)",
        },
        alpha: {
          // Customize it on globals.css :root
          primary: "rgb(var(--tw-color-alpha-primary) / <alpha-value>)",
        },
        bita: {
          // Customize it on globals.css :root
          primary: "rgb(var(--tw-color-bita-primary) / <alpha-value>)",
        },
        gama: {
          // Customize it on globals.css :root
          primary: "rgb(var(--tw-color-gama-primary) / <alpha-value>)",
        },
        omega: {
          // Customize it on globals.css :root
          primary: "rgb(var(--tw-color-omega-primary) / <alpha-value>)",
        },
        delta: {
          // Customize it on globals.css :root
          primary: "rgb(var(--tw-color-delta-primary) / <alpha-value>)",
        },
        secondary: {
          // Customize it on globals.css :root
          50: "rgb(var(--tw-color-secondary-50) / <alpha-value>)",
          100: "rgb(var(--tw-color-secondary-100) / <alpha-value>)",
          200: "rgb(var(--tw-color-secondary-200) / <alpha-value>)",
          300: "rgb(var(--tw-color-secondary-300) / <alpha-value>)",
          400: "rgb(var(--tw-color-secondary-400) / <alpha-value>)",
          500: "rgb(var(--tw-color-secondary-500) / <alpha-value>)",
          600: "rgb(var(--tw-color-secondary-600) / <alpha-value>)",
          700: "rgb(var(--tw-color-secondary-700) / <alpha-value>)",
          800: "rgb(var(--tw-color-secondary-800) / <alpha-value>)",
          900: "rgb(var(--tw-color-secondary-900) / <alpha-value>)",
        },

        dark: "#222222",
      },
      keyframes: {
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: 0.99,
            filter:
              "drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: 0.4,
            filter: "none",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-700px 0",
          },
          "100%": {
            backgroundPosition: "700px 0",
          },
        },
      },
      animation: {
        flicker: "flicker 3s linear infinite",
        shimmer: "shimmer 1.3s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
