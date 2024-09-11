<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import tippy, { type Props, type Instance } from "tippy.js";
  import "tippy.js/dist/tippy.css";
  import "tippy.js/animations/shift-away.css";
  import "tippy.js/animations/shift-toward.css";
  import "tippy.js/animations/scale.css";
  import "tippy.js/animations/perspective.css";
  import {
    ArrowUpDown,
    MousePointerClick,
    ArrowRight,
    Type,
    Clock,
    Palette,
    Square,
    Box,
  } from "lucide-svelte";

  let tooltipEnabled = true;
  let tooltipMessage = "Tooltip";
  let animation: Props["animation"] = "perspective";
  let position: Props["placement"] = "right";
  let showDelay = 300;
  let hideDelay = 300;
  let theme = "custom";
  let trigger: Props["trigger"] = "click";
  let arrow = true;
  let backgroundColor = "#2E2E2E";
  let textColor = "#F5F5F5";
  let borderColor = "rgba(255, 255, 255, 0.13)";
  let borderWidth = 1;
  let borderRadius = 4;
  let boxShadow =
    "0px 0.5px 1px rgba(0, 0, 0, 0.8), inset 0px 0.5px 0.5px rgba(255, 255, 255, 0.12)";

  let buttonElement: HTMLButtonElement;
  let tippyInstance: Instance<Props>;

  onMount(() => {
    if (buttonElement) {
      tippyInstance = tippy(buttonElement, {
        content: tooltipMessage,
        animation,
        placement: position,
        delay: [showDelay, hideDelay],
        theme,
        trigger,
        arrow,
        duration: 200,
      });
    }
  });

  onMount(() => {
    webflow.setExtensionSize({ height: 460, width: 380 });
  });

  onDestroy(() => {
    if (tippyInstance) {
      tippyInstance.destroy();
    }
  });

  $: if (tippyInstance) {
    tippyInstance.setProps({
      content: tooltipMessage,
      animation,
      placement: position,
      delay: [showDelay, hideDelay],
      theme,
      trigger,
      arrow,
      duration: 200,
    });

    const tooltipElement = tippyInstance.popper.querySelector(
      ".tippy-box"
    ) as HTMLElement;
    if (tooltipElement) {
      tooltipElement.style.backgroundColor = backgroundColor;
      tooltipElement.style.color = textColor;
      tooltipElement.style.border = `${borderWidth}px solid ${borderColor}`;
      tooltipElement.style.borderRadius = `${borderRadius}px`;
      tooltipElement.style.boxShadow = boxShadow;
    }

    if (tooltipEnabled) {
      tippyInstance.enable();
    } else {
      tippyInstance.disable();
    }
  }

  function handleTriggerChange(event: Event) {
    const target = event.target as HTMLInputElement;
    trigger = target.checked ? "click" : "mouseenter";
  }
</script>

<div
  class="flex flex-col space-y-4 p-4 bg-[#1E1E1E] text-[#F5F5F5] min-h-screen font-sans text-large"
