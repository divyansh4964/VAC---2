const getBtn = document.getElementById("getBtn");
const output = document.getElementById("output");

getBtn.addEventListener("click", async function () {
    getBtn.addEventListener("click",async function () {
        output.textContent = "Loading users...";

        try{
            const response = await fetch(
                'https://jsonplaceholder.typicode.com/posts'
            );
            if(!response.ok){
                throw new Error("HTTP Error:" + response.status);
            }

            const users = await response.json();

            output.textContent = JSON.stringify(users, null, 2);
        }catch(error){
            output.textContent = "GET Error:" + error.message;
        }
    });
});