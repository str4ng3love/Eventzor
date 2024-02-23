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
        "item-hero": 'url("/images/hero_item.jpeg")',
        lips: 'url("/images/lips.svg")',
        "event-hero": 'url("/images/hero_event.jpeg")',
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-grid":
          "linear-gradient(90deg , var(--primary) 1%, transparent 5%), linear-gradient(270deg, var(--primary) 1%, transparent 5%), linear-gradient(180deg , var(--primary) 1%, transparent 5%), linear-gradient(0deg, var(--primary) 1%, transparent 5%)",
      },
      backgroundSize: {
        "3x3": "3rem 3rem",
        "6x6": "6rem 6rem",
      },
      borderRadius: {
        smoothLT: "1rem 0rem 0rem 0rem",
        smoothL: "1rem 0rem 0rem 1rem",
        smoothR: "0rem 0.3rem 0.3rem 0rem",
        smoothLR: "0.3rem 0.3rem 0.3rem 0.3rem",
      },
      colors: {
        link: "var(--link)",
        link_active: "var(--link-active)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        bg: "var(--bg)",
        interactive: "var(--interactive)",
        sidebar: "var(--sidebar)",
        text: "var(--text)",
        contrast: "var(--contrast)",
        interactive: "var(--interactive)",
        inactive: "var(--inactive)",
        text_button: "var(--button-text)",
      },
      boxShadow: {
        link: "var(--shadow-link)",
        omni: "var(--shadow-omni)",
      },
      dropShadow: {
        white_omni: "0px 0px 5px white",
      },
      minHeight: {
        screenReducedBy4p5Rem: [
          "calc(100vh - 4.5rem)",
          "calc(100dvh - 4.5rem)",
        ],
        screenReducedBy6Rem: ["calc(100vh - 6rem)", "calc(100dvh - 6rem)"],
        screenReducedBy50percent: ["calc(100vh - 50%)", "calc(100dvh - 50%)"],
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
        fadeInto50: {
          "0%": {
            opacity: "0",
          },

          "50%": {
            opacity: "100",
          },
        },
        fadeOutto50: {
          "0%": {
            opacity: "100",
          },

          "50%": {
            opacity: "0",
          },
        },
        translateRight: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "75%": {
            transform: "translateX(10%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
        translateLeft: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "75%": {
            transform: "translateX(-210%)",
          },
          "100%": {
            transform: "translateX(-200%)",
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
        gridMove: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "25%": {
            backgroundPosition: "50% 0%",
          },
          "50%": {
            backgroundPosition: "0% -50%",
          },
          "75%": {
            backgroundPosition: "-50% 0%",
          },
        },
        gridMoveInverted: {
          "0%, 100%": {
            backgroundPosition: "0% -100%",
          },
          "25%": {
            backgroundPosition: "-100% 0%",
          },
          "50%": {
            backgroundPosition: "0% 100%",
          },
          "75%": {
            backgroundPosition: "100% 0%",
          },
        },
      },
      animation: {
        rotateRight: "rotateRight linear 10s infinite",
        fadeIn: "fadeIn ease-in-out 500ms forwards",
        fadeOut: "fadeOut ease-in-out 500ms forwards",
        fadeIn300: "fadeIn ease-in-out 300ms forwards",
        fadeOut300: "fadeOut ease-in-out 300ms forwards",
        fadeInto50: "fadeInto50 ease-in-out 1s forwards",
        fadeOutto50: "fadeOutto50 ease-in-out 1s forwards",
        growAndShrink: "growAndShrink ease-in-out 5s forwards",
        pingSlower: "ping 6s cubic-bezier(0, 0, 0.2, 1) infinite",
        pingSlower2: "ping 6s 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        gridMove: "gridMove linear 150s infinite",
        gridMoveInverted: "gridMoveInverted linear 150s infinite",
        translateRight: "translateRight ease-out 200ms forwards",
        translateLeft: "translateLeft ease-out 200ms forwards",
      },
    },
  },
  plugins: [],
};
