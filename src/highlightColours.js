import pSBC from "shade-blend-color";

let highlightColours;

/**
 * Gets the highlight colors based on the SelectedItem system color.
 * @returns {{highlight: string, highlightDark: string, highlightDarkest: string, highlightLight: string, highlightLightest: string}} Object containing highlight colors
 */
export function getHighlightColours() {
  if (highlightColours) {
    return highlightColours;
  }
  const div = document.createElement("div");
  div.style = "background-color:SelectedItem";
  document.body.appendChild(div);
  const color = getComputedStyle(div).backgroundColor;
  document.body.removeChild(div);
  highlightColours = {
    highlight: pSBC(0, color, "#000000"),
    highlightDark: pSBC(-0.2, color, "#000000"),
    highlightDarkest: pSBC(-0.5, color, "#000000"),
    highlightLight: pSBC(0.2, color, "#ffffff"),
    highlightLightest: pSBC(0.8, color, "#ffffff"),
  };
  return highlightColours;
}
