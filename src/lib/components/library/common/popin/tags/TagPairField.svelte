<script lang="ts">
  // « n sur N » : un seul tag (« 7/12 »), donc deux saisies dans un seul bloc.
  import TagField from "#lib/components/ui/input/TagField.svelte";

  let {
    label,
    number = $bindable(),
    total = $bindable(),
    dirty,
    disabled,
  }: {
    label: string;
    number?: string;
    total?: string;
    dirty: boolean;
    disabled: boolean;
  } = $props();
</script>

<TagField {label} {dirty}>
  {#snippet children()}
    <div class="flex items-baseline gap-1.5 mt-1.5">
      <input
        type="text"
        inputmode="numeric"
        data-focus-ring="none"
        bind:value={number}
        {disabled}
        placeholder="—"
        class="w-7 bg-transparent text-[13px] tabular-nums leading-tight text-right outline-none
               text-(--rg-tx) placeholder:text-(--rg-ph) disabled:opacity-50"
      />
      <span class="text-(--rg-mu2) select-none text-[13px]">/</span>
      <input
        type="text"
        inputmode="numeric"
        data-focus-ring="none"
        bind:value={total}
        {disabled}
        placeholder="—"
        class="w-7 bg-transparent text-[13px] tabular-nums leading-tight outline-none
               text-(--rg-mu) placeholder:text-(--rg-ph) disabled:opacity-50"
      />
    </div>
  {/snippet}
</TagField>
