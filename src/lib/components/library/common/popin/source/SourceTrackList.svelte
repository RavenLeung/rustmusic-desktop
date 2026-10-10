<script lang="ts">
  // Colonne des morceaux : outils de sélection, portée de l'appariement, une ligne par morceau.
  import Icon from "@iconify/svelte";
  import { slide } from "svelte/transition";
  import { t } from "#lib/i18n";
  import { valueOf } from "#lib/stores/tags/tagWorkshop.store";
  import SourceTrackRow from "./SourceTrackRow.svelte";
  import { shortName, type SourceSelection } from "./sourceSelection.svelte.js";

  const { selection }: { selection: SourceSelection } = $props();

  let proposal = $derived(selection.proposal);
  /** Les fichiers sans correspondance sont repliés : ils ne se lisent pas. */
  let showUnmatched = $state(false);
</script>

<div class="flex-1 min-w-0 flex flex-col min-h-0">
  {#if !proposal}
    <div class="flex-1 flex flex-col items-center justify-center gap-2.5">
      <Icon icon="lucide:disc-3" width="30" class="text-(--rg-mu2)" />
      <p class="text-[13px] text-(--rg-mu)">
        {$t('source.pick_album_first')}
      </p>
    </div>
  {:else}
    <!-- ─── Barre d'outils ─── -->
    <div class="shrink-0 flex items-center gap-1.5 px-4 py-2 border-b border-(--rg-bd)">
      <span class="mr-1 text-[11px] font-bold uppercase tracking-[0.1em] text-(--rg-mu)">
        {$t('source.select')}
      </span>
      {#each [['all', 'source.all'], ['empty', 'source.empty_only'], ['none', 'source.none']] as [mode, key] (mode)}
        <button
          type="button"
          onclick={() => selection.selectAll(mode as 'all' | 'empty' | 'none')}
          class="px-2 h-7 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors
                 text-(--rg-tx2) hover:bg-(--rg-hover) hover:text-(--rg-tx)"
        >
          {$t(key)}
        </button>
      {/each}

      <span class="flex-1"></span>

      <button
        type="button"
        onclick={() => selection.toggleAllOpen()}
        class="flex items-center gap-1.5 px-2 h-7 rounded-lg text-[12px] font-semibold
               cursor-pointer transition-colors
               text-(--rg-tx2) hover:bg-(--rg-hover) hover:text-(--rg-tx)"
      >
        <Icon icon={selection.allOpen ? 'lucide:chevrons-down-up' : 'lucide:chevrons-up-down'}
              width="12" />
        {selection.allOpen ? $t('source.collapse_all') : $t('source.expand_all')}
      </button>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto scrollbar-none px-3 py-2.5 space-y-1.5">
      <!-- Portée : combien de fichiers sélectionnés sont réellement concernés. -->
      {#if selection.unmatched.length > 0}
        <div class="rounded-xl border border-(--rg-ambd) bg-(--rg-ambg)">
          <button
            type="button"
            onclick={() => (showUnmatched = !showUnmatched)}
            class="w-full flex items-center gap-2.5 px-3 py-2 text-left
                   rounded-xl cursor-pointer transition-colors
                   hover:bg-(--rg-am)/8"
          >
            <Icon icon="lucide:triangle-alert" width="14"
                  class="shrink-0 text-(--rg-am)" />
            <span class="min-w-0 flex-1">
              <span class="block text-[12.5px] font-semibold text-(--rg-amtx)">
                {selection.pairs.length} {$t('source.matched_of')} {selection.targets.length}
                {$t('tags.files')}
              </span>
              <!-- Cause habituelle : l'album n'a pas autant de pistes que la sélection. -->
              <span class="block text-[11px] text-(--rg-am)">
                {$t('source.album_has')} {proposal.album.tracks.length}
                {$t('source.tracks')} · {selection.unmatched.length} {$t('source.left_untouched')}
              </span>
            </span>
            <Icon icon={showUnmatched ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                  width="13" class="shrink-0 text-(--rg-am)" />
          </button>

          {#if showUnmatched}
            <div class="px-3 pb-2 space-y-0.5" transition:slide={{ duration: 140 }}>
              {#each selection.unmatched as match (match.local_index)}
                {@const file = selection.localFile(match.local_index)}
                <div class="flex items-center gap-2.5 py-0.5">
                  <span class="flex-1 min-w-0 text-[12px] truncate text-(--rg-amtx)">
                    {file ? valueOf(file, 'title') || shortName(file.path) : '—'}
                  </span>
                  {#if selection.excluded.has(match.local_index)}
                    <button
                      type="button"
                      onclick={() => selection.toggleExcluded(match.local_index)}
                      class="shrink-0 text-[11px] font-semibold cursor-pointer transition-colors
                             text-(--rg-am) hover:text-(--rg-amtx) hover:underline"
                    >
                      {$t('source.include')}
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- ─── Les morceaux ─── -->
      {#each selection.pairs as pair (pair.file.path)}
        <SourceTrackRow {pair} {selection} />
      {/each}
    </div>
  {/if}
</div>
