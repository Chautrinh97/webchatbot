import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      zIndex: {
        '100': '100',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'sb-white': '#f9f9f9',
        'sb-black': '#171717'
      },
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, -100%, 0)",
          },
          "100%": {
            opacity: "100",
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-in-bouncedown": {
          "0%": {
            opacity: "0",
            transform: "translate3d(0%, -100%, 0)",
          },
          "33%": {
            opacity: "50",
            transform: "translate3d(0%, 0%, 0)",
          },
          "66%": {
            opacity: "70",
            transform: "translate3d(0%, -20%, 0)",
          },
          "100%": {
            opacity: "100",
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, 100%, 0)",
          },
          "100%": {
            opacity: "100",
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-out-down": {
          "0%": {
            opacity: "100",
          },
          "100%": {
            opacity: "0",
            transform: "translate3d(0, 100%, 0)",
          },
        },
        "bounce-up-down": {
          "0%": {
            transform: "translate3d(0%, 0%, 0)",
          },
          "50%": {
            transform: "translate3d(0%, 20%, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        shake: {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "10%, 30%, 50%, 70%, 90%": {
            transform: "translateX(-10px)",
          },
          "20%, 40%, 60%, 80%": {
            transform: "translateX(10px)",
          },
        },
      },
      animation: {
        fadeindown: 'fade-in-down 1s ease-in 0.25s 1',
        fadeinbouncedown: 'fade-in-bouncedown 1s ease-in-out 0.25s 1',
        fadeinup: 'fade-in-up 1s ease-in-out 0.25s 1',
        fadeoutdown: 'fade-out-down 1s ease-in-out 0.25s 1',
        bounceupdown: 'bounce-up-down 1.25s ease-in-out 0.25s infinite',
        shake: 'shake 0.6s ease-in-out 0.25s 1',
      }
    },
  },
  plugins: [
    nextui(),
  ],
  darkMode: "selector",
};
export default config;
