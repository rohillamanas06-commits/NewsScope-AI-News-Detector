import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const SCROLL_TO_TOP_PATHS = [
  "/about",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/learn"
];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Set scrollRestoration to auto for browser back/forward
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    };
  }, []);

  useEffect(() => {
    // Only scroll to top on PUSH or REPLACE, not POP (back/forward)
    if ((navigationType === "PUSH" || navigationType === "REPLACE") && SCROLL_TO_TOP_PATHS.includes(pathname)) {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
