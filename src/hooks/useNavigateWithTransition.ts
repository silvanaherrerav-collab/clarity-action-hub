import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

/**
 * Wraps navigate with a subtle delay + fade-out on the current page.
 */
export const useNavigateWithTransition = () => {
  const navigate = useNavigate();

  const navigateWithTransition = useCallback(
    (to: string | number, delay = 300) => {
      const root = document.getElementById("page-transition-root");
      if (root) {
        root.style.transition = "opacity 300ms ease, transform 300ms ease";
        root.style.opacity = "0";
        root.style.transform = "translateY(-10px)";
      }
      setTimeout(() => {
        if (typeof to === "number") {
          navigate(to);
        } else {
          navigate(to);
        }
      }, delay);
    },
    [navigate]
  );

  return navigateWithTransition;
};
