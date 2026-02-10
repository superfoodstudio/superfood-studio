/** @type {import('reshaped').ReshapedConfig} */
const config = {
  themes: {
    superfood: {
      fontFamily: {
        title: { family: "var(--font-nunito)" },
        body: { family: "var(--font-nunito)" }
      },
      color: {
        // Primary colors - using forest green as main brand color
        backgroundPrimary: { hex: "#18540b" },
        foregroundPrimary: { hex: "#18540b" },
        borderPrimary: { hex: "#0f3a07" },
        // Custom border color for outline buttons
        borderButtonOutline: { hex: "#2A0028" },
        // Custom background colors - using cream as main background
        backgroundPage: { hex: "#fef3dc" },
        backgroundPageFaded: { hex: "#F5EDDA" },
        backgroundElevationBase: { hex: "#fdf8ef" },
        // Custom palette colors
        lavender: { hex: "#b98dd8" },
        limeGreen: { hex: "#a7e22c" },
        coralRed: { hex: "#ff404f" },
        charcoal: { hex: "#352c2f" },
        skyBlue: { hex: "#add2f7" },
        forestGreen: { hex: "#18540b" },
        burgundy: { hex: "#77122f" },
        cream: { hex: "#fef3dc" }
      }
    }
  },
  themeOptions: {
    colorContrastAlgorithm: "apca",
  },
};

module.exports = config; 