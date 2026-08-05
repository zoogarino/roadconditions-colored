import { useCallback, useEffect, useState } from "react";

const KEY = "pgn-web-signed-in";

/**
 * Prototype-only auth state. Persisted in localStorage so the guest/signed-in
 * toggle in the site header carries across the web pages.
 */
export const useWebAuthDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem(KEY) === "true");

  useEffect(() => {
    localStorage.setItem(KEY, String(isLoggedIn));
  }, [isLoggedIn]);

  const toggle = useCallback(() => setIsLoggedIn(v => !v), []);

  return { isLoggedIn, isGuest: !isLoggedIn, toggle, setIsLoggedIn };
};
