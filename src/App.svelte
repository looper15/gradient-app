<script lang="ts">
  import { onMount } from "svelte";

  enum AppState {
    MAIN,
    DONE,
    ERROR,
  }

  interface WebflowElement {
    styles: any[];
    getStyles: () => Promise<any[]>;
    setStyles: (styles: any[]) => Promise<void>;
    save: () => Promise<void>;
  }

  interface WebflowStyle {
    getName: () => Promise<string>;
    setProperty: (property: string, value: string) => Promise<void>;
    save: () => Promise<void>;
  }

  const NEW_SIZE = "comfortable";
  const DONE_MESSAGE_TIMEOUT = 3000;
  const API_TIMEOUT = 10000; // 10 seconds timeout for API calls

  let gradientCss = "";
  let appState: AppState = AppState.MAIN;
  let errorMessage = "";
  let selectedElement: WebflowElement | null = null;
  let donePageMessage = "Your gradient has been applied.";
  let buttonMessage = "";
  let showButtonMessage = false;
  let messageTimeout: number | null = null;

  $: isButtonDisabled = gradientCss.trim() === "";

  onMount(() => {
    webflow.setExtensionSize({ height: 440, width: 350 });
  });

  function buttonMessageToggle(message: string) {
    if (messageTimeout) clearTimeout(messageTimeout);
    showButtonMessage = true;
    buttonMessage = message;

    messageTimeout = window.setTimeout(() => {
      showButtonMessage = false;
    }, 3000);
  }

  function clearButtonMessage() {
    if (messageTimeout) clearTimeout(messageTimeout);
    showButtonMessage = false;
  }

  async function handleSubmit(): Promise<WebflowElement | null> {
    appState = AppState.MAIN;
    errorMessage = "";

    try {
      if (typeof webflow !== "undefined") {
        selectedElement = (await Promise.race([
          webflow.getSelectedElement(),
          new Promise<null>((_, reject) =>
            setTimeout(
              () => reject(new Error("API call timed out")),
              API_TIMEOUT,
            ),
          ),
        ])) as WebflowElement | null;
      }

      if (!selectedElement) {
        throw new Error("Please select an element first.");
      }

      const gradientRegex = /^(linear|radial|conic)-gradient\(\s*(.+?)\s*\);?$/;
      if (!gradientRegex.test(gradientCss.trim())) {
        throw new Error(
          "Invalid gradient CSS. Please check your input and try again.",
        );
      }

      console.log("Valid gradient:", gradientCss);
      return selectedElement;
    } catch (error) {
      appState = AppState.ERROR;
      errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      return null;
    }
  }

  async function CreateNewElementWithGradient() {
    selectedElement = await handleSubmit();
    if (!selectedElement) return;

    if (selectedElement?.styles) {
      try {
        // Insert a new div after the selected element
        const newElement = webflow.createDOM("div");
        //newElement.setStyles("background-image", gradientCss)
        
        selectedElement.setChildren([newElement]);

        await selectedElement.save();
        appState = AppState.DONE;
        setTimeout(() => {
          appState = AppState.MAIN;
        }, DONE_MESSAGE_TIMEOUT);
      } catch (error) {
        appState = AppState.ERROR;
        errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create new element with gradient.";
      }
    }
  }

  async function addGradientToPrimaryClass() {
    selectedElement = await handleSubmit();
    if (!selectedElement) return;

    if (selectedElement?.styles) {
      try {
        const styles = await selectedElement.getStyles();
        const stylesDetails = await Promise.all(
          styles.map(async (style: WebflowStyle) => ({
            name: await style.getName(),
          })),
        );

        console.log(stylesDetails);

        const retrievedStyle = await webflow.getStyleByName(
          stylesDetails[0].name,
        );
        if (!retrievedStyle) throw new Error("Primary style not found.");

        await retrievedStyle.setProperty("background-image", gradientCss);
        await retrievedStyle.save();

        appState = AppState.DONE;
        setTimeout(() => {
          appState = AppState.MAIN;
        }, DONE_MESSAGE_TIMEOUT);
      } catch (error) {
        appState = AppState.ERROR;
        errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to add gradient to primary class.";
      }
    } else {
      appState = AppState.ERROR;
      errorMessage =
        "Cannot add gradient to this element. It doesn't support styles.";
    }
  }

  async function addGradientToNewClass() {
    selectedElement = await handleSubmit();
    if (!selectedElement) return;

    if (selectedElement?.styles) {
      try {
        const newGradientName = await generateUniqueStyleName();
        const newStyle = await webflow.createStyle(newGradientName);
        newStyle.setProperties({
          "background-image": gradientCss,
        });

        await selectedElement.setStyles([newStyle]);
        await selectedElement.save();
        appState = AppState.DONE;
        setTimeout(() => {
          appState = AppState.MAIN;
        }, DONE_MESSAGE_TIMEOUT);
      } catch (error) {
        appState = AppState.ERROR;
        errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to add gradient to new class.";
      }
    } else {
      appState = AppState.ERROR;
      errorMessage =
        "Cannot add gradient to this element. It doesn't support styles.";
    }
  }

  async function generateUniqueStyleName(): Promise<string> {
    const MAX_ATTEMPTS = 1000;
    for (let counter = 0; counter < MAX_ATTEMPTS; counter++) {
      const styleName = `custom-gradient-${counter}`;
      const retrievedStyle = await webflow.getStyleByName(styleName);
      if (!retrievedStyle) {
        return styleName;
      }
    }
    throw new Error(
      "Unable to generate a unique style name. Too many existing styles.",
    );
  }

  function resetForm() {
    appState = AppState.MAIN;
    gradientCss = "";
    errorMessage = "";
  }

  // Action functions for Svelte custom elements
  function textarea(node: HTMLTextAreaElement, props: Record<string, any>) {
    function updateProps(props: Record<string, any>) {
      Object.entries(props).forEach(([key, value]) => {
        if (key === "value") {
          node.value = value as string;
        } else {
          node.setAttribute(key, value as string);
        }
      });
    }

    updateProps(props);

    return {
      update(newProps: Record<string, any>) {
        updateProps(newProps);
      },
    };
  }

  function button(node: HTMLButtonElement, props: Record<string, any>) {
    function updateProps(props: Record<string, any>) {
      Object.entries(props).forEach(([key, value]) => {
        if (key === "disabled") {
          node.disabled = value as boolean;
        } else {
          node.setAttribute(key, value as string);
        }
      });
    }

    updateProps(props);

    return {
      update(newProps: Record<string, any>) {
        updateProps(newProps);
      },
    };
  }
