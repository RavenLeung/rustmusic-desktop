<script lang="ts">
  // Récemment joués : la page commune des playlists, avec « Vider l'historique ».
  import { invoke } from "@tauri-apps/api/core";
  import { onMount, untrack } from "svelte";
  import { t } from "#lib/i18n";
  import { recent } from "#lib/stores/recent/recent.store";
  import { libraryStore } from "#lib/stores/library/library.store";
  import { toasts } from "#lib/stores/ui/toast.store";
  import { resetTagCache } from "#lib/config/trackColumns";
  import RoundButton from "#lib/components/ui/button/RoundButton.svelte";
  import PlaylistTracksView from "#lib/components/playlist/PlaylistTracksView.svelte";
  import type { TrackListView } from "#lib/types/ui/library/track/TrackListView";

  let tracks = $state<TrackListView[]>([]);
  let loading = $state(true);
  let run = 0;

  const libraryId = $derived(
    $libraryStore.libraries.find((l) => l.is_default)?.id ?? $libraryStore.libraries[0]?.id ?? 0,
  );

  onMount(() => void recent.refreshRecent());

  // L'historique désigne ses morceaux par chemin : on les relit au format de la bibliothèque.
  $effect(() => {
    const paths = [...new Set($recent.map((x) => x.path).filter(Boolean))];
    untrack(() => load(paths, ++run));
  });

  async function load(paths: string[], n: number) {
    loading = true;
    try {
      const view = paths.length ? await invoke<TrackListView[]>("get_tracks_view_by_paths", { paths }) : [];
      if (n !== run) return;
      resetTagCache();
      const byPath = new Map(view.map((x) => [x.path, x]));
      tracks = paths.map((p) => byPath.get(p)).filter((x): x is TrackListView => !!x);
    } catch (e) {
      console.error("[récents] chargement :", e);
    } finally {
      if (n === run) loading = false;
    }
  }

  function clearHistory() {
    recent.clearRecent();
    toasts.push({ type: "success", title: $t("playlist_page.history_cleared"), message: $t("playlist_page.history_cleared_desc") });
  }
</script>

<PlaylistTracksView
  title={$t("playlist_page.recent_title")}
  kicker={$t("playlist_page.history")}
  color="#0ea5e9"
  icon="material-symbols:history-rounded"
  {tracks}
  {loading}
  {libraryId}
  emptyTitle={$t("playlist_page.empty_recent")}
  emptyDesc={$t("playlist_page.empty_recent_desc")}
>
  {#snippet actions()}
    {#if tracks.length > 0}
      <RoundButton icon="material-symbols:delete-sweep-outline-rounded" title={$t("playlist_page.clear_history")} onclick={clearHistory} />
    {/if}
  {/snippet}
</PlaylistTracksView>
