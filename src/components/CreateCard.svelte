<script>
    import { tick, createEventDispatcher, onDestroy } from "svelte";
    import { autoFocusout } from "~/actions/autoFocusout";
    import { cards } from "~/store/list"

    export let listId

    let isEditMode = false
    let title = ''
    let textareaEl
    const dispatch = createEventDispatcher()

    function addCard() {
        if (title.trim()) {
            cards.add({
                listId,
                title
            })
        }
        offEditMode()
    }
    async function onEditMode() {
        isEditMode = true
        title = ''
        dispatch('editMode', true)
        await tick()
        textareaEl && textareaEl.focus()
    }
    function offEditMode() {
        isEditMode = false
        dispatch('editMode', false)
    }
    // onDestroy(() => {
    //     dispatch('editMode', false)
    // })
</script>
{#if isEditMode}
    <div
      use:autoFocusout={offEditMode}
      class="edit-mode"
      >

        <textarea
          bind:value={title}
          bind:this={textareaEl}
          placeholder="Enter a title for this card..."
          on:keydown={event => {
              event.key === 'Enter' && addCard()
              event.key === 'Escape' && offEditMode()
              event.key === 'Esc' && offEditMode()
          }}></textarea>
          <div class="actions">
              <div
                on:click={addCard}
                class="btn success"
              >
                  Add card
              </div>
              <div 
                on:click={offEditMode}
                class="btn"
              >
                  Cancel
              </div>
          </div>
    </div>
{:else}
    <div 
      on:click={onEditMode}
      class="add-another-card"
    >
        + Add another card
    </div>
{/if}

<style lang="scss">
    .add-another-card {
        padding: 4px 8px;
        font-size: 14px;
        color: #5e6c84;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
            background: rgba(9, 30, 66, .08);
            color: #172b4d;
        }
    }
</style>