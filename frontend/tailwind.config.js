/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      cabinet: ["Cabinet Grotesk", "sans-serif"],
    },

    colors: {
      primary: "#FFB300",
      primary2: "#FFB813",
      dark: "#0A0A0A",
      gray1: "#171717",
      gray2: "#2A2A2A",
      gray3: "#6C6962",
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.5s ease-out forwards',
    },
  },
};
export const plugins = [];
