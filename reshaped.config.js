/** @type {import('reshaped').ReshapedConfig} */
const config = {
  themes: {
    superfood: {
      fontFamily: {
        title: { family: "var(--font-big-caslon, 'Big Caslon', serif)" },
        body: { family: "var(--font-lato, 'Lato', sans-serif)" },
        button: { family: "var(--font-carrois-gothic, 'Carrois Gothic SC', sans-serif)" }
      },
      color: {
        // Custom border color for outline buttons
        borderButtonOutline: { hex: "#2A0028" },
        // Custom background colors - swap page and elevation
        backgroundPage: { hex: "#FDF6E3" },
        backgroundPageFaded: { hex: "#F5EDDA" },
        backgroundElevationBase: { hex: "#ffffff" }
      }
    }
  },
  themeOptions: {
    colorContrastAlgorithm: "apca",
  },
};

module.exports = config; 