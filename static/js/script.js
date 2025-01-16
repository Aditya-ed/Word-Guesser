document.getElementById("word-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = document.getElementById("word-form");
    const formData = new FormData(form);
    const resultDiv = document.getElementById("result");


    const errorItems = resultDiv.querySelectorAll(".error-item");
    errorItems.forEach((item) => item.remove());

    try {
        const response = await fetch("/", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        const topElement = resultDiv.firstElementChild;
        // Create a new div for the guess
        const guessDiv = document.createElement("div");
        if (result.status === "success") {
            guessDiv.className = "guess-item";
            guessDiv.setAttribute("data-index", result.index); // Store index as a data attribute for sorting
            guessDiv.innerHTML = `<div style="display: flex; justify-content: space-between;">
                <span> ${result.word} </span><br>
                <span> ${result.index.toFixed(0)}</span>
            </div>`;
        } 
        else {
            guessDiv.className = "error-item";
            guessDiv.innerHTML = `<strong>Error:</strong> ${result.message}`;
        }

        // Append the div to the result section
        resultDiv.appendChild(guessDiv);

        // Sorting the divs after appending the new one
        sortDivs(resultDiv);
    } catch (error) {
        console.error("Error:", error);
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-item";
        errorDiv.innerHTML = `<strong>Error:</strong> An unexpected error occurred.`;
        resultDiv.appendChild(errorDiv);
    }

    // Clear the input field warna kabad aajayega
    form.reset();
});

// Function to sort the divs
function sortDivs(container) {
    // Get all child divs and convert to an array
    const divArray = Array.from(container.getElementsByClassName("guess-item"));

    // Sort the divs based on the data-index attribute
    divArray.sort((a, b) => {
        const indexA = parseFloat(a.getAttribute("data-index"));
        const indexB = parseFloat(b.getAttribute("data-index"));
        return indexA - indexB; // Ascending order karne ke liye
    });

    // Append the sorted divs(Wapis bhejre sort krke)
    divArray.forEach((div) => container.appendChild(div));
}
