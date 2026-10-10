// Un seul observateur pour toutes les images : le rappel part quand l'élément approche de l'écran.
const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const callback = callbacks.get(entry.target);
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
        callback?.();
      }
    },
    { rootMargin: "600px" },
  );
  return observer;
}

/** Appelle `callback` une fois, quand `el` arrive à moins de 600 px de l'écran ; rend de quoi annuler. */
export function whenNearViewport(el: Element, callback: () => void): () => void {
  callbacks.set(el, callback);
  getObserver().observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}
