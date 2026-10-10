<script lang="ts">
  // Colonne de la source : recherche d'album, puis l'album retenu et ses raccourcis par champ.
  import Icon from "@iconify/svelte";
  import { t } from "#lib/i18n";
  import type { AlbumHit } from "#lib/services/tags/metadata.service";
  import type { SourceSelection } from "./sourceSelection.svelte.js";

  let {
    selection,
    query = $bindable(),
    hits,
    searching,
    matching,
    searched,
    onsearch,
    onpick,
  }: {
    selection: SourceSelection;
    query: string;
    hits: AlbumHit[];
    searching: boolean;
    matching: boolean;
    searched: boolean;
    onsearch: () => void;
    onpick: (hit: AlbumHit) => void;
  } = $props();

  let proposal = $derived(selection.proposal);
  let targets = $derived(selection.targets);
</script>

<aside
  class="shrink-0 w-64 flex flex-col min-h-0 overflow-y-auto scrollbar-none
         border-r border-(--rg-bd) bg-(--rg-creux)"
>
  {#if !proposal}
    <div class="shrink-0 p-4 space-y-2">
      <div class="flex gap-1.5">
        <input
          type="text"
          bind:value={query}
          onkeydown={(e) => e.key === 'Enter' && onsearch()}
          placeholder={$t('source.search_placeholder')}
          class="flex-1 min-w-0 h-9 px-3 rounded-xl text-[12.5px] outline-none transition-colors
                 bg-(--rg-champ) text-(--rg-tx) placeholder:text-(--rg-ph)
                 border border-(--rg-bd) hover:border-(--rg-bd2) focus:border-(--rg-g)"
        />
        <button
          type="button"
          onclick={() => onsearch()}
          disabled={searching || !query.trim()}
          aria-label={$t('source.search')}
          class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                 cursor-pointer transition hover:brightness-110 disabled:opacity-40
                 bg-(--rg-g) text-(--rg-on-g)"
        >
          <Icon icon={searching ? 'lucide:loader-circle' : 'lucide:search'}
                width="13" class={searching ? 'animate-spin' : ''} />
        </button>
      </div>
      <p class="text-[11px] text-(--rg-mu)">
        {targets.length} {$t('tags.files')}
      </p>
    </div>

    <div class="flex-1 min-h-0 px-2 pb-3 space-y-0.5">
      {#each hits as hit (hit.id)}
        <button
          type="button"
          onclick={() => onpick(hit)}
          disabled={matching}
          class="w-full flex items-center gap-2.5 p-1.5 rounded-[10px] text-left
                 cursor-pointer transition-colors disabled:opacity-50
                 hover:bg-(--rg-s2)"
        >
          <span class="shrink-0 w-10 h-10 rounded-md overflow-hidden
                       bg-(--rg-s2) border border-(--rg-bd)">
            {#if hit.cover}
              <img src={hit.cover} alt="" class="w-full h-full object-cover" />
            {/if}
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-[12.5px] font-semibold truncate text-(--rg-tx)">{hit.title}</span>
            <!-- Le nombre de pistes : premier indice qu'on tient le bon album. -->
            <span class="block text-[11px] truncate text-(--rg-mu)">
              {hit.artist} · {hit.track_count} {$t('source.tracks')}
              {#if hit.track_count === targets.length}
                <span class="text-(--rg-g)">✓</span>
              {/if}
            </span>
          </span>
        </button>
      {:else}
        {#if searched && !searching}
          <p class="px-2 py-8 text-center text-[12px] text-(--rg-mu)">
            {$t('source.no_result')}
          </p>
        {/if}
      {/each}
    </div>
  {:else}
    <!-- L'album retenu en grand : la pochette dit d'un coup d'œil si c'est le bon disque. -->
    <div class="shrink-0 p-4 space-y-3">
      <div class="aspect-square rounded-xl overflow-hidden
                  border border-(--rg-bd)
                  shadow-lg shadow-black/10 dark:shadow-black/50
                  bg-(--rg-s2)">
        {#if proposal.album.cover}
          <img src={proposal.album.cover} alt="" class="w-full h-full object-cover" />
        {/if}
      </div>

      <div>
        <p class="text-[14px] font-bold leading-tight text-(--rg-tx)">
          {proposal.album.title}
        </p>
        <p class="mt-0.5 text-[12px] text-(--rg-tx2)">
          {proposal.album.artist}
        </p>
        <div class="mt-1.5 flex flex-wrap gap-1">
          {#each [proposal.album.year, proposal.album.genre].filter(Boolean) as badge (badge)}
            <span class="px-1.5 py-0.5 rounded-[5px] border text-[10.5px] font-semibold
                         bg-(--rg-s2) border-(--rg-bd2) text-(--rg-mu)">{badge}</span>
          {/each}
          <!-- Pistes / fichiers : c'est ce badge qui dit si on a désigné le bon disque. -->
          <span
            title="{proposal.album.tracks.length} {$t('source.tracks')} · {targets.length} {$t('tags.files')}"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded-[5px] border text-[10.5px] font-bold tabular-nums
                   {proposal.album.tracks.length === targets.length
                     ? 'bg-(--rg-gbg) border-(--rg-gbd) text-(--rg-gtx)'
                     : 'bg-(--rg-ambg) border-(--rg-ambd) text-(--rg-am)'}"
          >
            <Icon
              icon={proposal.album.tracks.length === targets.length
                ? 'lucide:check'
                : 'lucide:triangle-alert'}
              width="9"
            />
            {proposal.album.tracks.length} / {targets.length}
          </span>
        </div>
      </div>

      <button
        type="button"
        onclick={() => (selection.proposal = null)}
        class="w-full flex items-center justify-center gap-1.5 px-2 h-8 rounded-xl
               text-[12px] font-semibold cursor-pointer transition-colors
               border border-(--rg-bd) text-(--rg-tx2)
               hover:bg-(--rg-hover) hover:border-(--rg-bd2) hover:text-(--rg-tx)"
      >
        <Icon icon="lucide:repeat" width="12" />
        {$t('source.change')}
      </button>
    </div>

    <!-- Raccourcis par champ : « toutes les années » d'un clic, sans parcourir les lignes. -->
    {#if selection.fieldSummary.length > 0}
      <div class="shrink-0 mt-auto px-4 py-3 space-y-2 border-t border-(--rg-bd)">
        <p class="text-[11px] font-bold uppercase tracking-[0.1em] text-(--rg-mu)">
          {$t('source.by_field')}
        </p>
        <div class="flex flex-wrap gap-1">
          {#each selection.fieldSummary as summary (summary.field)}
            {@const full = summary.picked === summary.total}
            {@const partial = summary.picked > 0 && !full}
            <button
              type="button"
              onclick={() => selection.toggleField(summary.field)}
              title="{summary.picked} / {summary.total}"
              class="flex items-center gap-1 px-1.5 h-6 rounded-md border text-[11px] font-semibold
                     cursor-pointer transition-colors
                     {full
                       ? 'bg-(--rg-gbg) border-(--rg-gbd) text-(--rg-gtx)'
                       : partial
                         ? 'bg-(--rg-creux-on) border-(--rg-gbd) text-(--rg-gtx)'
                         : 'bg-(--rg-s2) border-(--rg-bd) text-(--rg-mu) hover:border-(--rg-bd2)'}"
            >
              {$t(summary.label)}
              <span class="tabular-nums opacity-70">
                {partial ? `${summary.picked}/${summary.total}` : summary.total}
              </span>
            </button>
          {/each}
        </div>

        <p class="text-[11px] leading-relaxed text-(--rg-mu2)">
          {$t('source.limits')}
        </p>
      </div>
    {/if}
  {/if}
</aside>
