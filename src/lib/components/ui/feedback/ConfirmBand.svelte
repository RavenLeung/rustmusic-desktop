<script lang="ts">
  // Bandeau ambre de confirmation en bas de popin : message, annuler, confirmer.
  import Icon from "@iconify/svelte";
  import { fade } from "svelte/transition";
  import type { Snippet } from "svelte";

  const {
    open,
    busy = false,
    cancelLabel,
    confirmLabel,
    oncancel,
    onconfirm,
    children,
  }: {
    open: boolean;
    /** Action en cours : boutons désactivés, roue sur la confirmation. */
    busy?: boolean;
    cancelLabel: string;
    confirmLabel: string;
    oncancel: () => void;
    onconfirm: () => void;
    children: Snippet;
  } = $props();
</script>

{#if open}
  <div class="shrink-0 flex items-center gap-3 px-6 py-2.5
              bg-(--rg-ambg) border-t border-(--rg-ambd)"
       transition:fade={{ duration: 120 }}>
    <Icon icon="lucide:triangle-alert" width="15" class="shrink-0 text-(--rg-am)" />
    <span class="flex-1 min-w-0 text-[12px] font-medium text-(--rg-amtx)">
      {@render children()}
    </span>
    <button
      type="button"
      onclick={oncancel}
      disabled={busy}
      class="px-3.5 h-8 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors
             text-(--rg-amtx) hover:bg-(--rg-am)/15
             disabled:opacity-50 disabled:cursor-default"
    >
      {cancelLabel}
    </button>
    <button
      type="button"
      onclick={onconfirm}
      disabled={busy}
      class="flex items-center gap-1.5 px-3.5 h-8 rounded-xl text-[12px] font-bold
             cursor-pointer transition
             bg-(--rg-am) text-(--rg-ambg) hover:brightness-110
             disabled:opacity-50 disabled:cursor-default"
    >
      {#if busy}
        <Icon icon="lucide:loader-circle" width="13" class="animate-spin" />
      {/if}
      {confirmLabel}
    </button>
  </div>
{/if}
