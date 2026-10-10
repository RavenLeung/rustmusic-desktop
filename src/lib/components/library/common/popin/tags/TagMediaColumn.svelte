<script lang="ts">
  // Colonne des médias de l'éditeur d'un fichier : pochette, liste des images, identité du fichier.
  // Purement affichage : les gestes remontent au parent, qui possède la liste.
  import Icon from "@iconify/svelte";
  import { t } from "#lib/i18n";
  import {
    formatBytes,
    PICTURE_TYPE_COVER,
    type MediaSlot,
  } from "#lib/services/tags/tagEditor.service";

  let {
    slots,
    coverSlot,
    busy,
    submitting,
    path,
    filename,
    typeLabel,
    onadd,
    onreplace,
    onremove,
    onsetcover,
    onmove,
    onzoom,
  }: {
    slots: MediaSlot[];
    coverSlot: MediaSlot | null;
    /** Choix et préparation d'une image en cours. */
    busy: boolean;
    submitting: boolean;
    path: string;
    filename: string;
    typeLabel: (type: number) => string;
    onadd: () => void;
    onreplace: (index: number) => void;
    onremove: (index: number) => void;
    onsetcover: (index: number) => void;
    onmove: (index: number, delta: number) => void;
    onzoom: (slot: MediaSlot) => void;
  } = $props();

  let mediaBytes = $derived(slots.reduce((sum, s) => sum + s.bytes, 0));
  let extension = $derived((filename.split(".").pop() ?? "").toUpperCase());
</script>

<!-- Bouton d'une ligne de média, coloré au survol seulement : cinq boutons
     colorés noieraient la vignette. -->
{#snippet rowAction(
  icon: string,
  label: string,
  action: () => void,
  disabled: boolean,
  danger: boolean,
)}
  <button
    type="button"
    onclick={action}
    {disabled}
    title={label}
    aria-label={label}
    class="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center
           cursor-pointer transition-colors text-(--rg-mu2)
           disabled:opacity-25 disabled:cursor-not-allowed
           {danger
             ? 'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/8'
             : 'hover:text-(--rg-g) hover:bg-(--rg-gbg)'}"
  >
    <Icon {icon} width="12" />
  </button>
{/snippet}

<div
  class="relative group aspect-square rounded-2xl overflow-hidden shrink-0
         border border-(--rg-bd) bg-(--rg-s2)
         shadow-lg shadow-black/10 dark:shadow-black/50"
