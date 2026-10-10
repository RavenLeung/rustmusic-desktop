<script lang="ts">
  // Bande d'erreur posée au-dessus du pied de page : dedans, un long message repousserait les boutons.
  import Icon from "@iconify/svelte";
  import { fade } from "svelte/transition";

  let { message }: { message: string } = $props();
</script>

<div
  class="shrink-0 flex items-start gap-2 px-6 py-2.5
         bg-red-500/8 border-t border-red-500/20 text-red-600 dark:text-red-400 text-xs"
  transition:fade={{ duration: 120 }}
>
  <Icon icon="lucide:alert-triangle" width="14" class="shrink-0 mt-px" />
  <span class="min-w-0">{message}</span>
</div>
