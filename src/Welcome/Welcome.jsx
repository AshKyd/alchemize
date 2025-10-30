import { useState } from "react";
import packageJson from "../../package.json";
import Modal from "../Modal/Modal";
import "./welcome.css";

/**
 * A welcome modal that's only available for visitors who hit the legacy app sometime
 * in the last couple of months.
 */
export default function Welcome({}) {
  const [isOpen, setIsOpen] = useState(
    (() => {
      try {
        const { hasUsedLegacyApp } = localStorage;
        delete localStorage.hasUsedLegacyApp;
        return !!hasUsedLegacyApp;
      } catch (e) {
        false;
      }
    })()
  );

  const onClose = () => setIsOpen(false);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      onClose={onClose}
      footerChildren={
        <button style="min-width:7em" onClick={onClose}>
          Get started
        </button>
      }
    >
      <div class="welcome">
        <div class="welcome__header welcome__content">
          <img class="welcome__icon" src="/app/favicon.svg" alt="" />

          <h2 class="welcome__heading">
            <span class="welcome__name">{packageJson.displayName}</span>{" "}
            <span class="welcome__version">v{packageJson.version}</span>
          </h2>
          <p class="welcome__description">Welcome to the updated Alchemize</p>
        </div>

        <div class="welcome__body welcome__content">
          <ul class="welcome__features">
            <li>
              <span class="welcome__emoji">♻️</span> Modern tech stack
            </li>
            <li>
              <span class="welcome__emoji">🛠️</span> Industry standard tooling{" "}
              <small>like Prettier and Terser under the hood</small>
            </li>
            <li>
              <span class="welcome__emoji">✨</span> Latest Javascript and CSS
              support
            </li>
            <li>
              <span class="welcome__emoji">📚</span> Better language detection
            </li>
          </ul>
          <p>
            I hope you enjoy it the new version, but please feel free to get in
            touch if you notice something missing.
          </p>
        </div>
      </div>
    </Modal>
  );
}
