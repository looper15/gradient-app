<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import DonePage from "./DonePage.svelte";

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
    after: (preset: any) => Promise<WebflowElement>;
  }

  interface WebflowStyle {
    getName: () => Promise<string>;
    setProperty: (property: string, value: string) => Promise<void>;
    save: () => Promise<void>;
  }

  interface EffectConfig {
    name: string;
    cssProperty: string;
    inputLabel: string;
    placeholderText: string;
    dontAddText: string;
    validationRegex: RegExp;
  }

  const DONE_MESSAGE_TIMEOUT = 5000;
  const API_TIMEOUT = 10000; // 10 seconds timeout for API calls

  export let effectConfig: EffectConfig;
  export let donePageMessage: string = `Your ${effectConfig.name} has been applied.`;

  let cssInput = "";
  let appState: AppState = AppState.MAIN;
  let errorMessage = "";
  let selectedElement: WebflowElement | null = null;
  let buttonMessage = "";
  let showButtonMessage = false;
  let messageTimeout: number | null = null;

  $: isButtonDisabled = cssInput.trim() === "";

  const dispatch = createEventDispatcher();

  // Centralized error handling function
  function handleError(
    error: Error | string,
    showNotify = true,
    updateAppState = true
  ) {
    const errorMsg = error instanceof Error ? error.message : error;

    if (showNotify && typeof webflow !== "undefined") {
      webflow.notify({ type: "Error", message: errorMsg });
    }

    if (updateAppState) {
      appState = AppState.ERROR;
      errorMessage = errorMsg;
    }
  }

  function hideErrorMessage() {
    errorMessage = "";
    appState = AppState.MAIN;
  }

  function buttonMessageToggle(message: string) {
    if (messageTimeout) clearTimeout(messageTimeout);
    showButtonMessage = true;
    buttonMessage = message;
  }

  function clearButtonMessage() {
    if (messageTimeout) clearTimeout(messageTimeout);
    showButtonMessage = false;
  }

  async function handleSubmit(): Promise<WebflowElement | null> {
    appState = AppState.MAIN;
    errorMessage = "";

    if (typeof webflow === "undefined") {
      handleError("Webflow is not defined");
      return null;
    }

    try {
      const element = await Promise.race([
        webflow.getSelectedElement(),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("API call timed out")), API_TIMEOUT)
        ),
      ]);

      console.log(element);

      if (!element) {
        handleError("Please select an element first.");
        return null;
      }

      if (!effectConfig.validationRegex.test(cssInput.trim())) {
        handleError(
          `Invalid ${effectConfig.inputLabel}. Please check your input and try again.`
        );
        return null;
      }

      console.log(`Valid ${effectConfig.name}:`, cssInput);
      return element as WebflowElement;
    } catch (error) {
      handleError(error);
      return null;
    }
  }

  async function createNewElementWithEffect() {
    try {
      const currentElement = await handleSubmit();
      if (!currentElement) return;

      const newElement = await currentElement.after(
        webflow.elementPresets.DivBlock
      );
      await webflow.setSelectedElement(newElement);

      selectedElement = newElement;
      await addEffectToNewClass();
    } catch (error) {
      handleError(
        `Failed to create new element with ${effectConfig.name}: ${error}`
      );
    }
  }

  async function addEffectToPrimaryClass() {
    try {
      const currentElement = await handleSubmit();
      if (!currentElement) return;

      const styles = await currentElement.getStyles();
      console.log(styles);
      if (styles == null || styles.length === 0) {
        selectedElement = currentElement;
        await addEffectToNewClass();
        return;
      }

      const primaryStyleName = await styles[0].getName();
      const primaryStyle = await webflow.getStyleByName(primaryStyleName);

      await primaryStyle.setProperty(effectConfig.cssProperty, cssInput);

      appState = AppState.DONE;
      donePageMessage = `Your ${effectConfig.name} has been applied to the primary class of the selected element`;
      webflow.notify({
        type: "Success",
        message: donePageMessage,
      });

      setTimeout(() => {
        donePageMessage = `Your ${effectConfig.name} has been applied.`;
        appState = AppState.MAIN;
      }, DONE_MESSAGE_TIMEOUT);
    } catch (error) {
      handleError(
        `Failed to add ${effectConfig.name} to primary class: ${error}`
      );
    }
  }

  async function addEffectToNewClass() {
    try {
      selectedElement = await handleSubmit();
      if (!selectedElement) return;

      if (selectedElement?.styles) {
        const newEffectName = await generateUniqueStyleName();
        const newStyle = await webflow.createStyle(newEffectName);
        newStyle.setProperties({
          [effectConfig.cssProperty]: cssInput,
        });

        await selectedElement.setStyles([newStyle]);

        appState = AppState.DONE;
        donePageMessage = `New DOM element has been created and ${effectConfig.name} has been applied to it`;
        webflow.notify({
          type: "Success",
          message: donePageMessage,
        });
        setTimeout(() => {
          appState = AppState.MAIN;
          donePageMessage = `Your ${effectConfig.name} has been applied.`;
        }, DONE_MESSAGE_TIMEOUT);
      } else {
        handleError(
          `Cannot add ${effectConfig.name} to this element. It doesn't support styles.`
        );
      }
    } catch (error) {
      handleError(`Failed to add ${effectConfig.name} to new class: ${error}`);
    }
  }

  async function generateUniqueStyleName(): Promise<string> {
    const MAX_ATTEMPTS = 1000;
    for (let counter = 0; counter < MAX_ATTEMPTS; counter++) {
      const styleName = `custom-${effectConfig.name}-${counter}`;
      const retrievedStyle = await webflow.getStyleByName(styleName);
      if (!retrievedStyle) {
        return styleName;
      }
    }
    handleError(
      "Unable to generate a unique style name. Too many existing styles."
    );
    return "";
  }

  function resetForm() {
    appState = AppState.MAIN;
    cssInput = "";
    errorMessage = "";
    dispatch("reset");
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
  class="flex flex-col items-center justify-center min-h-[100%] bg-[#353535]"
>
  <div class="w-[460px] max-w-[100%] min-h-[100%]">
    {#if appState === AppState.DONE}
      <DonePage {donePageMessage} {effectConfig} onReset={resetForm} />
    {:else}
      <div>
        <div class="mb-2">
          <label for="css-input" class="block text-text2 font-medium mb-2">
            Paste your {effectConfig.inputLabel}:
          </label>
          <textarea
            use:textarea={{
              id: "css-input",
              value: cssInput,
              class:
                "w-full maxlength-[200px] border border-border1 bg-backgroundInput text-text1 rounded shadow-input-inner focus:border-actionPrimaryBackground focus:ring-1 focus:ring-actionPrimaryBackground p-2 min-h-[100px]",
              rows: 4,
              placeholder: effectConfig.placeholderText,
              "aria-label": `${effectConfig.inputLabel} Input`,
            }}
            on:input={hideErrorMessage}
            bind:value={cssInput}
          />
          <p class="text-text2 font-normal text-[11px] mb-2 relative z-1">
            Don't add <span class="text-blue-300 italic"
              >"{effectConfig.dontAddText}"</span
            >
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <button
            use:button={{
              class:
                "flex-1 bg-actionPrimaryBackground hover:bg-actionPrimaryBackgroundHover text-actionPrimaryText font-medium py-2 px-4 rounded shadow-action-colored transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              disabled: isButtonDisabled,
              "aria-label": `Add ${effectConfig.name} to all elements with same class`,
            }}
            on:click={addEffectToPrimaryClass}
            on:mouseenter={() =>
              buttonMessageToggle(
                `This will apply the ${effectConfig.name} to all elements with the same primary class.`
              )}
            on:mouseleave={clearButtonMessage}
            disabled={isButtonDisabled}
          >
            Add {effectConfig.name} to all elements with same class
          </button>

          <button
            use:button={{
              class:
                "flex-1 bg-actionPrimaryBackground hover:bg-actionPrimaryBackgroundHover text-actionPrimaryText font-medium py-2 px-4 rounded shadow-action-colored transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              disabled: isButtonDisabled,
              "aria-label": `Add ${effectConfig.name} to a new custom element`,
            }}
            on:click={createNewElementWithEffect}
            on:mouseenter={() =>
              buttonMessageToggle(
                `This will create a new element and apply the ${effectConfig.name} to it.`
              )}
            on:mouseleave={clearButtonMessage}
            disabled={isButtonDisabled}
          >
            Add {effectConfig.name} to a new custom element
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
