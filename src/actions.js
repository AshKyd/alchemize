import workerClient from "./converters/index";
export function performAction(editorRef, action = "", language = "") {
  const text = editorRef.getValue();

  workerClient
    .push(
      action,
      {
        language,
        text,
      },
      []
    )
    .then(({ res, error }) => {
      if (error) {
        alert(error);
      }
      if (res) {
        editorRef.setValue(res);
        // Put the cursor at the very start of the editor
        editorRef.setPosition({ lineNumber: 1, column: 1 });
        editorRef.revealPosition({ lineNumber: 1, column: 1 });
      }
    });
}
