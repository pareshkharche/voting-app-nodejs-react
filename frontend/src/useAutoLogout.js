import { useEffect, useRef, useCallback } from "react";

// Auto logout after this many milliseconds of inactivity
const INACTIVE_LIMIT = 2 * 60 * 1000; // 2 minutes

export default function useAutoLogout(logout, isLoggedIn) {
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    // Clear existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Start a fresh timer
    timerRef.current = setTimeout(() => {
      logout();
      alert("You have been logged out due to inactivity.");
    }, INACTIVE_LIMIT);
  }, [logout]);

  useEffect(() => {
    // Only run if user is logged in
    if (!isLoggedIn) return;

    // These user actions count as "active"
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart", "click"];

    // Start timer on mount
    resetTimer();

    // Reset timer on every user action
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      // Cleanup on logout or unmount
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [isLoggedIn, resetTimer]);
}