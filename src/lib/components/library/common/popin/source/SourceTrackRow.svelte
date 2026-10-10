<script lang="ts">
  // Un morceau apparié : sa ligne (fichier → piste Deezer) et son détail dépliable.
  import Icon from "@iconify/svelte";
  import { slide } from "svelte/transition";
  import { t } from "#lib/i18n";
  import { valueOf } from "#lib/stores/tags/tagWorkshop.store";
  import { formatBytes } from "#lib/services/tags/tagEditor.service";
  import { formatDuration } from "#lib/services/tags/metadata.service";
  import SourceCellRow from "./SourceCellRow.svelte";
  import {
    cellKey,
    coverKey,
    shortName,
    type Pair,
    type SourceSelection,
  } from "./sourceSelection.svelte.js";

  const { pair, selection }: { pair: Pair; selection: SourceSelection } = $props();

  let chosen = $derived(selection.chosen);
  let remoteCover = $derived(selection.remoteCover);
  let keys = $derived(selection.pairKeys(pair));
  let count = $derived(keys.filter((k) => chosen.has(k)).length);
  let open = $derived(selection.opened.has(pair.index));
</script>

<div
  class="rounded-xl border transition-colors
         {count > 0 ? 'bg-(--rg-creux-on) border-(--rg-gbd)' : 'bg-(--rg-creux) border-(--rg-bd)'}"
