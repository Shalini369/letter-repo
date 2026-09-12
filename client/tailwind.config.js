/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF6EA",
        parchment: "#FFF0DC",
        blush: "#FFD6E8",
        petal: "#FFB5C6",
        mint: "#B8E8D4",
        sky: "#AEDFF7",
        lilac: "#C9B6E4",
        marigold: "#F4C95D",
        coral: "#FFA69E",
        ink: "#4A3B32",
        inkLight: "#7A6A5D",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        hand: ["'Patrick Hand'", "cursive"],
        body: ["'Quicksand'", "sans-serif"],
      },
      boxShadow: {
        pixel: "4px 4px 0 0 #4A3B32",
        "pixel-sm": "2px 2px 0 0 #4A3B32",
        "pixel-lg": "6px 6px 0 0 #4A3B32",
        "pixel-inset": "inset 2px 2px 0 0 rgba(74,59,50,0.25)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 2s ease-in-out infinite",
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [],
};
