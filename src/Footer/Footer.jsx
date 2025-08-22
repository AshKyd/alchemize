import { render } from "preact";
import "./footer.css";
import { useContext } from "preact/hooks";
import { languages, Registry } from "../state";

export function Footer({ isLoading }) {
  const registry = useContext(Registry);
  const savings = registry.savings.value;
  const format = languages[registry.language.value];
  const editorLength = registry.editorLength.value;
  const isWorking = registry.isWorking.value;
  const errorMessage = registry.errorMessage.value;

  // Format the size in KB with up to two decimal places
  const sizeInKB = (editorLength / 1024).toFixed(2);

  // Determine the appropriate message to display
  let statusMessage;
  if (isLoading) {
    statusMessage = "Loading editor…";
  } else if (errorMessage) {
    statusMessage = `Error: ${errorMessage.slice(0, 47)}`;
  } else if (savings !== Infinity) {
    // Message when savings !== Infinity
    // Format the savings with up to two decimal places
    const savingsInKB = (Math.abs(savings) / 1024).toFixed(2);
    const savingsType = savings >= 0 ? "saving" : "increased by";
    statusMessage = `${format} - New size: ${sizeInKB} KB, ${savingsType} ${savingsInKB} KB`;
  } else if (editorLength > 0) {
    // Message when editor has content
    statusMessage = `${format} - ${sizeInKB} KB`;
  } else {
    // DEFAULT message
    statusMessage = `${format} - Drag a file or paste from the clipboard`;
  }

  return (
    <footer class="footer" aria-live="polite">
      <div class="footer__status">{statusMessage}</div>
      <div>{isWorking && <progress />}</div>
    </footer>
  );
}
