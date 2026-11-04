import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Ensures every page redirect and route change starts from the top (0, 0)
 * rather than preserving the scrolled-down position of the previous page.
 *
 * Handles:
 * 1. Setting history.scrollRestoration = 'manual' to prevent browser fighting
 * 2. Temporarily disabling CSS scroll-behavior: smooth so it snaps to top instantly
 * 3. Smooth scrolling for hash links (#anchor) if present
 * 4. Multi-frame fallback to catch delayed asynchronous rendering or image loading
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable native browser automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // If a hash anchor exists (e.g. #curriculum), scroll to that element smoothly
    if (hash) {
      const elementId = hash.replace("#", "");
      const targetElement = document.getElementById(elementId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Instantly scroll window and document root to the very top
    const resetScroll = () => {
      const html = document.documentElement;
      const prevBehavior = html ? html.style.scrollBehavior : "";
      if (html) html.style.scrollBehavior = "auto";

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      if (html) html.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;

      // Also reset any scrollable content-wrapper
      const wrapper = document.querySelector(".content-wrapper");
      if (wrapper) wrapper.scrollTop = 0;

      // Restore scrollBehavior on next frame
      requestAnimationFrame(() => {
        if (html) html.style.scrollBehavior = prevBehavior;
      });
    };

    // Execute immediately
    resetScroll();

    // Re-verify on the next frame to catch any asynchronous layout shifts
    const rafId = requestAnimationFrame(resetScroll);

    // Fallback timer for delayed page mounting
    const timer = setTimeout(resetScroll, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [pathname, search, hash]);

  return null;
}
