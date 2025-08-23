import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import "./modal.css";

/**
 * @param {object} props
 * @param {preact.ComponentChildren} props.children
 * @param {preact.ComponentChildren} [props.footerChildren]
 * @param {string} [props.title]
 * @param {() => void} [props.onClose]
 */
export default function Modal({
  children,
  footerChildren,
  title = "",
  onClose = () => {},
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
    }

    return () => {
      dialog?.close();
    };
  }, []);

  const handleClose = () => {
    onClose?.();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <dialog
      class="modal"
      ref={dialogRef}
      onClick={handleClose}
      onClose={handleClose}
    >
      <div onClick={stopPropagation} class="modal__flex">
        {title && (
          <div class="modal__title">
            <h1>{title}</h1>
            <button class="modal__close" onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x"
                viewBox="0 0 16 16"
                aria-label="Close"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </button>
          </div>
        )}

        <div class="modal__content">{children}</div>

        {footerChildren && <div class="modal__footer">{footerChildren}</div>}
      </div>
    </dialog>
  );
}
