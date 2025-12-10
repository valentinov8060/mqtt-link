/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#2F80ED";
const tintColorDark = "#5E9EFF";

export const Colors = {
  light: {
    text: "#1C1C1E",
    background: "#FFFFFF",
    card: "#F5F7FA",
    border: "#D6D9DD",
    tint: tintColorLight,
    icon: "#5C5F62",
    tabIconDefault: "#8A8D91",
    tabIconSelected: tintColorLight,

    // extra palette
    success: "#27AE60",
    danger: "#EB5757",
    warning: "#F2C94C",
  },

  dark: {
    text: "#ECEDEE",
    background: "#0F1113",
    card: "#1B1D1F",
    border: "#323436",
    tint: tintColorDark,
    icon: "#A9ACB0",
    tabIconDefault: "#7C8084",
    tabIconSelected: tintColorDark,

    // extra palette
    success: "#6FCF97",
    danger: "#FF6B6B",
    warning: "#F2D16B",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
