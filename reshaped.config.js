/** @type {import('reshaped').ReshapedConfig} */
const config = {
  themes: {
    superfood: {
      color: {
        foregroundNeutral: { hex: "#1F2937", hexDark: "#FDF6E3" },
        foregroundPrimary: { hex: "#2E1A47", hexDark: "#8B5CF6" },
        backgroundPrimary: { hex: "#2E1A47", hexDark: "#8B5CF6" },
        backgroundPage: { hex: "#FFFFFF", hexDark: "#1F2937" },
        backgroundElevationBase: { hex: "#FDF6E3", hexDark: "#374151" },
      },
      fontFamily: {
        body: { family: "Playfair Display, serif" },
        title: { family: "Playfair Display, serif" },
      },
      font: {
        title1: {
          fontSize: { px: 48 },
          lineHeight: { px: 56 },
          letterSpacing: { px: -1 },
          fontWeightToken: "bold",
          fontFamilyToken: "title",
        },
        title2: {
          fontSize: { px: 36 },
          lineHeight: { px: 44 },
          letterSpacing: { px: -1 },
          fontWeightToken: "bold",
          fontFamilyToken: "title",
        },
        body1: {
          fontSize: { px: 16 },
          lineHeight: { px: 24 },
          fontWeightToken: "regular",
          fontFamilyToken: "body",
        },
      },
    },
  },
  themeOptions: {
    colorContrastAlgorithm: "apca",
  },
};

module.exports = config; 