<script lang="ts">
  // Une valeur dans le détail d'un morceau : ce qui diffère se coche, le reste se constate.
  // `absent` reste distinct de `same` : Deezer ne confirme pas ce qu'il ignore.
  import Icon from "@iconify/svelte";
  import { t } from "#lib/i18n";
  import type { Cell } from "./sourceSelection.svelte.js";

  const { cell, on, ontoggle }: { cell: Cell; on: boolean; ontoggle: () => void } = $props();
</script>

<div
  class="flex items-center gap-2.5 px-2 py-1 rounded-md
         {on ? 'bg-(--rg-gbg)/60' : ''}
         {cell.state === 'differs' ? '' : 'opacity-55'}"
>
  {#if cell.state === 'differs'}
    <input
      type="checkbox"
      checked={on}
      onchange={() => ontoggle()}
      aria-label={$t(`tags.${cell.field}`)}
      class="checkbox-app"
    />
  {:else}
    <span class="shrink-0 w-4 flex items-center justify-center">
      <Icon
        icon={cell.state === 'same' ? 'lucide:check' : 'lucide:minus'}
        width="10"
        class="text-(--rg-mu2)"
      />
    </span>
  {/if}

  <span class="shrink-0 w-24 text-[11px] font-semibold truncate text-(--rg-mu)">
    {$t(`tags.${cell.field}`)}
  </span>

  <span class="flex-1 min-w-0 text-[11.5px] truncate
               {cell.from
                 ? 'text-(--rg-tx2)'
                 : 'italic text-(--rg-mu2)'}"
        title={cell.from}>
    {cell.from || $t('workshop.was_empty')}
  </span>

  <Icon
    icon="lucide:arrow-right"
    width="10"
    class="shrink-0 {cell.state === 'differs'
      ? 'text-(--rg-mu2)'
      : 'text-transparent'}"
  />

  <span class="flex-1 min-w-0 text-[11.5px] truncate
               {cell.state === 'differs'
                 ? on
                   ? 'font-semibold text-(--rg-gtx)'
                   : 'text-(--rg-tx2)'
                 : cell.state === 'same'
                   ? 'text-(--rg-mu)'
                   : 'italic text-(--rg-mu2)'}"
        title={cell.to}>
    {cell.state === 'absent' ? $t('source.not_provided') : cell.to}
  </span>
</div>
