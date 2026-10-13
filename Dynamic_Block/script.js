const addBlockBtn = document.getElementById("addBlockBtn");
const blockContainer = document.getElementById("blockContainer");

let blockCount = 0;

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

addBlockBtn.addEventListener("click", () => {
    blockCount++;

    const block = document.createElement("div");
    block.classList.add("block");

    block.style.backgroundColor = getRandomColor();
    block.textContent = `Block ${blockCount}`;

    blockContainer.appendChild(block);
});