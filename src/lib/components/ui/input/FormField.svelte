<script lang="ts">
  // Champ de formulaire de popin : libellé en capitales, mention obligatoire ou facultative, erreur dessous.
  import Icon from "@iconify/svelte";
  import type { Snippet } from "svelte";

  let { label, for: cible, required = false, optional = "", error = "", children }: {
    label: string;
    for?: string;
    required?: boolean;
    /** Texte « (facultatif) », vide pour ne rien afficher. */
    optional?: string;
    /** Message déjà traduit. */
    error?: string;
    children: Snippet;
  } = $props();
</script>

<div class="flex flex-col gap-2">
  <label for={cible} class="text-[11px] font-bold uppercase tracking-[0.1em] text-(--rg-mu)">
    {label}
    {#if required}<span class="text-red-500">*</span>{/if}
    {#if optional}<span class="normal-case font-medium tracking-normal text-(--rg-mu2)">{optional}</span>{/if}
  </label>
  {@render children()}
  {#if error}
    <p class="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
      <Icon icon="material-symbols:error-outline-rounded" width="15" class="shrink-0" />
      {error}
    </p>
  {/if}
</div>
