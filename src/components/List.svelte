<script>
    import Sortable from "sortablejs"
    import { onMount } from "svelte"
    import CreateCard from "~/components/CreateCard.svelte"
    import ListTitle from "~/components/ListTitle.svelte"
    import Card from "~/components/Card.svelte"
    import { cards } from "~/store/list.js"

    export let list
    export let sortableLists

    let cardsEl
    let sortableCards

    function disableSortable(event) {
        sortableLists.option('disabled', event.detail)
        sortableCards.option('disabled', event.detail)
    }
    onMount(()=>{

        sortableCards = new Sortable(cardsEl, {
            group: 'My Cards',
            handle: '.card',
            delay: 50,
            animation: 0,
            forceFallback: true,
            onEnd(event) {
                cards.reorder({
                    fromListId: event.from.dataset.listId,
                    toListId: event.to.dataset.listId,
                    oldIndex: event.oldIndex,
                    newIndex: event.newIndex
                })
            }
        })
    })
</script>
<div class="list">
    <div class="list__inner">
        <div class="list__heading">
            <ListTitle {list} on:editMode={disableSortable} />
            <p>
                {list.cards.length} cards
            </p>
        </div>
        <div
          data-list-id={list.id}
          bind:this={cardsEl}
          class="list__cards">
            {#each list.cards as card (card.id)}
                <Card
                  listId={list.id}
                  {card}
                  on:editMode={disableSortable}
                />
            {/each}
        </div>
        <CreateCard 
          listId={list.id}
          on:editMode={disableSortable}/>
    </div>
</div>

<style lang="scss">
    .list{
        display: inline-block;
        font-size: 16px;
        white-space: normal;
        width: 290px;
        height: 100%;
        box-sizing: border-box;
        margin: 0 4px;
        line-height: 20px;
        :global(&.sortable-ghost) {
            opacity: .2;
            position: relative;
            &::after {
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
        :global(&.sortable-chosen) {
            cursor: move;
        }
        .list__inner {
            display: flex;
            flex-direction: column;
            max-height: 100%;
            padding: 10px 8px;
            box-sizing: border-box;
            background: #ebecf0;
            border-radius: 4px;
            .list__heading{
                margin-bottom: 10px;
                p {
                    color: #5e6c84;
                    padding: 0 8px;
                }
            }
            .list__cards{
                overflow-x: hidden;
                overflow-y: auto;
                margin-bottom: 10px;
            }
        }
    }
</style>