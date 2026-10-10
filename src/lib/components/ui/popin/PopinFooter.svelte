<script lang="ts">
  // Pied de popin : état à gauche, Annuler et action principale à droite.
  // `bleed` : popin sans `flush`, le pied déborde les marges du corps pour toucher les bords.
  import Icon from "@iconify/svelte";
  import type { Snippet } from "svelte";

  let {
    start,
    end,
    cancelLabel,
    oncancel,
    cancelDisabled = false,
    submitLabel = "",
    submitIcon = "lucide:check",
    onsubmit,
    submitDisabled = false,
    busy = false,
    tone = "accent",
    submitStyle = "",
    bleed = false,
  }: {
    /** Contenu de gauche (état, compteurs), dans la zone extensible. */
    start?: Snippet;
    /** Contenu juste avant les boutons (raccourci clavier…). */
    end?: Snippet;
    cancelLabel: string;
    oncancel: () => void;
    cancelDisabled?: boolean;
    /** Vide : pas de bouton principal. */
    submitLabel?: string;
    submitIcon?: string;
    onsubmit?: () => void;
    submitDisabled?: boolean;
    /** Roue à la place de l'icône du bouton principal. */
    busy?: boolean;
    tone?: "accent" | "danger";
    /** Couleur imposée au bouton principal (teinte d'une playlist). */
    submitStyle?: string;
    bleed?: boolean;
  } = $props();
</script>

<footer
  class="shrink-0 flex items-center gap-3 px-6 py-3.5 border-t border-(--rg-bd) bg-(--rg-creux)
         {bleed ? '-mx-6 -mb-6 mt-6' : ''}"
>
  <div class="flex-1 min-w-0 flex items-center gap-2">
    {@render start?.()}
  </div>

  {@render end?.()}

  <button
    type="button"
    onclick={oncancel}
    disabled={cancelDisabled}
    class="h-10 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-colors
           text-(--rg-tx2) hover:bg-(--rg-hover) hover:text-(--rg-tx)
           disabled:opacity-50 disabled:cursor-default"
  >
    {cancelLabel}
  </button>
  {#if submitLabel}
    <button
      type="button"
      onclick={onsubmit}
      disabled={submitDisabled || busy}
      style={submitStyle}
      class="h-10 pl-4 pr-5 rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 transition
             hover:brightness-110 disabled:opacity-40 disabled:cursor-default
             {tone === 'danger' ? 'bg-red-600 text-white' : 'bg-(--rg-g) text-(--rg-on-g)'}"
    >
      {#if busy}
        <Icon icon="lucide:loader-2" width="17" class="animate-spin" />
      {:else}
        <Icon icon={submitIcon} width="17" />
      {/if}
      {submitLabel}
    </button>
  {/if}
</footer>
