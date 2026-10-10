<script lang="ts">
  // Barre de la colonne des champs : ce que Deezer vient de remplir, et l'accès à la recherche.
  import Icon from "@iconify/svelte";
  import { fade } from "svelte/transition";
  import { t } from "#lib/i18n";

  let {
    filled,
    disabled,
    onfetch,
  }: {
    /** Clés des champs repris (et `cover`). */
    filled: string[];
    disabled: boolean;
    onfetch: () => void;
  } = $props();
</script>

<div class="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-(--rg-bd)">
  {#if filled.length > 0}
    <span class="flex-1 min-w-0 flex items-center gap-1.5 text-[11px] font-medium truncate text-(--rg-gtx)"
          transition:fade={{ duration: 120 }}>
      <Icon icon="lucide:sparkles" width="11" class="shrink-0" />
      <!-- Les champs sont nommés : « 6 champs » laisserait chercher lesquels. -->
      {filled.map((k) => $t(`tags.${k}`)).join(', ')}
    </span>
  {:else}
    <span class="flex-1"></span>
  {/if}
  <button
    type="button"
    onclick={onfetch}
    {disabled}
    class="shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-xl text-[12px] font-semibold
           cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-default
           border border-(--rg-gbd) bg-(--rg-gbg) text-(--rg-gtx) hover:border-(--rg-g)"
  >
    <Icon icon="lucide:cloud-download" width="12" />
    {$t('source.fetch')}
  </button>
</div>
