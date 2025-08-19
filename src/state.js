import { useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useEffect } from "preact/hooks";
export function getState() {
  const theme = useSignal(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e) => {
      theme.value = e.matches ? "dark" : "light";
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return { theme };
}

export const Registry = createContext({
  theme: {
    value: "light",
  },
});
