import { useEffect, useRef } from "react";

/**
 * Hook that invokes a handler when a click/touch event occurs outside the specified element(s).
 */
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
  additionalIgnoredRef?: React.RefObject<HTMLElement | null>,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (ref.current && ref.current.contains(target)) {
        return;
      }

      if (
        additionalIgnoredRef?.current &&
        additionalIgnoredRef.current.contains(target)
      ) {
        return;
      }

      handlerRef.current(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [enabled, additionalIgnoredRef]);

  return ref;
}
