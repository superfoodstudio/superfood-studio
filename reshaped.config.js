/** @type {import('reshaped').ReshapedConfig} */
const config = {
  themes: {
    superfood: {
      fontFamily: {
        title: { family: "var(--font-nunito)" },
        body: { family: "var(--font-nunito)" }
      },
      color: {
        backgroundPrimary: { hex: "#AC83DB" },
        foregroundPrimary: { hex: "#AC83DB" },
        borderPrimary: { hex: "#AC83DB" },
        borderButtonOutline: { hex: "#4C263C" },
        backgroundPage: { hex: "#FDEEE4" },
        backgroundPageFaded: { hex: "#f5e6da" },
        backgroundElevationBase: { hex: "#FDEEE4" },
        lavender: { hex: "#AC83DB" },
        limeGreen: { hex: "#CAD844" },
        coralRed: { hex: "#EF5C54" },
        charcoal: { hex: "#002A29" },
        skyBlue: { hex: "#74C4C2" },
        forestGreen: { hex: "#002A29" },
        burgundy: { hex: "#4C263C" },
        cream: { hex: "#FDEEE4" }
      }
    }
  },
  themeOptions: {
    colorContrastAlgorithm: "apca",
  },
};

module.exports = config;
