<script lang="ts">
import { resolveCoverSrc, type CoverSize } from "#lib/helper/tools/coverHelper";
import { whenNearViewport } from "#lib/helper/tools/nearViewport";
import FadeImg from "./FadeImg.svelte";
import type { HTMLImgAttributes } from "svelte/elements";

let { path, alt = "", size = 'full', ...rest }: {
    path: string | null | undefined;
    alt?: string;
    size?: CoverSize;
} & Omit<HTMLImgAttributes, "src" | "alt"> = $props();

let src = $state<string | null>(null);

// La miniature n'est demandée qu'à l'approche de l'écran : une grille de 900 cartes
// lançait 900 demandes au backend d'un coup (et autant de miniatures à fabriquer).
let near = $state(false);
let anchor = $state<HTMLElement | null>(null);
$effect(() => {
    if (near || !anchor) return;
    return whenNearViewport(anchor, () => (near = true));
});

$effect(() => {
    const currentPath = path;
    if (!currentPath) {
        src = null;
        return;
    }
    if (!near) return;
    // Pochette changée avant la réponse : l'ancienne ne doit pas s'afficher.
    let vivant = true;
    resolveCoverSrc(currentPath, size).then(url => {
        if (vivant) src = url;
    });
    return () => { vivant = false; };
});
</script>

{#if src}
    <FadeImg {src} {alt} {...rest} />
{:else}
    <!-- Même place que l'image à venir : c'est elle qu'on surveille. -->
    <span bind:this={anchor} class="block {rest.class ?? ''}" aria-hidden="true"></span>
{/if}
