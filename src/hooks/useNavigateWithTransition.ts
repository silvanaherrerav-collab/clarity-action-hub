import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

/**
 * Wraps navigate with a subtle delay + fade-out on the current page.
 * Apply a CSS class to the root element to trigger fade-out.
 */
export const useNavigateWithTransition = () => {
  const navigate = useNavigate();

  const navigateWithTransition = useCallback(
    (to: string, delay = 300) => {
      // Fade out current page
      const root = document.getElementById("page-transition-root");
      if (root) {
        root.style.transition = "opacity 300ms ease, transform 300ms ease";
        root.style.opacity = "0";
        root.style.transform = "translateY(-10px)";
      }
      setTimeout(() => navigate(to), delay);
    },
    [navigate]
  );

  return navigateWithTransition;
};
