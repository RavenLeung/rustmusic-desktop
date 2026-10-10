<script lang="ts">
  // Colonne de l'éditeur par lot : pochette commune, fichiers visés et numérotation.
  // Purement affichage : la pochette et la numérotation appartiennent au parent.
  import Icon from "@iconify/svelte";
  import { t } from "#lib/i18n";
  import { fileName } from "#lib/services/batch/batch.service";
  import { formatBytes, type PreparedImage } from "#lib/services/tags/tagEditor.service";

  let {
    cover,
    coverBusy,
    submitting,
    paths,
    numbering,
    onpickcover,
    onremovecover,
    ontogglenumbering,
  }: {
    cover: (PreparedImage & { path: string }) | null;
    coverBusy: boolean;
    submitting: boolean;
    paths: string[];
    numbering: boolean;
    onpickcover: () => void;
    onremovecover: () => void;
    ontogglenumbering: () => void;
  } = $props();
</script>

<!-- Pochette commune : remplace celle de chaque fichier, laisse ses autres images. -->
<div
  class="relative group aspect-square rounded-2xl overflow-hidden shrink-0
         border border-(--rg-bd) bg-(--rg-s2)"
>
  {#if cover}
    <img src={cover.src} alt="" class="w-full h-full object-cover" />
    <span
      class="absolute top-2 left-2 pointer-events-none
             flex items-center gap-1 px-1.5 py-0.5 rounded-lg
             text-[10px] font-bold uppercase tracking-wider
             bg-(--rg-g) text-(--rg-on-g) shadow-md shadow-black/30"
    >
      <Icon icon="lucide:star" width="9" />
      {$t('tags.cover')}
    </span>
    <button
      type="button"
      onclick={onremovecover}
      title={$t('tags.remove_image')}
      aria-label={$t('tags.remove_image')}
      class="absolute top-2 right-2 w-6 h-6 rounded-lg cursor-pointer
             flex items-center justify-center
             bg-black/70 text-white hover:bg-red-500 transition-colors"
    >
      <Icon icon="lucide:x" width="12" />
    </button>
  {:else}
    <button
      type="button"
      onclick={onpickcover}
      disabled={coverBusy || submitting}
      class="w-full h-full flex flex-col items-center justify-center gap-2 px-3
             cursor-pointer transition-colors text-center text-(--rg-mu)
             hover:text-(--rg-g) hover:bg-(--rg-gbg) disabled:opacity-50"
    >
      <Icon
        icon={coverBusy ? 'lucide:loader-circle' : 'lucide:image-plus'}
        width="26"
        class={coverBusy ? 'animate-spin' : ''}
      />
      <span class="text-[11px] font-semibold leading-tight">
        {$t('tags.common_cover')}
      </span>
    </button>
  {/if}
</div>

{#if cover}
  <p class="shrink-0 text-[10.5px] text-(--rg-mu)">
    {cover.mime_type.replace('image/', '').toUpperCase()} · {formatBytes(cover.bytes)}
    {#if cover.recompressed}
      <span class="text-(--rg-am)">· {$t('tags.reduced')}</span>
    {/if}
    <br />
    {$t('tags.cover_keeps_others')}
  </p>
{/if}

<!-- Ce sur quoi on agit, à vérifier avant d'écrire : un lot mal ciblé ne se rattrape pas. -->
<div class="shrink-0">
  <p class="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase
            tracking-[0.1em] text-(--rg-mu)">
    {$t('tags.selection')}
    <span class="px-1.5 rounded-md font-mono text-[10px] tracking-normal tabular-nums
                 bg-(--rg-s2) text-(--rg-tx2)">
      {paths.length}
    </span>
  </p>
  <div class="max-h-52 overflow-y-auto scrollbar-none space-y-0.5">
    {#each paths as path, index (path)}
      <p
        class="flex items-baseline gap-1.5 px-2 py-1 rounded-lg text-[11.5px]
               text-(--rg-tx2) hover:bg-(--rg-s2)"
        title={path}
      >
        {#if numbering}
          <span class="shrink-0 w-4 text-right tabular-nums font-semibold text-(--rg-g)">
            {index + 1}
          </span>
        {/if}
        <span class="min-w-0 truncate">{fileName(path)}</span>
      </p>
    {/each}
  </div>

  <button
    type="button"
    onclick={ontogglenumbering}
    disabled={submitting}
    class="mt-2 w-full flex items-center justify-center gap-1.5 px-2 h-8 rounded-xl border
           text-[12px] font-semibold cursor-pointer transition-colors
           disabled:opacity-40 disabled:cursor-default
           {numbering
             ? 'bg-(--rg-gbg) border-(--rg-gbd) text-(--rg-gtx)'
             : 'border-(--rg-bd) text-(--rg-tx2) hover:border-(--rg-bd2) hover:bg-(--rg-s2)'}"
  >
    <Icon icon={numbering ? 'lucide:check' : 'lucide:list-ordered'} width="12" />
    {$t('tags.number_tracks')}
  </button>
</div>