>
  {#if coverSlot}
    <img src={coverSlot.src} alt="" class="w-full h-full object-cover" />
    <button
      type="button"
      onclick={() => coverSlot && onzoom(coverSlot)}
      aria-label={$t('tags.zoom')}
      class="absolute inset-0 flex items-end justify-center pb-3 cursor-zoom-in
             opacity-0 group-hover:opacity-100 transition-opacity duration-150
             bg-linear-to-t from-black/75 via-black/10 to-transparent"
    >
      <!-- Fond opaque : le contraste élevé neutralise les `backdrop-filter`. -->
      <span
        class="flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-[11px] font-semibold
               bg-black/75 text-white ring-1 ring-white/25"
      >
        <Icon icon="lucide:maximize-2" width="11" />
        {$t('tags.zoom')}
      </span>
    </button>
    <!-- Après le survol dans le DOM pour rester au-dessus ; transparent aux clics. -->
    {#if coverSlot.picture_type === PICTURE_TYPE_COVER}
      <span
        class="absolute top-2 left-2 pointer-events-none
               flex items-center gap-1 px-1.5 py-0.5 rounded-lg
               text-[10px] font-bold uppercase tracking-wider
               bg-(--rg-g) text-(--rg-on-g) shadow-md shadow-black/30"
      >
        <Icon icon="lucide:star" width="9" />
        {$t('tags.cover')}
      </span>
    {/if}
  {:else}
    <button
      type="button"
      onclick={onadd}
      disabled={busy || submitting}
      class="w-full h-full flex flex-col items-center justify-center gap-2
             cursor-pointer transition-colors text-(--rg-mu)
             hover:text-(--rg-g) hover:bg-(--rg-gbg) disabled:opacity-50"
    >
      <Icon icon="lucide:image-plus" width="26" />
      <span class="text-[11px] font-semibold">{$t('tags.add_image')}</span>
    </button>
  {/if}
</div>

<!-- Une liste plutôt qu'une grille : elle nomme chaque image, donne son poids
     et laisse la place aux cinq actions. -->
<div class="shrink-0">
  <div class="mb-1.5 flex items-center gap-1.5">
    <span class="text-[11px] font-bold uppercase tracking-[0.1em] text-(--rg-mu)">
      {$t('tags.media')}
    </span>
    <span class="px-1.5 rounded-md font-mono text-[10px] font-bold tabular-nums
                 bg-(--rg-s2) text-(--rg-tx2)">
      {slots.length}
    </span>
    <span class="flex-1"></span>
    {#if slots.length > 0}
      <button
        type="button"
        onclick={onadd}
        disabled={busy || submitting}
        title={$t('tags.add_image')}
        aria-label={$t('tags.add_image')}
        class="w-6 h-6 rounded-lg flex items-center justify-center
               cursor-pointer transition-colors text-(--rg-mu2)
               hover:text-(--rg-g) hover:bg-(--rg-gbg) disabled:opacity-30"
      >
        <Icon icon={busy ? 'lucide:loader-circle' : 'lucide:plus'}
              width="13" class={busy ? 'animate-spin' : ''} />
      </button>
    {/if}
  </div>

  {#if slots.length === 0}
    <p class="text-[11px] text-(--rg-mu)">
      {$t('tags.no_media')}
    </p>
  {:else}
    <div class="space-y-1">
      {#each slots as slot, i (slot.key)}
        <div
          class="flex gap-2 p-1.5 rounded-xl border transition-colors
                 {slot.picture_type === PICTURE_TYPE_COVER
                   ? 'bg-(--rg-creux-on) border-(--rg-gbd)'
                   : 'border-transparent hover:bg-(--rg-s2)'}"
        >
          <button
            type="button"
            onclick={() => onzoom(slot)}
            title={$t('tags.zoom')}
            class="w-11 h-11 shrink-0 rounded-lg overflow-hidden cursor-zoom-in ring-1
                   {slot.picture_type === PICTURE_TYPE_COVER
                     ? 'ring-(--rg-g)/60'
                     : 'ring-(--rg-bd)'}"
          >
            <img src={slot.src} alt="" class="w-full h-full object-cover" />
          </button>

          <div class="min-w-0 flex-1">
            <p
              class="text-[11px] truncate
                     {slot.picture_type === PICTURE_TYPE_COVER
                       ? 'font-semibold text-(--rg-gtx)'
                       : 'font-medium text-(--rg-tx2)'}"
            >
              {typeLabel(slot.picture_type)}
            </p>
            <p class="text-[10px] truncate text-(--rg-mu)">
              {slot.mime_type.replace('image/', '').toUpperCase()} · {formatBytes(slot.bytes)}
              {#if slot.recompressed && slot.originalBytes}
                <span title="{formatBytes(slot.originalBytes)} → {formatBytes(slot.bytes)}"
                      class="text-(--rg-am)">· {$t('tags.reduced')}</span>
              {/if}
            </p>

            <div class="flex items-center gap-0.5 mt-0.5 -ml-1">
              {@render rowAction(
                'lucide:star',
                $t('tags.set_cover'),
                () => onsetcover(i),
                slot.picture_type === PICTURE_TYPE_COVER || submitting,
                false,
              )}
              {@render rowAction(
                'lucide:arrow-up',
                $t('tags.move_up'),
                () => onmove(i, -1),
                i === 0 || submitting,
                false,
              )}
              {@render rowAction(
                'lucide:arrow-down',
                $t('tags.move_down'),
                () => onmove(i, 1),
                i === slots.length - 1 || submitting,
                false,
              )}
              {@render rowAction(
                'lucide:refresh-cw',
                $t('tags.replace_image'),
                () => onreplace(i),
                busy || submitting,
                false,
              )}
              {@render rowAction(
                'lucide:trash-2',
                $t('tags.remove_image'),
                () => onremove(i),
                submitting,
                true,
              )}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Identité du fichier, juste sous les médias : collée en bas elle flottait dans le vide. -->
<div class="pt-3 shrink-0 border-t border-(--rg-bd)">
  <p
    class="text-[11.5px] font-semibold text-(--rg-tx2) break-all line-clamp-2"
    title={path}
  >
    {filename}
  </p>
  <div class="mt-1.5 flex flex-wrap gap-1">
    {#if extension}
      <span class="px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold tracking-wide
                   bg-(--rg-s2) border border-(--rg-bd) text-(--rg-mu)">
        {extension}
      </span>
    {/if}
    <!-- Poids des images intégrées, pas du fichier : l'icône évite de le lire
         comme la taille du MP3. -->
    {#if mediaBytes > 0}
      <span
        title="{$t('tags.media')} · {formatBytes(mediaBytes)}"
        class="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold
               bg-(--rg-s2) border border-(--rg-bd) text-(--rg-mu)"
      >
        <Icon icon="lucide:image" width="9" />
        {formatBytes(mediaBytes)}
      </span>
    {/if}
  </div>
</div>