>
  <div
    class="bg-[#2E2E2E] border border-[rgba(255,255,255,0.13)] rounded-lg overflow-hidden"
  >
    <div class="border-b border-[rgba(255,255,255,0.13)] p-4">
      <h2 class="text-[#F5F5F5] text-xl font-semibold">Tooltip Preview</h2>
    </div>
    <div class="p-6">
      <div class="flex items-center justify-center h-40 bg-[#383838] rounded">
        <button
          bind:this={buttonElement}
          class="bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.10)_100%)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.16)_100%)] text-[#E0E0E0] shadow-[0px_0.5px_1px_rgba(0,0,0,0.8),inset_0px_0.5px_0.5px_rgba(255,255,255,0.12)] px-4 py-2 rounded"
        >
          Hover or Click Me
        </button>
      </div>
    </div>
  </div>

  <div
    class="bg-[#2E2E2E] border border-[rgba(255,255,255,0.13)] rounded-lg overflow-hidden"
  >
    <div class="border-b border-[rgba(255,255,255,0.13)] p-4">
      <h2 class="text-[#F5F5F5] text-xl font-semibold">Tooltip Editor</h2>
    </div>
    <div class="p-6">
      <div class="space-y-8">
        <div
          class="bg-[#383838] border border-[rgba(255,255,255,0.13)] rounded-lg overflow-hidden"
        >
          <div class="p-4">
            <h3 class="text-[#F5F5F5] text-lg font-semibold">Content</h3>
          </div>
          <div class="p-4 space-y-4">
            <div class="flex items-center justify-between">
              <label
                for="add-tooltip"
                class="text-sm font-medium text-[#BDBDBD]">Enable Tooltip</label
              >
              <input
                type="checkbox"
                id="add-tooltip"
                bind:checked={tooltipEnabled}
                class="toggle"
              />
            </div>
            <div>
              <label
                for="tooltip-message"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <Type class="w-4 h-4 inline mr-2" />
                Tooltip Message
              </label>
              <input
                id="tooltip-message"
                bind:value={tooltipMessage}
                class="mt-1 w-full bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2 shadow-[0px_1px_1px_-1px_rgba(0,0,0,0.13)_inset,0px_3px_3px_-3px_rgba(0,0,0,0.17)_inset,0px_4px_4px_-4px_rgba(0,0,0,0.17)_inset,0px_8px_8px_-8px_rgba(0,0,0,0.17)_inset,0px_12px_12px_-12px_rgba(0,0,0,0.13)_inset,0px_16px_16px_-16px_rgba(0,0,0,0.13)_inset]"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-[#383838] border border-[rgba(255,255,255,0.13)] rounded-lg overflow-hidden"
        >
          <div class="p-4">
            <h3 class="text-[#F5F5F5] text-lg font-semibold">Appearance</h3>
          </div>
          <div class="p-4 space-y-4">
            <div>
              <label
                for="animation"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <ArrowUpDown class="w-4 h-4 inline mr-2" />
                Animation
              </label>
              <select
                id="animation"
                bind:value={animation}
                class="mt-1 w-full bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2"
              >
                <option value="shift-away">Shift Away</option>
                <option value="shift-toward">Shift Toward</option>
                <option value="scale">Scale</option>
                <option value="perspective">Perspective</option>
              </select>
            </div>
            <div>
              <label
                for="position"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <ArrowRight class="w-4 h-4 inline mr-2" />
                Position
              </label>
              <select
                id="position"
                bind:value={position}
                class="mt-1 w-full bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label
                for="background-color"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <Square class="w-4 h-4 inline mr-2" />
                Background Color
              </label>
              <div class="flex mt-1">
                <input
                  id="background-color"
                  type="color"
                  bind:value={backgroundColor}
                  class="w-12 h-10 p-1 bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)]"
                />
                <input
                  bind:value={backgroundColor}
                  class="flex-grow ml-2 bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2"
                />
              </div>
            </div>
            <div>
              <label
                for="text-color"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <Type class="w-4 h-4 inline mr-2" />
                Text Color
              </label>
              <div class="flex mt-1">
                <input
                  id="text-color"
                  type="color"
                  bind:value={textColor}
                  class="w-12 h-10 p-1 bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)]"
                />
                <input
                  bind:value={textColor}
                  class="flex-grow ml-2 bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2"
                />
              </div>
            </div>
            <div>
              <label
                for="border-color"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <Box class="w-4 h-4 inline mr-2" />
                Border Color
              </label>
              <div class="flex mt-1">
                <input
                  id="border-color"
                  type="color"
                  bind:value={borderColor}
                  class="w-12 h-10 p-1 bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)]"
                />
                <input
                  bind:value={borderColor}
                  class="flex-grow ml-2 bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2"
                />
              </div>
            </div>
            <div>
              <label
                for="border-width"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <Box class="w-4 h-4 inline mr-2" />
                Border Width
              </label>
              <input
                id="border-width"
                type="number"
                min={0}
                max={10}
                bind:value={borderWidth}
                class="mt-1 w-full bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2 shadow-[0px_1px_1px_-1px_rgba(0,0,0,0.13)_inset,0px_3px_3px_-3px_rgba(0,0,0,0.17)_inset,0px_4px_4px_-4px_rgba(0,0,0,0.17)_inset,0px_8px_8px_-8px_rgba(0,0,0,0.17)_inset,0px_12px_12px_-12px_rgba(0,0,0,0.13)_inset,0px_16px_16px_-16px_rgba(0,0,0,0.13)_inset]"
              />
            </div>
            <div>
              <label
                for="border-radius"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <Box class="w-4 h-4 inline mr-2" />
                Border Radius
              </label>
              <input
                id="border-radius"
                type="number"
                min={0}
                max={20}
                bind:value={borderRadius}
                class="mt-1 w-full bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2 shadow-[0px_1px_1px_-1px_rgba(0,0,0,0.13)_inset,0px_3px_3px_-3px_rgba(0,0,0,0.17)_inset,0px_4px_4px_-4px_rgba(0,0,0,0.17)_inset,0px_8px_8px_-8px_rgba(0,0,0,0.17)_inset,0px_12px_12px_-12px_rgba(0,0,0,0.13)_inset,0px_16px_16px_-16px_rgba(0,0,0,0.13)_inset]"
              />
            </div>
            <div class="flex items-center justify-between">
              <label for="arrow" class="text-sm font-medium text-[#BDBDBD]"
                >Show Arrow</label
              >
              <input
                type="checkbox"
                id="arrow"
                bind:checked={arrow}
                class="toggle"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-[#383838] border border-[rgba(255,255,255,0.13)] rounded-lg overflow-hidden"
        >
          <div class="p-4">
            <h3 class="text-[#F5F5F5] text-lg font-semibold">Behavior</h3>
          </div>
          <div class="p-4 space-y-4">
            <div>
              <label
                for="show-delay"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <Clock class="w-4 h-4 inline mr-2" />
                Show Delay (ms)
              </label>
              <input
                id="show-delay"
                type="number"
                min={0}
                max={1000}
                bind:value={showDelay}
                class="mt-1 w-full bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2 shadow-[0px_1px_1px_-1px_rgba(0,0,0,0.13)_inset,0px_3px_3px_-3px_rgba(0,0,0,0.17)_inset,0px_4px_4px_-4px_rgba(0,0,0,0.17)_inset,0px_8px_8px_-8px_rgba(0,0,0,0.17)_inset,0px_12px_12px_-12px_rgba(0,0,0,0.13)_inset,0px_16px_16px_-16px_rgba(0,0,0,0.13)_inset]"
              />
            </div>
            <div>
              <label
                for="hide-delay"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <Clock class="w-4 h-4 inline mr-2" />
                Hide Delay (ms)
              </label>
              <input
                id="hide-delay"
                type="number"
                min={0}
                max={1000}
                bind:value={hideDelay}
                class="mt-1 w-full bg-[rgba(0,0,0,0.15)] border border-[rgba(255,255,255,0.13)] text-[#F5F5F5] rounded p-2 shadow-[0px_1px_1px_-1px_rgba(0,0,0,0.13)_inset,0px_3px_3px_-3px_rgba(0,0,0,0.17)_inset,0px_4px_4px_-4px_rgba(0,0,0,0.17)_inset,0px_8px_8px_-8px_rgba(0,0,0,0.17)_inset,0px_12px_12px_-12px_rgba(0,0,0,0.13)_inset,0px_16px_16px_-16px_rgba(0,0,0,0.13)_inset]"
              />
            </div>

            <div class="flex items-center justify-between">
              <label
                for="trigger"
                class="text-sm font-medium text-[#BDBDBD] flex items-center"
              >
                <MousePointerClick class="w-4 h-4 inline mr-2" />
                Trigger on Click
              </label>
              <input
                type="checkbox"
                id="trigger"
                checked={trigger === "click"}
                on:change={handleTriggerChange}
                class="toggle"
              />
            </div>
            d
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    background-color: #1e1e1e;
    color: #f5f5f5;
  }

  .toggle {
    appearance: none;
    width: 50px;
    height: 24px;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .toggle::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: #f5f5f5;
    border-radius: 50%;
    transition: transform 0.3s;
  }

  .toggle:checked {
    background-color: #4caf50;
  }

  .toggle:checked::after {
    transform: translateX(26px);
  }
</style>
