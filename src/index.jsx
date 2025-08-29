import { render, h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";

import "./style.css";
import { NavBar } from "./NavBar/NavBar";
import { getState, Registry } from "./state";
import { Spinner } from "./Spinner/Spinner";
import { detectLanguage } from "./actions";
import { Footer } from "./Footer/Footer";

// We'll dynamically import MonacoEditor when needed
let MonacoEditorComponent = null;

export function App() {
  const registry = getState();
  /** @type {import('preact').RefObject<HTMLDivElement>} */
  const rootNode = useRef();
  const [loading, setLoading] = useState(true);
  const [dropping, setDropping] = useState(false);
  const [droppedValue, setDroppedValue] = useState({ text: "", fileName: "" });

  // Handle lazy loading state
  useEffect(() => {
    if (MonacoEditorComponent) {
      return setLoading(false);
    }
    // Dynamically import MonacoEditor
    import("./MonacoEditor/MonacoEditor").then((module) => {
      MonacoEditorComponent = module.MonacoEditor;
      setLoading(false);
    });
  }, []);

  // Handle drop
  useEffect(() => {
    if (!rootNode.current) {
      return;
    }

    function cancelEvents(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function dragOver(e) {
      cancelEvents(e);
      setDropping(true);
    }

    function dragLeave(e) {
      cancelEvents(e);
      // Only set dropping to false if we're actually leaving the element
      if (e.target === rootNode.current) {
        setDropping(false);
      }
    }

    const handleDrop = (e) => {
      cancelEvents(e);
      setDropping(false); // Reset dropping state when drop occurs

      const files = e.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) =>
        setDroppedValue({
          text: String(event.target.result),
          fileName: file.name,
        });

      reader.readAsText(file);
    };

    const { current } = rootNode;
    current.addEventListener("dragover", dragOver);
    current.addEventListener("dragleave", dragLeave);
    current.addEventListener("drop", handleDrop);

    return () => {
      current.removeEventListener("dragover", dragOver);
      current.removeEventListener("dragleave", dragLeave);
      current.removeEventListener("drop", handleDrop);
    };
  }, [registry.editorRef, rootNode]);

  // wait until the editor is available before setting text
  useEffect(() => {
    const { text, fileName } = droppedValue;
    if (!fileName || !registry.editorRef.value) {
      return;
    }
    registry.editorRef.value.setValue(text);
    detectLanguage(registry, fileName);
  }, [droppedValue, registry.editorRef]);

  return (
    <Registry.Provider value={registry}>
      <div
        class={`app app--${dropping ? "is-dropping" : "not-dropping"}`}
        ref={rootNode}
      >
        <NavBar />
        {loading ? (
          <Spinner />
        ) : (
          <MonacoEditorComponent isDropping={dropping} />
        )}
        <Footer isLoading={loading} />
      </div>
    </Registry.Provider>
  );
}
render(<App />, document.getElementById("app"));

// register service worker at "/workerService.js"
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/workerService.js")
    .then((registration) => {
      console.log("SW registered: ", registration);
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        console.log("Installing new worker");
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New update is available but not yet activated
            console.log("New service worker update available");
            // You could notify the user here
          }
        });
      });
    })
    .catch((registrationError) => {
      console.log("SW registration failed: ", registrationError);
    });
}
