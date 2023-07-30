const guessInput = document.getElementById("guessInput");
const checkBtn = document.getElementById("checkBtn");
const hint = document.getElementById("hint");

checkBtn.addEventListener("click", function() {
    const guess = guessInput.value;
    fetch("/guess", {
        method: "POST",
        body: JSON.stringify({ guess: guess }),
        headers: { 'Content-Type': 'application/json' }
    }).then(function(response) {
        return response.text();
    }).then(function(data) {
        hint.textContent = data;
    });
});
