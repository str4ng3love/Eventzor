/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        smoothLR: "1rem 0rem 0rem 0rem",
      },
      colors: {
        link: "var(--link)",
        link_active: "var(--link-active)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        bg: "var(--bg)",
        bg_interactive: "var(--bg-interactive)",
        bg_sidebar: "var(--bg-sidebar)",
        text: "var(--text)",
        interactive_text: "var(--interactive-text)",
      },
      boxShadow: {
        link: "var(--shadow-link)",
      },
      keyframes: {
        rotateRight: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },

          "100%": {
            opacity: "100",
          },
        },
        fadeOut: {
          "0%": {
            opacity: "100",
          },

          "100%": {
            opacity: "0",
          },
        },
        growAndShrink: {
          "0%, 100%": {
            "margin-top": "0rem",
            opacity: "0",
            height: "0rem",
          },
          "10%": {
            opacity: "0",
            height: "3.3rem",
          },
          "20%": {
            "margin-top": "1rem",
            opacity: "1",
          },
          "80%": {
            "margin-top": "1rem",
            opacity: "1",
          },
          "90%": {
            opacity: "0",
            height: "3.3rem",
          },
        },
      },
      animation: {
        rotateRight: "rotateRight linear 10s infinite",
        fadeIn: "fadeIn ease-in-out 500ms forwards",
        fadeOut: "fadeOut ease-in-out 500ms forwards",
        growAndShrink: "growAndShrink ease-in-out 5s forwards",
        pingSlower: "ping 6s cubic-bezier(0, 0, 0.2, 1) infinite",
        pingSlower2: "ping 6s 3s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};
