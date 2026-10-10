<script lang="ts">
  // L'aperçu à blanc : nom actuel → nom après, une case par ligne modifiable.
  import Icon from "@iconify/svelte";
  import { t } from "#lib/i18n";
  import type { RenamePreview } from "#lib/services/tags/rename.service";

  const {
    empty,
    preview,
    excluded,
    selectedCount,
    changeableCount,
    allSelected,
    ontoggle,
    onselectall,
  }: {
    /** Aucun fichier ciblé. */
    empty: boolean;
    preview: RenamePreview | null;
    excluded: Set<string>;
    selectedCount: number;
    changeableCount: number;
    allSelected: boolean;
    ontoggle: (path: string) => void;
    onselectall: (all: boolean) => void;
  } = $props();
</script>

<div class="flex-1 min-h-0 overflow-y-auto scrollbar-none px-3 py-2.5">
  {#if empty}
    <p class="py-16 text-center text-[13px] text-(--rg-mu)">
      {$t("rename.no_file")}
    </p>
  {:else if !preview}
    <div class="space-y-1" aria-hidden="true">
      {#each Array.from({ length: 6 }) as _, i (i)}
        <div class="h-9 rounded-lg animate-pulse bg-(--rg-s2)"></div>
      {/each}
    </div>
  {:else}
    <!-- Colonnes nommées : savoir lequel des deux noms est l'actuel. -->
    <div class="flex items-center gap-2.5 px-2.5 pb-1.5">
      <!-- État intermédiaire : trois lignes décochées sur cent, une case vide mentirait. -->
      <input
        type="checkbox"
        checked={allSelected}
        indeterminate={selectedCount > 0 && !allSelected}
        disabled={changeableCount === 0}
        onchange={() => onselectall(!allSelected)}
        aria-label={$t("source.select")}
        class="checkbox-app"
      />
      <span class="flex-1 min-w-0 text-[10px] font-bold uppercase tracking-[0.1em] text-(--rg-mu)">
        {$t("rename.current")}
      </span>
      <span class="shrink-0 w-3"></span>
      <span class="flex-1 min-w-0 text-[10px] font-bold uppercase tracking-[0.1em] text-(--rg-gtx)">
        {$t("rename.after")}
      </span>
    </div>

    <div class="space-y-0.5">
      {#each preview.moves as move (move.from)}
        {@const on = !move.blocked && !move.unchanged && !excluded.has(move.from)}
        <div
          class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border
                 {move.blocked
                   ? 'bg-red-500/8 border-red-500/25'
                   : move.unchanged
                     ? 'bg-(--rg-creux) border-(--rg-bd) opacity-55'
                     : on
                       ? 'bg-(--rg-creux-on) border-(--rg-gbd)'
                       : 'bg-(--rg-creux) border-(--rg-bd)'}"
        >
          <!-- Pas de case sans choix : bloquée ou déjà conforme, rien à cocher. -->
          {#if move.blocked || move.unchanged}
            <span class="shrink-0 w-4 flex items-center justify-center">
              <Icon
                icon={move.blocked ? "lucide:ban" : "lucide:check"}
                width="11"
                class={move.blocked
                  ? "text-red-600 dark:text-red-400"
                  : "text-(--rg-mu2)"}
              />
            </span>
          {:else}
            <input
              type="checkbox"
              checked={on}
              onchange={() => ontoggle(move.from)}
              aria-label={move.from_name}
              class="checkbox-app"
            />
          {/if}

          <span class="flex-1 min-w-0 text-[12px] truncate
                       {on || move.blocked
                         ? 'text-(--rg-tx2)'
                         : 'text-(--rg-mu)'}"
                title={move.from}>
            {move.from_name}
          </span>

          <Icon
            icon={move.blocked
              ? "lucide:x"
              : move.unchanged
                ? "lucide:equal"
                : "lucide:arrow-right"}
            width="11"
            class="shrink-0 {move.blocked
              ? 'text-red-600 dark:text-red-400'
              : 'text-(--rg-mu2)'}"
          />

          <span class="flex-1 min-w-0 text-[12px] truncate" title={move.to}>
            {#if move.blocked}
              <!-- La raison plutôt que le nom cible : elle dit quoi changer. -->
              <span class="text-red-600 dark:text-red-400">
                {move.issues.map((i) => $t(`rename.issue.${i}`)).join(" · ")}
                {#if move.missing.length > 0}
                  : {move.missing.map((f) => $t(`rename.field.${f}`)).join(", ")}
                {/if}
              </span>
            {:else if move.unchanged}
              <span class="italic text-(--rg-mu)">
                {$t("rename.unchanged")}
              </span>
            {:else}
              <span class={on
                ? "font-semibold text-(--rg-gtx)"
                : "text-(--rg-mu)"}>
                {move.to_name}
              </span>
            {/if}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>
