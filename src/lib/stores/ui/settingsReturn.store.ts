// Dernière page visitée hors des réglages : le bouton « Retour » des réglages y ramène.
// Suivie par la mise en page principale, toujours montée, plutôt que par les réglages eux-mêmes.
let lastOutside = "/";

export function rememberPage(url: URL): void {
  if (!url.pathname.startsWith("/settings")) lastOutside = url.pathname + url.search;
}

export function settingsReturnUrl(): string {
  return lastOutside;
}