</script>

<div
  class="flex flex-col items-center justify-center min-h-[100%] bg-background1"
>
  <div class="w-[460px] max-w-[100%] min-h-[100%]">
    {#if appState === AppState.DONE}
      <div class="p-4 bg-background2 rounded shadow-menu h-full w-full">
        <h2 class="text-3xl font-medium text-text1 mb-2">Done!</h2>
        <p class="text-text2 mb-6">{donePageMessage}</p>
        <button
          class="text-[12px] font-weight-normal w-fit-content bg-actionPrimaryBackground hover:bg-actionPrimaryBackgroundHover text-actionPrimaryText font-medium py-2 px-3 rounded shadow-action-colored transition-colors"
          on:click={resetForm}
        >
          Add More Gradients
        </button>
      </div>
    {:else}
      <div class="p-4 bg-background2 rounded shadow-menu h-full w-full">
        <h1 class="text-2xl font-medium text-text1 mb-4">Gradient Generator</h1>
        <div class="mb-2">
          <label for="gradient-css" class="block text-text2 font-medium mb-2">
            Paste your gradient CSS:
          </label>
          <textarea
            use:textarea={{
              id: "gradient-css",
              value: gradientCss,
              class:
                "w-full border border-border1 bg-backgroundInput text-text1 rounded shadow-input-inner focus:border-actionPrimaryBackground focus:ring-1 focus:ring-actionPrimaryBackground p-2 min-h-[100px]",
              rows: 4,
              placeholder: "linear-gradient(to right, #4c51bf, #6b46c1)",
              "aria-label": "Gradient CSS Input",
            }}
            bind:value={gradientCss}
          />
          <p class="text-text2 font-normal text-[11px] mb-2 relative z-1">
            Don't add <span class="text-blue-300 italic">"background:"</span>
            and
            <span class="text-blue-300 italic">";"</span> at the end
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <button
            use:button={{
              class:
                "flex-1 bg-actionPrimaryBackground hover:bg-actionPrimaryBackgroundHover text-actionPrimaryText font-medium py-2 px-4 rounded shadow-action-colored transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              disabled: isButtonDisabled,
              "aria-label": "Add Gradient to all elements with same class",
            }}
            on:click={addGradientToPrimaryClass}
            on:mouseenter={() =>
              buttonMessageToggle(
                "This will apply the gradient to all elements with the same primary class.",
              )}
            on:mouseleave={clearButtonMessage}
            disabled={isButtonDisabled}
          >
            Add Gradient to all elements with same class
          </button>

          <button
            use:button={{
              class:
                "flex-1 bg-actionPrimaryBackground hover:bg-actionPrimaryBackgroundHover text-actionPrimaryText font-medium py-2 px-4 rounded shadow-action-colored transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              disabled: isButtonDisabled,
              "aria-label": "Add Gradient to the selected element only",
            }}
            on:click={addGradientToNewClass}
            on:mouseenter={() =>
              buttonMessageToggle(
                "This will create a new class for the selected element.",
              )}
            on:mouseleave={clearButtonMessage}
            disabled={isButtonDisabled}
          >
            Add Gradient to the selected element only
          </button>

          <button
            use:button={{
              class:
                "flex-1 bg-actionPrimaryBackground hover:bg-actionPrimaryBackgroundHover text-actionPrimaryText font-medium py-2 px-4 rounded shadow-action-colored transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              disabled: isButtonDisabled,
              "aria-label": "Add Gradient to a new custom element",
            }}
            on:click={CreateNewElementWithGradient}
            on:mouseenter={() =>
              buttonMessageToggle(
                "This will create a new element and apply the gradient to it.",
              )}
            on:mouseleave={clearButtonMessage}
            disabled={isButtonDisabled}
          >
          Add Gradient to a new custom element
          </button>
        </div>
        {#if showButtonMessage}
          <div class="mt-2 text-text2 font-normal text-[11px]">
            {buttonMessage}
          </div>
        {/if}
        {#if appState === AppState.ERROR}
          <div
            class="mt-4 p-2 border-1 border-red-300 bg-red-200/10 text-red-300 rounded"
            role="alert"
          >
            {errorMessage}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    font-family: "Inter", sans-serif;
    font-size: 12.5px;
  }
</style>
