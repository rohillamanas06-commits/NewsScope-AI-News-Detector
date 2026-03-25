import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const SCROLL_TO_TOP_PATHS = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/learn"
];

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

};

export default ScrollToTop;
