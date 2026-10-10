<script lang="ts">
  // Bilan du pied de page : champs modifiés, image touchée, « tout rétablir » et la règle en info-bulle.
  import Icon from "@iconify/svelte";
  import { t } from "#lib/i18n";

  let {
    dirty,
    changedCount,
    extraLabel,
    hint,
    disabled,
    onreset,
  }: {
    dirty: boolean;
    changedCount: number;
    /** Modification hors champs (médias, pochette) ; vide si aucune. */
    extraLabel: string;
    hint: string;
    disabled: boolean;
    onreset: () => void;
  } = $props();
</script>

{#if dirty}
  <span class="flex items-center gap-1.5 text-[12px] font-medium text-(--rg-tx2)">
    <span class="w-1.5 h-1.5 rounded-full bg-(--rg-g) shadow-[0_0_6px_currentColor] text-(--rg-g)"></span>
    {#if changedCount}
      {changedCount}
      {changedCount > 1 ? $t('tags.changed_other') : $t('tags.changed_one')}
    {/if}
    {#if changedCount && extraLabel}·{/if}
    {#if extraLabel}{extraLabel}{/if}
  </span>
  <button
    type="button"
    onclick={onreset}
    {disabled}
    class="text-[12px] cursor-pointer underline decoration-dotted underline-offset-2
           text-(--rg-mu) hover:text-(--rg-tx)
           disabled:opacity-40 transition-colors"
  >
    {$t('tags.reset_all')}
  </button>
{:else}
  <span class="text-[12px] text-(--rg-mu)">
    {$t('tags.no_change')}
  </span>
{/if}

<!-- Une règle qui se lit une fois : en info-bulle, elle ne prend pas la place. -->
<span
  title={hint}
  class="text-(--rg-mu2) cursor-help hover:text-(--rg-tx2) transition-colors"
>
  <Icon icon="lucide:info" width="12" />
</span>
