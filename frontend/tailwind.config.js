/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      cabinet: ["Cabinet Grotesk", "sans-serif"],
      russo: ["Russo One", "sans-serif"],
      urbanist: ["Urbanist", "sans-serif"],
    },

    colors: {
      primary: "#FFB300",
      primary2: "#FFB813",
      dark: "#0A0A0A",
      gray1: "#171717",
      gray2: "#2A2A2A",
      gray3: "#6C6962",
    },
    animation: {
      fadeIn: 'fadeIn 0.5s ease-out forwards',
      'gradient-xy': 'gradient-xy 3s ease infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'gradient-xy': {
        '0%, 100%': {
          'background-size': '400% 400%',
          'background-position': 'left center'
        },
        '50%': {
          'background-size': '400% 400%',
          'background-position': 'right center'
        }
      }
    },
  },
};
export const plugins = [];