>
  <div class="flex items-center gap-2.5 px-2.5 py-2">
    <input
      type="checkbox"
      checked={count > 0 && count === keys.length}
      indeterminate={count > 0 && count < keys.length}
      disabled={keys.length === 0}
      onchange={() => selection.toggleKeys(keys)}
      aria-label={valueOf(pair.file, 'title') || shortName(pair.file.path)}
      class="checkbox-app"
    />

    <!-- Titre d'ici et de là-bas sur une ligne : on vérifie l'appariement sans déplier. -->
    <span class="flex-1 min-w-0 flex items-center gap-2">
      <!-- Pochette du fichier : repère d'un coup d'œil ceux qui n'en ont pas. -->
      <span class="shrink-0 w-7 h-7 rounded-md overflow-hidden
                   border border-(--rg-bd) bg-(--rg-s2)">
        {#if pair.file.cover}
          <img src={pair.file.cover} alt="" class="w-full h-full object-cover" />
        {:else}
          <span class="w-full h-full flex items-center justify-center">
            <Icon icon="lucide:image-off" width="11"
                  class="text-(--rg-mu2)" />
          </span>
        {/if}
      </span>

      <span class="flex-1 min-w-0 text-[12.5px] font-medium truncate text-(--rg-tx)"
            title={shortName(pair.file.path)}>
        {valueOf(pair.file, 'title') || shortName(pair.file.path)}
      </span>
      <Icon icon="lucide:arrow-right" width="10"
            class="shrink-0 text-(--rg-mu2)" />

      <!-- Celle de Deezer seulement si retenue : sinon elle promettrait un changement. -->
      {#if remoteCover && chosen.has(coverKey(pair.file.path))}
        <span class="shrink-0 w-7 h-7 rounded-md overflow-hidden
                     ring-1 ring-(--rg-g)/60">
          <img src={remoteCover.src} alt="" class="w-full h-full object-cover" />
        </span>
      {/if}
      <span class="flex-1 min-w-0 text-[12.5px] truncate text-(--rg-tx2)"
            title={pair.track.title}>
        <span class="tabular-nums text-(--rg-mu)">
          {pair.track.position}.
        </span>
        {pair.track.title}
        <span class="text-[10.5px] font-mono text-(--rg-mu2)">
          {formatDuration(pair.track.duration)}
        </span>
      </span>
    </span>

    <!-- Appariement douteux : signalé ici seulement, la ligne à relire avant de cocher. -->
    {#if pair.doubtful}
      <span title={$t('source.doubtful')} class="shrink-0 flex">
        <Icon icon="lucide:circle-help" width="12"
              class="text-(--rg-am)" />
      </span>
    {/if}

    <span class="shrink-0 px-1.5 py-px rounded-[5px] border font-mono text-[10.5px] font-bold tabular-nums
                 {count > 0
                   ? 'bg-(--rg-gbg) border-(--rg-gbd) text-(--rg-gtx)'
                   : 'bg-(--rg-s2) border-(--rg-bd) text-(--rg-mu)'}">
      {#if keys.length === 0}
        {$t('source.identical_short')}
      {:else}
        {count}/{keys.length}
      {/if}
    </span>

    <button
      type="button"
      onclick={() => selection.toggleOpen(pair.index)}
      aria-label={$t('source.detail')}
      title={$t('source.detail')}
      class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
             cursor-pointer transition-colors
             text-(--rg-mu) hover:text-(--rg-tx) hover:bg-(--rg-hover)"
    >
      <Icon icon={open ? 'lucide:chevron-up' : 'lucide:chevron-down'} width="13" />
    </button>
  </div>

  {#if open}
    <div class="px-2.5 pb-2" transition:slide={{ duration: 140 }}>
      <!-- Colonnes nommées : en comparant, il faut savoir laquelle est la sienne. -->
      <div class="flex items-center gap-2.5 px-2 pb-1">
        <span class="shrink-0 w-4"></span>
        <span class="shrink-0 w-24"></span>
        <span class="flex-1 min-w-0 text-[10px] font-bold uppercase
                     tracking-[0.1em] text-(--rg-mu)">
          {$t('source.your_file')}
        </span>
        <span class="shrink-0 w-2.5"></span>
        <span class="flex-1 min-w-0 text-[10px] font-bold uppercase
                     tracking-[0.1em] text-(--rg-gtx)">
          Deezer
        </span>
      </div>

      <div class="space-y-px">
        <!-- La pochette d'abord : la seule ligne qu'on juge à l'œil. -->
        {#if remoteCover}
          {@const on = chosen.has(coverKey(pair.file.path))}
          <div class="flex items-center gap-2.5 px-2 py-1 rounded-md
                      {on ? 'bg-(--rg-gbg)/60' : ''}">
            <input
              type="checkbox"
              checked={on}
              onchange={() => selection.toggleKeys([coverKey(pair.file.path)])}
              aria-label={$t('tags.cover')}
              class="checkbox-app"
            />
            <span class="shrink-0 w-24 text-[11px] font-semibold truncate text-(--rg-mu)">
              {$t('tags.cover')}
            </span>

            <span class="flex-1 min-w-0 flex items-center gap-2">
              <span class="shrink-0 w-9 h-9 rounded-md overflow-hidden
                           border border-(--rg-bd) bg-(--rg-s2)">
                {#if pair.file.cover}
                  <img src={pair.file.cover} alt=""
                       class="w-full h-full object-cover" />
                {/if}
              </span>
              <span class="min-w-0 text-[11px] truncate
                           {pair.file.cover
                             ? 'text-(--rg-tx2)'
                             : 'italic text-(--rg-mu2)'}">
                {#if !pair.file.cover}
                  {$t('tags.no_media')}
                {:else if on}
                  <!-- Seul geste destructeur de l'écran : il se dit avant. -->
                  <span class="font-semibold text-(--rg-am)">
                    {$t('source.cover_replaced')}
                  </span>
                {/if}
              </span>
            </span>

            <Icon icon="lucide:arrow-right" width="10"
                  class="shrink-0 text-(--rg-mu2)" />

            <span class="flex-1 min-w-0 flex items-center gap-2">
              <span class="shrink-0 w-9 h-9 rounded-md overflow-hidden
                           ring-1 {on
                             ? 'ring-(--rg-g)/60'
                             : 'ring-(--rg-bd)'}">
                <img src={remoteCover.src} alt=""
                     class="w-full h-full object-cover" />
              </span>
              <!-- Dimensions et poids après préparation : ce qui sera écrit. -->
              <span class="min-w-0 font-mono text-[10.5px] leading-tight truncate text-(--rg-mu)">
                {remoteCover.width}×{remoteCover.height}<br />
                {formatBytes(remoteCover.bytes)}
              </span>
            </span>
          </div>
        {/if}

        {#each pair.cells as cell (cell.field)}
          <SourceCellRow
            {cell}
            on={chosen.has(cellKey(pair.file.path, cell.field))}
            ontoggle={() => selection.toggleCell(pair.file.path, cell.field)}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>
