import pSBC from "shade-blend-color";

let highlightColours;

/**
 * Gets the highlight colors from the CSS
 * @returns {{highlight: string, highlightDark: string, highlightDarkest: string, highlightLight: string, highlightLightest: string}} Object containing highlight colors
 */
export function getHighlightColours() {
  if (highlightColours) {
    return highlightColours;
  }
  const style = getComputedStyle(document.documentElement);

  highlightColours = {
    highlight: style.getPropertyValue(`--highlight`),
    highlightDark: style.getPropertyValue(`--highlightDark`),
    highlightDarkest: style.getPropertyValue(`--highlightDarkest`),
    highlightLight: style.getPropertyValue(`--highlightLight`),
    highlightLightest: style.getPropertyValue(`--highlightLightest`),
  };

  return highlightColours;
}
