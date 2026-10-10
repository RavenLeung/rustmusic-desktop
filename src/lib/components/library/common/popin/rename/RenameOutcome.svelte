<script lang="ts">
  // Compte rendu du lot ; l'annulation vit ici, seul moment où l'on sait ce qu'on vient de faire.
  import Icon from "@iconify/svelte";
  import { fade } from "svelte/transition";
  import { t } from "#lib/i18n";
  import type { MoveOutcome } from "#lib/services/tags/rename.service";

  const {
    outcome,
    undoing,
    onundo,
  }: {
    outcome: MoveOutcome | null;
    undoing: boolean;
    onundo: () => void;
  } = $props();
</script>

{#if outcome}
  <div class="shrink-0 flex items-center gap-3 px-4 py-2.5
              border-t border-(--rg-bd)
              {outcome.failed.length > 0 ? 'bg-(--rg-ambg)' : 'bg-(--rg-creux-on)'}"
       transition:fade={{ duration: 120 }}>
    <Icon
      icon={outcome.failed.length > 0 ? "lucide:triangle-alert" : "lucide:check-circle-2"}
      width="14"
      class="shrink-0 {outcome.failed.length > 0 ? 'text-(--rg-am)' : 'text-(--rg-g)'}"
    />
    <span class="flex-1 min-w-0 text-[12.5px] font-medium text-(--rg-tx)">
      {outcome.succeeded} {$t("rename.renamed")}
      {#if outcome.failed.length > 0}
        · <span class="font-semibold text-(--rg-am)">
          {outcome.failed.length} {$t("rename.failed")}
        </span>
      {/if}
    </span>
    <button
      type="button"
      onclick={onundo}
      disabled={undoing}
      class="flex items-center gap-1.5 px-3.5 h-8 rounded-xl text-[12.5px] font-semibold
             cursor-pointer transition-colors
             text-(--rg-tx2) bg-(--rg-carte) border border-(--rg-bd)
             hover:border-(--rg-bd2) hover:text-(--rg-tx) disabled:opacity-50"
    >
      {#if undoing}
        <Icon icon="lucide:loader-circle" width="12" class="animate-spin" />
      {:else}
        <Icon icon="lucide:undo-2" width="12" />
      {/if}
      {$t("rename.undo")}
    </button>
  </div>

  {#if outcome.failed.length > 0}
    <div class="shrink-0 max-h-24 overflow-y-auto scrollbar-none px-4 pb-2 space-y-0.5">
      {#each outcome.failed as failure (failure.path)}
        <p class="flex items-baseline gap-2 text-[10.5px]">
          <span class="shrink-0 truncate max-w-[40%] text-(--rg-mu)"
                title={failure.path}>
            {failure.path.split(/[\\/]/).pop()}
          </span>
          <span class="min-w-0 text-(--rg-am)">{failure.message}</span>
        </p>
      {/each}
    </div>
  {/if}
{/if}
