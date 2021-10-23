<script>
    import { tick, createEventDispatcher, onDestroy } from "svelte";
    import { autoFocusout } from "~/actions/autoFocusout"
    import { cards } from "~/store/list";

    export let listId
    export let card
    let isEditMode = false;
    let title
    let textareaEl
    const dispatch = createEventDispatcher()


    function saveCard() {
        if(title.trim()) {
            cards.edit({
                listId,
                cardId: card.id,
                title,
            })
        }
        offEditMode()
    }
    function removeCard() {
        cards.remove({
            listId,
            cardId: card.id
        })
        offEditMode()
    }
    async function onEditMode() {
        isEditMode = true;
        title = card.title
        dispatch('editMode', true)
        await tick()
        textareaEl && textareaEl.focus()
    }
    function offEditMode() {
        isEditMode = false;
        dispatch('editMode', false)
    }
    // onDestroy(()=>{
    //     dispatch('editMode', false)
    // })
</script>
<div class="card">
    {#if isEditMode}
        <div
          use:autoFocusout={offEditMode}
          class="edit-mode">
            <textarea 
              bind:value={title}
              bind:this={textareaEl}
              placeholder="Enter a title for this card..."
              on:keydown={evenet => {
                evenet.key === 'Enter' && saveCard()
                evenet.key === 'Escape' && offEditMode()
                evenet.key === 'Esc' && offEditMode()
              }}></textarea>
              <div class="actions">
                  <div 
                    on:click={saveCard}
                    class="btn success">
                      Save
                  </div>
                  <div 
                    on:click={offEditMode}
                    class="btn">
                      Cancel
                  </div>
                  <div
                    on:click={removeCard}
                    class="btn danger">
                      Romove Card
                  </div>
              </div>
        </div>
    {:else}
        <div class="title">
            {card.title}
            <div
              on:click={onEditMode}
              class="btn small">
                Edit
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .card {
        margin-bottom: 8px;
        &:last-child {
            margin-bottom: 1px;
        }
        :global(&.sortable-ghost){
            opacity: .1;
            position: relative;
            &::after{
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                border-radius: 4px;
            }
        }
        :global(&.sortable-chosen){
            cursor: move;
        }
        .title{
            background: #fff;
            padding: 6px 8px;
            border-radius: 4px;
            box-shadow: 0 1px 0 rgba(9, 30, 66, .25);
            line-height: 20px;
            position: relative;
            &:hover {
                background: #f5f5f5;
            }
            .btn {
                position: absolute;
                top: 0px;
                right: 0px;
                display: none;
            }
            &:hover .btn {
                display: block;
            }
        }
    }
</style>