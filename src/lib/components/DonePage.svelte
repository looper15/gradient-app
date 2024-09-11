<script lang="ts">
  export let donePageMessage: string;
  export let effectConfig: { name: string };
  export let onReset: () => void;
</script>

<div class=" h-full w-full">
  <h2 class="text-3xl font-medium text-text1 mb-2">
    Done! {effectConfig.name} added
  </h2>
  <p class="text-text2 mb-2">{donePageMessage}</p>
  <p class="text-text2 font-normal text-[11px] mb-6 relative z-1">
    Discalmer: sometimes not all styles may appear in the style panel, so please
    check that once.
  </p>
  <button
    class="text-[12px] font-weight-normal w-fit-content bg-actionPrimaryBackground hover:bg-actionPrimaryBackgroundHover text-actionPrimaryText font-medium py-2 px-3 rounded shadow-action-colored transition-colors"
    on:click={onReset}
  >
    Add More {effectConfig.name}s
  </button>
</div>
