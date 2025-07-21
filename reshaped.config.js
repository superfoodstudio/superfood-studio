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
        borderButtonOutline: { hex: "#2A0028" }
      }
    }
  },
  themeOptions: {
    colorContrastAlgorithm: "apca",
  },
};

module.exports = config; 