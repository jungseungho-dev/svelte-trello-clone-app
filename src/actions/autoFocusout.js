export function autoFocusout(node, focusoutListener) {
    const focusinListener = event => {
        event.stopPropagation()
    }

    setTimeout(() => {
        node.addEventListener('click', focusinListener)
        window.addEventListener('click', focusoutListener)
    })
    return {
        destroy() {
            node.removeEventListener('click', focusinListener)
            window.removeEventListener('click', focusoutListener)
        }
    }
}