<script lang="ts">
  import { onMount } from "svelte";
  import EffectApplier from "./lib/components/EffectApplier.svelte";

  onMount(() => {
    webflow.setExtensionSize({ height: 460, width: 380 });
  });

  const gradientConfig = {
    name: "gradient",
    cssProperty: "background-image",
    inputLabel: "Gradient CSS",
    placeholderText: "background: linear-gradient(45deg, #ff0000, #00ff00)",
    dontAddText: "background:",
    validationRegex:
      /^(?:background|background-image)?\s*:\s*((?:linear|radial|conic)-gradient\((?:[^()]+|\([^()]*\))*\));?$/,
  };

  const shadowConfig = {
    name: "shadow",
    cssProperty: "box-shadow",
    inputLabel: "Shadow CSS",
    placeholderText: "box-shadow: 3px 3px blue, -3px -3px red",
    dontAddText: "box-shadow:",
    validationRegex:
      /^box-shadow:\s*((?:(?:inset\s+)?-?\d+(?:\.\d+)?(?:px|em|rem|%)\s+-?\d+(?:\.\d+)?(?:px|em|rem|%)(?:\s+-?\d+(?:\.\d+)?(?:px|em|rem|%))?(?:\s+-?\d+(?:\.\d+)?(?:px|em|rem|%))?(?:\s+(?:rgb|rgba|hsl|hsla)\([^)]+\)|\s+#[0-9a-fA-F]{3,8}|\s+[a-zA-Z]+)?,?\s*)+);?$/,
  };

  const dropShadowConfig = {
    name: "Drop shadow",
    cssProperty: "filter",
    inputLabel: "Drop Shadow CSS",
    placeholderText: "filter: drop-shadow(#e23 0.5rem 0.5rem 1rem)",
    dontAddText: "filter:",
    validationRegex:
      /^(?:filter:\s*)?drop-shadow\((?:[^()]+|\([^()]*\))*\)(?:\s*drop-shadow\((?:[^()]+|\([^()]*\))*\))*;?$/,
  };

  function handleReset() {
    console.log("Effect form reset");
  }

  let activeTab = 0;
  const tabs = [
    {
      title: "Add Gradient",
      component: gradientConfig,
      donePageMessage: "Your gradient has been applied.",
    },
    {
      title: "Add Shadows",
      component: shadowConfig,
      donePageMessage: "Your shadow has been applied.",
    },
    {
      title: "Add Drop-shadow",
      component: dropShadowConfig,
      donePageMessage: "Your drop shadow has been applied.",
    },
  ];

  function setActiveTab(index) {
    activeTab = index;
  }
</script>

<div
  class="font-sans text-text1 bg-transparent rounded w-[460px] max-w-[100%] min-h-[100%]"
>
  <div class="flex border-b border-border1">
    {#each tabs as tab, index}
      <button
        class="px-4 py-3 flex-grow text-large font-medium focus:outline-none transition-colors duration-200 ease-in-out"
        class:text-text1={activeTab === index}
        class:text-textInactive={activeTab !== index}
        class:bg-background2={activeTab === index}
        class:bg-backgroundInactive={activeTab !== index}
        class:border-b-2={activeTab === index}
        class:border-actionPrimaryBackground={activeTab === index}
        on:click={() => setActiveTab(index)}
      >
        {tab.title}
      </button>
    {/each}
  </div>
  <div class="p-4 bg-[#353535]">
    <EffectApplier
      effectConfig={tabs[activeTab].component}
      donePageMessage={tabs[activeTab].donePageMessage}
      on:reset={handleReset}
    />
  </div>
</div>

<style>
  :global(body) {
    font-family: "Inter", sans-serif;
    font-size: 12.5px;
  }
</style>
