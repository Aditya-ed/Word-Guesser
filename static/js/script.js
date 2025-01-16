const dataContainer = document.getElementById("data-container");
const myList = JSON.parse(dataContainer.getAttribute("data-list"));
console.log(myList)
var curr_index=10000;

function saveDivs() {
    const resultDiv = document.getElementById('result');
    const guessDivs = resultDiv.querySelectorAll('.guess-item');
    
    const divsArray = [];
    guessDivs.forEach(div => {
        divsArray.push(div.innerHTML);  // Save innerHTML (content) of each div
    });
    
    // Save array to LocalStorage
    localStorage.setItem('guessDivs', JSON.stringify(divsArray));
}

function loadDivs() {
    const savedDivs = localStorage.getItem('guessDivs');
    if (savedDivs) {
        const divsArray = JSON.parse(savedDivs);
        const resultDiv = document.getElementById('result');
        
        divsArray.forEach(content => {
            const newDiv = document.createElement('div');
            newDiv.className = 'guess-item';
            newDiv.innerHTML = content;
            resultDiv.appendChild(newDiv);
        });
    }
}



document.getElementById("word-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = document.getElementById("word-form");
    const formData = new FormData(form);
    const resultDiv = document.getElementById("result");
    const currDiv=document.getElementById("currdiv");

    const currItms=currDiv.querySelectorAll(".guess-item");
    currItms.forEach((item) => item.remove());

    const errorItems = resultDiv.querySelectorAll(".error-item");
    errorItems.forEach((item) => item.remove());
    

    try {
        const response = await fetch("/", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        // Create a new div for the guess
        const guessDiv = document.createElement("div");
        if (result.status === "success") {
            guessDiv.className = "guess-item";
            guessDiv.setAttribute("data-index", result.index); // Store index as a data attribute for sorting
            curr_index=Math.min(curr_index,result.index.toFixed(0));
            guessDiv.innerHTML = `<div style="display: flex; justify-content: space-between;">
                <span> ${result.word} </span><br>
                <span> ${result.index.toFixed(0)}</span>
            </div>`;
            const clonedDiv = guessDiv.cloneNode(true);
            currDiv.appendChild(clonedDiv);
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
    saveDivs();

    // Clear the input field warna kabad aajayega
    form.reset();

});

// Function to sort the divs
function sortDivs(container) {
    // Get all child divs and convert to an array
    const divArray = Array.from(container.getElementsByClassName("guess-item"));

    // Sort the divs based on the data-index attribute
    divArray.sort((a, b) => {
        const indexA = parseFloat(a.getAttribute("data-index")) || Infinity;
        const indexB = parseFloat(b.getAttribute("data-index")) || Infinity;
        return indexA - indexB; // Ascending order karne ke liye
    });

    // Append the sorted divs(Wapis bhejre sort krke)
    divArray.forEach((div) => container.appendChild(div));
}

// window.onload = loadDivs;

const dotsButton = document.querySelector('.dots-button');
const optionsMenu = document.querySelector('.options-menu');

// Toggle the visibility of the options menu when the dots button is clicked
dotsButton.addEventListener('click', function() {
    // Toggle the display of the options menu
    optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
});

// Close the options menu if the user clicks anywhere outside of it
window.addEventListener('click', function(event) {
    if (!dotsButton.contains(event.target) && !optionsMenu.contains(event.target)) {
        optionsMenu.style.display = 'none';
    }
});

function hintFunction() {
    const currDiv = document.getElementById("currdiv");
    const currItms=currDiv.querySelectorAll(".guess-item");
    currItms.forEach((item) => item.remove());
    const resultDiv = document.getElementById("result");
    const errorItems = resultDiv.querySelectorAll(".error-item");
    errorItems.forEach((item) => item.remove());
    new_index=Math.round(curr_index/2);
    console.log(new_index);
    const guessDiv = document.createElement("div");
    if(new_index>1)
    {
        
        guessDiv.className = "guess-item";
        guessDiv.setAttribute("data-index", new_index);
        guessDiv.innerHTML = `<div style="display: flex; justify-content: space-between;">
                <span> ${myList[new_index]} </span><br>
                <span> ${new_index}</span>
            </div>`;
            const clonedDiv = guessDiv.cloneNode(true);
            currDiv.appendChild(clonedDiv);
            
    }
    else {
        guessDiv.className = "error-item";
        guessDiv.innerHTML = `<strong>Error:</strong> ${"Closest you can get to word"}`;
    }
    resultDiv.appendChild(guessDiv);
    curr_index=new_index;
    sortDivs(resultDiv);
    
}


function giveUpFunction() {
    alert("Option 2 was clicked!");
}

document.querySelector('.help').addEventListener('click', hintFunction);
document.querySelector('.giveup').addEventListener('click', giveUpFunction);