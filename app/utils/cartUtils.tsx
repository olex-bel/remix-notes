
export function setNewOffset(card: HTMLDivElement, mouseMoveDir = { x: 0, y: 0 }) {
    const offsetLeft = card.offsetLeft - mouseMoveDir.x;
    const offsetTop = card.offsetTop - mouseMoveDir.y;
 
    return {
        x: offsetLeft < 0 ? 0 : offsetLeft,
        y: offsetTop < 0 ? 0 : offsetTop,
    };
}

export function autoGrow(textArea: HTMLTextAreaElement) {
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + "px";     
}
