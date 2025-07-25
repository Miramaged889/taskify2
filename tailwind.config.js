/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Orange - Main brand color
        primary: {
          50: "#fef7ee",
          100: "#fdedd3",
          200: "#fbd8a5",
          300: "#f7bc6d",
          400: "#f39532",
          500: "#f0760a",
          600: "#e15a00",
          700: "#ba4502",
          800: "#943708",
          900: "#782f0a",
          950: "#451a05",
        },
        // Secondary Blue - Supporting color
        secondary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        // Success Green
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Warning Yellow/Orange
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Error Red
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // Accent Purple/Magenta
        accent: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
          950: "#4a044e",
        },
        // Info Blue
        info: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        // Enhanced Neutral Grays
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "sans-serif"],
        english: ["Inter", "sans-serif"],
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceIn: {
          "0%": {
            transform: "scale(0.3)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.8",
          },
          "70%": {
            transform: "scale(0.9)",
            opacity: "0.9",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(240, 118, 10, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(240, 118, 10, 0.6)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-happy":
          "linear-gradient(135deg, #f0760a 0%, #d946ef 50%, #0ea5e9 100%)",
        "gradient-warm": "linear-gradient(135deg, #f39532 0%, #10b981 100%)",
        "gradient-cool": "linear-gradient(135deg, #38bdf8 0%, #d946ef 100%)",
        "gradient-primary": "linear-gradient(135deg, #f39532 0%, #f0760a 100%)",
        "gradient-success": "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
        "gradient-info": "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
        "gradient-accent": "linear-gradient(135deg, #e879f9 0%, #d946ef 100%)",
        "gradient-warning": "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        "gradient-error": "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(240, 118, 10, 0.3)",
        "glow-lg": "0 0 40px rgba(240, 118, 10, 0.4)",
        "glow-xl": "0 0 60px rgba(240, 118, 10, 0.5)",
        "accent-glow": "0 0 20px rgba(217, 70, 239, 0.3)",
        "accent-glow-lg": "0 0 40px rgba(217, 70, 239, 0.4)",
        "success-glow": "0 0 20px rgba(16, 185, 129, 0.3)",
        "success-glow-lg": "0 0 40px rgba(16, 185, 129, 0.4)",
        "info-glow": "0 0 20px rgba(14, 165, 233, 0.3)",
        "info-glow-lg": "0 0 40px rgba(14, 165, 233, 0.4)",
        "warning-glow": "0 0 20px rgba(245, 158, 11, 0.3)",
        "error-glow": "0 0 20px rgba(239, 68, 68, 0.3)",
        soft: "0 2px 15px rgba(0, 0, 0, 0.08)",
        medium: "0 4px 25px rgba(0, 0, 0, 0.12)",
        hard: "0 8px 35px rgba(0, 0, 0, 0.15)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      zIndex: {
        100: "100",
      },
    },
  },
  safelist: [
    // Ensure all color utilities are generated
    "text-primary-50",
    "text-primary-100",
    "text-primary-200",
    "text-primary-300",
    "text-primary-400",
    "text-primary-500",
    "text-primary-600",
    "text-primary-700",
    "text-primary-800",
    "text-primary-900",
    "bg-primary-50",
    "bg-primary-100",
    "bg-primary-200",
    "bg-primary-300",
    "bg-primary-400",
    "bg-primary-500",
    "bg-primary-600",
    "bg-primary-700",
    "bg-primary-800",
    "bg-primary-900",
    "border-primary-50",
    "border-primary-100",
    "border-primary-200",
    "border-primary-300",
    "border-primary-400",
    "border-primary-500",
    "border-primary-600",
    "border-primary-700",
    "border-primary-800",
    "border-primary-900",

    "text-accent-50",
    "text-accent-100",
    "text-accent-200",
    "text-accent-300",
    "text-accent-400",
    "text-accent-500",
    "text-accent-600",
    "text-accent-700",
    "text-accent-800",
    "text-accent-900",
    "bg-accent-50",
    "bg-accent-100",
    "bg-accent-200",
    "bg-accent-300",
    "bg-accent-400",
    "bg-accent-500",
    "bg-accent-600",
    "bg-accent-700",
    "bg-accent-800",
    "bg-accent-900",
    "border-accent-50",
    "border-accent-100",
    "border-accent-200",
    "border-accent-300",
    "border-accent-400",
    "border-accent-500",
    "border-accent-600",
    "border-accent-700",
    "border-accent-800",
    "border-accent-900",

    "text-info-50",
    "text-info-100",
    "text-info-200",
    "text-info-300",
    "text-info-400",
    "text-info-500",
    "text-info-600",
    "text-info-700",
    "text-info-800",
    "text-info-900",
    "bg-info-50",
    "bg-info-100",
    "bg-info-200",
    "bg-info-300",
    "bg-info-400",
    "bg-info-500",
    "bg-info-600",
    "bg-info-700",
    "bg-info-800",
    "bg-info-900",
    "border-info-50",
    "border-info-100",
    "border-info-200",
    "border-info-300",
    "border-info-400",
    "border-info-500",
    "border-info-600",
    "border-info-700",
    "border-info-800",
    "border-info-900",

    "text-neutral-50",
    "text-neutral-100",
    "text-neutral-200",
    "text-neutral-300",
    "text-neutral-400",
    "text-neutral-500",
    "text-neutral-600",
    "text-neutral-700",
    "text-neutral-800",
    "text-neutral-900",
    "bg-neutral-50",
    "bg-neutral-100",
    "bg-neutral-200",
    "bg-neutral-300",
    "bg-neutral-400",
    "bg-neutral-500",
    "bg-neutral-600",
    "bg-neutral-700",
    "bg-neutral-800",
    "bg-neutral-900",
    "border-neutral-50",
    "border-neutral-100",
    "border-neutral-200",
    "border-neutral-300",
    "border-neutral-400",
    "border-neutral-500",
    "border-neutral-600",
    "border-neutral-700",
    "border-neutral-800",
    "border-neutral-900",

    "text-success-50",
    "text-success-100",
    "text-success-200",
    "text-success-300",
    "text-success-400",
    "text-success-500",
    "text-success-600",
    "text-success-700",
    "text-success-800",
    "text-success-900",
    "bg-success-50",
    "bg-success-100",
    "bg-success-200",
    "bg-success-300",
    "bg-success-400",
    "bg-success-500",
    "bg-success-600",
    "bg-success-700",
    "bg-success-800",
    "bg-success-900",

    "text-warning-50",
    "text-warning-100",
    "text-warning-200",
    "text-warning-300",
    "text-warning-400",
    "text-warning-500",
    "text-warning-600",
    "text-warning-700",
    "text-warning-800",
    "text-warning-900",
    "bg-warning-50",
    "bg-warning-100",
    "bg-warning-200",
    "bg-warning-300",
    "bg-warning-400",
    "bg-warning-500",
    "bg-warning-600",
    "bg-warning-700",
    "bg-warning-800",
    "bg-warning-900",

    "text-error-50",
    "text-error-100",
    "text-error-200",
    "text-error-300",
    "text-error-400",
    "text-error-500",
    "text-error-600",
    "text-error-700",
    "text-error-800",
    "text-error-900",
    "bg-error-50",
    "bg-error-100",
    "bg-error-200",
    "bg-error-300",
    "bg-error-400",
    "bg-error-500",
    "bg-error-600",
    "bg-error-700",
    "bg-error-800",
    "bg-error-900",

    // Gradient backgrounds
    "bg-gradient-happy",
    "bg-gradient-warm",
    "bg-gradient-cool",
    "bg-gradient-primary",
    "bg-gradient-success",
    "bg-gradient-info",
    "bg-gradient-accent",
    "bg-gradient-warning",
    "bg-gradient-error",

    // Shadow utilities
    "shadow-glow",
    "shadow-glow-lg",
    "shadow-glow-xl",
    "shadow-accent-glow",
    "shadow-accent-glow-lg",
    "shadow-success-glow",
    "shadow-success-glow-lg",
    "shadow-info-glow",
    "shadow-info-glow-lg",
    "shadow-warning-glow",
    "shadow-error-glow",

    // Animation utilities
    "animate-slide-in",
    "animate-fade-in",
    "animate-bounce-in",
    "animate-pulse-slow",
    "animate-wiggle",
    "animate-float",
    "animate-glow",
  ],
  plugins: [],
};
