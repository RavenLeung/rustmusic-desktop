<script lang="ts">
  // Titre d'un groupe de champs, prolongé d'un filet qui s'estompe.
  let { label }: { label: string } = $props();
</script>

<div class="flex items-center gap-2.5 mb-2">
  <span class="text-[11px] font-bold uppercase tracking-[0.1em] text-(--rg-mu)">
    {label}
  </span>
  <span class="flex-1 h-px bg-linear-to-r from-(--rg-bd) to-transparent"></span>
</div>
