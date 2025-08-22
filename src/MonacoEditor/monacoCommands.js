import { performAction } from "../actions";

export function initCommands(registry) {
  const editorRef = registry.editorRef.value;

  editorRef.addAction({
    id: "compress",
    label: "Compress code",
    run: () => performAction(registry, "compress", registry.language.value),
  });
  editorRef.addAction({
    id: "prettify",
    label: "Prettify code",
    run: () => performAction(registry, "prettify", registry.language.value),
  });
}
