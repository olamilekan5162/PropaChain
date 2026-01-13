// Design tokens for PropaChain - Jiji-inspired marketplace

export const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: "#0F766E", // Teal - professional, trustworthy
    light: "#14B8A6",
    dark: "#115E59",
    50: "#F0FDFA",
    100: "#CCFBF1",
  },

  // Secondary colors
  secondary: {
    DEFAULT: "#1D3557", // Dark blue - professional, trustworthy
    light: "#2E4A6B",
    dark: "#0F1F33",
  },

  // Neutral colors
  neutral: {
    50: "#F8F9FA",
    100: "#F1F3F5",
    200: "#E9ECEF",
    300: "#DEE2E6",
    400: "#CED4DA",
    500: "#ADB5BD",
    600: "#6C757D",
    700: "#495057",
    800: "#343A40",
    900: "#212529",
  },

  // Status colors
  status: {
    success: "#28A745",
    error: "#DC3545",
    warning: "#FFC107",
    info: "#17A2B8",
    available: "#28A745",
    pending: "#FFC107",
    sold: "#6C757D",
  },

  // Background colors
  background: {
    primary: "#FFFFFF",
    secondary: "#F8F9FA",
    tertiary: "#F1F3F5",
  },

  // Border colors
  border: {
    light: "#E9ECEF",
    DEFAULT: "#DEE2E6",
    dark: "#CED4DA",
  },
};

export const typography = {
  fontFamily: {
    sans: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "sans-serif",
    ],
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
};

export const borderRadius = {
  sm: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  full: "9999px",
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};
