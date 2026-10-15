const postBtn = document.getElementById("postBtn");
const output = document.getElementById("output");

postBtn.addEventListener("click", async function () {
    output.textContent = "Posting user...";

    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/posts',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'foo',
                    body: 'bar',
                    userId: 1
                })
            }
        );

        if (!response.ok) {
            throw new Error("HTTP Error:" + response.status);
        }

        const user = await response.json();
        output.textContent = JSON.stringify(user, null, 2);
    } catch (error) {
        output.textContent = "POST Error:" + error.message;
    }
});